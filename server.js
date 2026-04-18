const path = require("path");
const crypto = require("crypto");
const express = require("express");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();
const port = Number(process.env.PORT || 8080);
const sessionSecret = process.env.APP_SESSION_SECRET;

if (!process.env.SUPABASE_DB_URL) {
  throw new Error("Brakuje zmiennej SUPABASE_DB_URL.");
}

if (!sessionSecret) {
  throw new Error("Brakuje zmiennej APP_SESSION_SECRET.");
}

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: process.env.SUPABASE_DB_URL.includes("supabase") ? { rejectUnauthorized: false } : undefined,
});

const SESSION_COOKIE = "app_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname)));

const toPlDate = (value) => {
  if (!value) {
    return "";
  }
  return new Intl.DateTimeFormat("pl-PL", { timeZone: "Europe/Warsaw" }).format(new Date(value));
};

const parseCookies = (cookieHeader = "") =>
  cookieHeader
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .reduce((acc, chunk) => {
      const separatorIndex = chunk.indexOf("=");
      if (separatorIndex === -1) {
        return acc;
      }
      const key = chunk.slice(0, separatorIndex).trim();
      const value = chunk.slice(separatorIndex + 1).trim();
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

const signSessionValue = (payloadBase64) =>
  crypto.createHmac("sha256", sessionSecret).update(payloadBase64).digest("base64url");

const serializeSessionCookie = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    exp: Date.now() + SESSION_MAX_AGE_MS,
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = signSessionValue(payloadBase64);
  return `${payloadBase64}.${signature}`;
};

const readSessionFromRequest = (req) => {
  const cookies = parseCookies(req.headers.cookie || "");
  const rawCookie = cookies[SESSION_COOKIE];
  if (!rawCookie) {
    return null;
  }

  const [payloadBase64, signature] = rawCookie.split(".");
  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSignature = signSessionValue(payloadBase64);
  if (signature.length !== expectedSignature.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8"));
  if (!payload.exp || payload.exp < Date.now()) {
    return null;
  }

  return payload;
};

const setSessionCookie = (res, user) => {
  const value = serializeSessionCookie(user);
  const isSecure = process.env.NODE_ENV === "production";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
      SESSION_MAX_AGE_MS / 1000
    }${isSecure ? "; Secure" : ""}`
  );
};

const clearSessionCookie = (res) => {
  const isSecure = process.env.NODE_ENV === "production";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isSecure ? "; Secure" : ""}`
  );
};

const requireAuth = (req, res, next) => {
  const session = readSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "UNAUTHORIZED" });
    return;
  }

  req.user = session;
  next();
};

const getDocumentNumberParts = (kind = "offer", date = new Date()) => {
  const normalizedKind = kind === "receipt" ? "receipt" : "offer";
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return {
    key: `${normalizedKind}:${year}:${month}`,
    prefix: normalizedKind === "receipt" ? "RA" : "OF",
    year,
    month,
  };
};

const formatDocumentNumber = ({ prefix, year, month }, value) =>
  `${prefix}/${year}/${month}/${String(value).padStart(3, "0")}`;

const previewDocumentNumber = async (kind = "offer") => {
  const now = new Date();
  const parts = getDocumentNumberParts(kind, now);
  const { rows } = await pool.query(
    "select current_value from public.document_counters where counter_key = $1",
    [parts.key]
  );
  const nextValue = (rows[0]?.current_value || 0) + 1;
  return formatDocumentNumber(parts, nextValue);
};

const nextDocumentNumber = async (client, issueDate, kind = "offer") => {
  const parts = getDocumentNumberParts(kind, new Date(issueDate));
  const { rows } = await client.query(
    `
      insert into public.document_counters(counter_key, current_value, updated_at)
      values ($1, 1, now())
      on conflict (counter_key)
      do update
        set current_value = public.document_counters.current_value + 1,
            updated_at = now()
      returning current_value
    `,
    [parts.key]
  );
  return formatDocumentNumber(parts, rows[0].current_value);
};

const mapOfferItems = (rows) =>
  rows.map((row) => ({
    id: row.id,
    name: row.item_name,
    unit: row.unit,
    quantity: Number(row.quantity),
    price: Number(row.unit_price),
    total: Number(row.line_total),
  }));

const mapOfferRow = (row, items) => ({
  id: row.id,
  number: row.offer_number,
  title: row.title,
  author: row.author_name,
  authorUserId: row.author_user_id,
  clientType: row.client_type,
  clientLabel: row.client_label,
  clientDetails: row.client_details || {},
  issueDate: row.issue_date,
  date: toPlDate(row.issue_date),
  validUntil: row.valid_until || "",
  notes: row.notes || "",
  items,
  totalLabel: new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(Number(row.totals_gross)),
  netLabel: new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(Number(row.totals_net)),
  vatLabel: new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(Number(row.totals_vat)),
  grossLabel: new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(Number(row.totals_gross)),
  vatRate: row.vat_rate === "bez" ? "none" : row.vat_rate,
  warranty: `${row.warranty_months} miesięcy`,
  contractTerms: row.contract_terms || {},
});

const mapContractRow = (row) => ({
  id: row.id,
  offerId: row.offer_id,
  offerNumber: row.offer_number,
  clientLabel: row.client_label,
  totalLabel: row.summary_total_label,
  warranty: `${row.warranty_months} miesięcy`,
});

const mapBoardNotes = (noteRows, entryRows) => {
  const entriesByNoteId = entryRows.reduce((acc, row) => {
    if (!acc[row.note_id]) {
      acc[row.note_id] = [];
    }
    acc[row.note_id].push({
      id: row.id,
      text: row.body,
      author: row.author_name,
      createdAt: row.created_at,
    });
    return acc;
  }, {});

  return noteRows.map((row) => {
    const entries = entriesByNoteId[row.id] || [];
    return {
      id: row.id,
      text: entries[0]?.text || row.body,
      author: row.author_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by_name || row.author_name,
      entries,
    };
  });
};

const loadBootstrapData = async () => {
  const offersResult = await pool.query(
    `
      select
        o.*,
        u.full_name as author_name
      from public.offers o
      join public.app_users u on u.id = o.author_user_id
      order by o.updated_at desc, o.created_at desc
    `
  );

  const offerIds = offersResult.rows.map((row) => row.id);
  const itemsResult = offerIds.length
    ? await pool.query(
        `
          select *
          from public.offer_items
          where offer_id = any($1::uuid[])
          order by sort_order asc, created_at asc
        `,
        [offerIds]
      )
    : { rows: [] };

  const itemsByOfferId = itemsResult.rows.reduce((acc, row) => {
    if (!acc[row.offer_id]) {
      acc[row.offer_id] = [];
    }
    acc[row.offer_id].push(row);
    return acc;
  }, {});

  const offers = offersResult.rows.map((row) => mapOfferRow(row, mapOfferItems(itemsByOfferId[row.id] || [])));

  const contractsResult = await pool.query(
    `
      select
        c.*,
        o.offer_number
      from public.contracts c
      join public.offers o on o.id = c.offer_id
      where coalesce(o.contract_terms->>'documentKind', 'offer') <> 'receipt'
      order by c.updated_at desc, c.created_at desc
    `
  );

  const contracts = contractsResult.rows.map(mapContractRow);

  const notesResult = await pool.query(
    `
      select
        n.*,
        author.full_name as author_name,
        updater.full_name as updated_by_name
      from public.board_notes n
      join public.app_users author on author.id = n.author_user_id
      left join public.app_users updater on updater.id = n.updated_by_user_id
      where n.is_deleted = false
      order by n.updated_at desc, n.created_at desc
    `
  );

  const noteIds = notesResult.rows.map((row) => row.id);
  const noteEntriesResult = noteIds.length
    ? await pool.query(
        `
          select
            e.*,
            u.full_name as author_name
          from public.board_note_entries e
          join public.app_users u on u.id = e.author_user_id
          where e.note_id = any($1::uuid[])
          order by e.created_at desc
        `,
        [noteIds]
      )
    : { rows: [] };

  const boardNotes = mapBoardNotes(notesResult.rows, noteEntriesResult.rows);
  const nextNumber = await previewDocumentNumber("offer");

  return { offers, contracts, boardNotes, nextNumber };
};

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/login", asyncHandler(async (req, res) => {
  const login = String(req.body?.login || "").trim();
  const password = String(req.body?.password || "").trim();

  if (!login || !password) {
    res.status(400).json({ error: "MISSING_CREDENTIALS" });
    return;
  }

  const result = await pool.query("select * from public.verify_app_user_password($1, $2)", [login, password]);
  const matchedUser = result.rows[0];

  if (!matchedUser) {
    res.status(401).json({ error: "INVALID_CREDENTIALS" });
    return;
  }

  await pool.query("update public.app_users set last_login_at = now() where id = $1", [matchedUser.user_id]);

  const user = {
    id: matchedUser.user_id,
    username: matchedUser.username,
    name: matchedUser.full_name,
    role: matchedUser.role,
  };

  setSessionCookie(res, user);
  res.json({ user });
}));

app.post("/api/logout", (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/bootstrap", requireAuth, asyncHandler(async (req, res) => {
  const data = await loadBootstrapData();
  res.json({
    user: req.user,
    offers: data.offers,
    contracts: data.contracts,
    boardNotes: data.boardNotes,
    nextOfferNumber: data.nextNumber,
  });
}));

app.get("/api/offers/preview-number", requireAuth, asyncHandler(async (req, res) => {
  const nextNumber = await previewDocumentNumber(req.query.kind);
  res.json({ nextOfferNumber: nextNumber });
}));

app.post("/api/offers", requireAuth, asyncHandler(async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("begin");

    const offer = req.body || {};
    const items = Array.isArray(offer.items) ? offer.items : [];
    const warrantyMonths = Number.parseInt(String(offer.warranty || "12"), 10) || 12;
    const totalsNet = Number(offer.totals?.net ?? 0);
    const totalsVat = Number(offer.totals?.vat ?? 0);
    const totalsGross = Number(offer.totals?.gross ?? 0);
    const issueDate = offer.issueDate || new Date().toISOString().slice(0, 10);
    const documentKind = offer.contractTerms?.documentKind === "receipt" ? "receipt" : "offer";
    const expectedNumberPrefix = documentKind === "receipt" ? "RA/" : "OF/";

    let offerId = offer.id || null;
    let offerNumber = offer.number || null;
    const existingOfferResult = offerId
      ? await client.query("select id, offer_number, issue_date from public.offers where id = $1", [offerId])
      : { rows: [] };
    const existingOffer = existingOfferResult.rows[0];

    if (existingOffer) {
      offerNumber = existingOffer.offer_number;
      if (!offerNumber.startsWith(expectedNumberPrefix)) {
        offerNumber = await nextDocumentNumber(client, issueDate, documentKind);
      }
    } else {
      offerNumber = await nextDocumentNumber(client, issueDate, documentKind);
      offerId = crypto.randomUUID();
    }

    const normalizedVatRate = offer.vatRate === "none" ? "bez" : offer.vatRate;

    const upsertOfferResult = await client.query(
      `
        insert into public.offers (
          id,
          offer_number,
          title,
          author_user_id,
          client_type,
          client_label,
          client_details,
          issue_date,
          valid_until,
          notes,
          vat_rate,
          totals_net,
          totals_vat,
          totals_gross,
          warranty_months,
          contract_terms
        )
        values (
          $1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb
        )
        on conflict (id) do update
        set
          offer_number = excluded.offer_number,
          title = excluded.title,
          author_user_id = excluded.author_user_id,
          client_type = excluded.client_type,
          client_label = excluded.client_label,
          client_details = excluded.client_details,
          valid_until = excluded.valid_until,
          notes = excluded.notes,
          vat_rate = excluded.vat_rate,
          totals_net = excluded.totals_net,
          totals_vat = excluded.totals_vat,
          totals_gross = excluded.totals_gross,
          warranty_months = excluded.warranty_months,
          contract_terms = excluded.contract_terms,
          updated_at = now()
        returning *
      `,
      [
        offerId,
        offerNumber,
        offer.title,
        req.user.id,
        offer.clientType,
        offer.clientLabel,
        JSON.stringify(offer.clientDetails || {}),
        issueDate,
        offer.validUntil || null,
        offer.notes || null,
        normalizedVatRate,
        totalsNet,
        totalsVat,
        totalsGross,
        warrantyMonths,
        JSON.stringify(offer.contractTerms || {}),
      ]
    );

    await client.query("delete from public.offer_items where offer_id = $1", [offerId]);

    for (const [index, item] of items.entries()) {
      await client.query(
        `
          insert into public.offer_items (
            offer_id,
            sort_order,
            item_name,
            unit,
            quantity,
            unit_price,
            line_total
          )
          values ($1,$2,$3,$4,$5,$6,$7)
        `,
        [offerId, index, item.name, item.unit, Number(item.quantity || 0), Number(item.price || 0), Number(item.total || 0)]
      );
    }

    if (documentKind === "receipt") {
      await client.query("delete from public.contracts where offer_id = $1", [offerId]);
    } else {
      await client.query(
        `
          insert into public.contracts (
            offer_id,
            author_user_id,
            client_label,
            summary_total_label,
            warranty_months,
            contract_snapshot
          )
          values ($1,$2,$3,$4,$5,$6::jsonb)
          on conflict (offer_id) do update
          set
            author_user_id = excluded.author_user_id,
            client_label = excluded.client_label,
            summary_total_label = excluded.summary_total_label,
            warranty_months = excluded.warranty_months,
            contract_snapshot = excluded.contract_snapshot,
            updated_at = now()
        `,
        [
          offerId,
          req.user.id,
          offer.clientLabel,
          offer.clientType === "company" ? `${offer.netLabel} + VAT` : offer.grossLabel,
          warrantyMonths,
          JSON.stringify({
            clientDetails: offer.clientDetails || {},
            contractTerms: offer.contractTerms || {},
            items,
            totals: offer.totals || {},
            labels: {
              totalLabel: offer.totalLabel,
              netLabel: offer.netLabel,
              vatLabel: offer.vatLabel,
              grossLabel: offer.grossLabel,
            },
          }),
        ]
      );
    }

    await client.query("commit");

    const data = await loadBootstrapData();
    res.json({
      offers: data.offers,
      contracts: data.contracts,
      boardNotes: data.boardNotes,
      nextOfferNumber: data.nextNumber,
      savedOfferId: offerId,
    });
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}));

app.delete("/api/offers/:id", requireAuth, asyncHandler(async (req, res) => {
  const offerId = req.params.id;

  await pool.query("delete from public.offers where id = $1", [offerId]);

  const data = await loadBootstrapData();
  res.json({
    offers: data.offers,
    contracts: data.contracts,
    boardNotes: data.boardNotes,
    nextOfferNumber: data.nextNumber,
  });
}));

app.post("/api/board-notes", requireAuth, asyncHandler(async (req, res) => {
  const body = String(req.body?.text || "").trim();
  if (!body) {
    res.status(400).json({ error: "EMPTY_NOTE" });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("begin");
    const noteId = crypto.randomUUID();
    await client.query(
      `
        insert into public.board_notes (id, author_user_id, updated_by_user_id, body)
        values ($1, $2, $3, $4)
      `,
      [noteId, req.user.id, req.user.id, body]
    );
    await client.query(
      `
        insert into public.board_note_entries (note_id, author_user_id, body)
        values ($1, $2, $3)
      `,
      [noteId, req.user.id, body]
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  const data = await loadBootstrapData();
  res.json({ boardNotes: data.boardNotes });
}));

app.post("/api/board-notes/:id/entries", requireAuth, asyncHandler(async (req, res) => {
  const body = String(req.body?.text || "").trim();
  if (!body) {
    res.status(400).json({ error: "EMPTY_ENTRY" });
    return;
  }

  const noteId = req.params.id;
  await pool.query(
    `
      insert into public.board_note_entries (note_id, author_user_id, body)
      values ($1, $2, $3)
    `,
    [noteId, req.user.id, body]
  );
  await pool.query(
    `
      update public.board_notes
      set
        body = $2,
        updated_by_user_id = $3,
        updated_at = now()
      where id = $1
    `,
    [noteId, body, req.user.id]
  );

  const data = await loadBootstrapData();
  res.json({ boardNotes: data.boardNotes });
}));

app.delete("/api/board-notes/:id", requireAuth, asyncHandler(async (req, res) => {
  await pool.query(
    `
      update public.board_notes
      set
        is_deleted = true,
        updated_by_user_id = $2,
        updated_at = now()
      where id = $1
    `,
    [req.params.id, req.user.id]
  );

  const data = await loadBootstrapData();
  res.json({ boardNotes: data.boardNotes });
}));

app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
