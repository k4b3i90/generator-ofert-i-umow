const loginView = document.querySelector('[data-view="login"]');
const dashboardView = document.querySelector('[data-view="dashboard"]');
const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logoutButton");
const currentUserLabel = document.getElementById("currentUser");
const offerDate = document.getElementById("offerDate");
const offerNumber = document.getElementById("offerNumber");
const toast = document.getElementById("toast");
const itemsBody = document.getElementById("itemsBody");
const itemRowTemplate = document.getElementById("itemRowTemplate");
const addItemButton = document.getElementById("addItemButton");
const addCategoryButton = document.getElementById("addCategoryButton");
const netTotal = document.getElementById("netTotal");
const vatValue = document.getElementById("vatValue");
const grossTotal = document.getElementById("grossTotal");
const vatRate = document.getElementById("vatRate");
const discountType = document.getElementById("discountType");
const discountValue = document.getElementById("discountValue");
const discountValueField = document.getElementById("discountValueField");
const discountSummaryRow = document.getElementById("discountSummaryRow");
const discountSummaryLabel = document.getElementById("discountSummaryLabel");
const discountTotalValue = document.getElementById("discountTotalValue");
const receivedAmount = document.getElementById("receivedAmount");
const receivedSummaryRow = document.getElementById("receivedSummaryRow");
const receivedTotalValue = document.getElementById("receivedTotalValue");
const grossTotalLabel = document.getElementById("grossTotalLabel");
const saveOfferButton = document.getElementById("saveOfferButton");
const saveContractButton = document.getElementById("saveContractButton");
const offerGeneratorEyebrow = document.getElementById("offerGeneratorEyebrow");
const offerPanelTitle = document.getElementById("offerPanelTitle");
const offerTitleLabel = document.getElementById("offerTitleLabel");
const validUntilLabel = document.getElementById("validUntilLabel");
const itemsSectionTitle = document.getElementById("itemsSectionTitle");
const offerNumberBadgeLabel = document.getElementById("offerNumberBadgeLabel");
const savedOffersList = document.getElementById("savedOffersList");
const savedReceiptsList = document.getElementById("savedReceiptsList");
const savedContractsList = document.getElementById("savedContractsList");
const boardNotesList = document.getElementById("boardNotesList");
const boardNoteInput = document.getElementById("boardNoteInput");
const addBoardNoteButton = document.getElementById("addBoardNoteButton");
const prefillButton = document.getElementById("prefillButton");
const linkedOffer = document.getElementById("linkedOffer");
const contractClient = document.getElementById("contractClient");
const contractValue = document.getElementById("contractValue");
const contractScope = document.getElementById("contractScope");
const warrantyPeriod = document.getElementById("warrantyPeriod");
const contractDate = document.getElementById("contractDate");
const contractCity = document.getElementById("contractCity");
const worksiteAddress = document.getElementById("worksiteAddress");
const materialsProvider = document.getElementById("materialsProvider");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const paymentMode = document.getElementById("paymentMode");
const paymentInstallments = document.getElementById("paymentInstallments");
const paymentInstallmentsField = document.getElementById("paymentInstallmentsField");
const paymentHasAdvance = document.getElementById("paymentHasAdvance");
const paymentAdvanceValue = document.getElementById("paymentAdvanceValue");
const paymentAdvanceValueField = document.getElementById("paymentAdvanceValueField");
const paymentAdvanceUnit = document.getElementById("paymentAdvanceUnit");
const paymentAdvanceUnitField = document.getElementById("paymentAdvanceUnitField");
const paymentAdvanceTaxMode = document.getElementById("paymentAdvanceTaxMode");
const paymentAdvanceTaxModeField = document.getElementById("paymentAdvanceTaxModeField");
const paymentAdvanceDate = document.getElementById("paymentAdvanceDate");
const paymentAdvanceDateField = document.getElementById("paymentAdvanceDateField");
const paymentFinalDate = document.getElementById("paymentFinalDate");
const paymentScheduleDetails = document.getElementById("paymentScheduleDetails");
const materialsPenaltyEnabled = document.getElementById("materialsPenaltyEnabled");
const materialsPenaltyValue = document.getElementById("materialsPenaltyValue");
const materialsPenaltyUnit = document.getElementById("materialsPenaltyUnit");
const materialsPenaltyTiming = document.getElementById("materialsPenaltyTiming");
const breachPenaltyEnabled = document.getElementById("breachPenaltyEnabled");
const breachPenaltyValue = document.getElementById("breachPenaltyValue");
const breachPenaltyUnit = document.getElementById("breachPenaltyUnit");
const breachPenaltyTiming = document.getElementById("breachPenaltyTiming");
const breachCureDays = document.getElementById("breachCureDays");
const preliminaryPenaltyValue = document.getElementById("preliminaryPenaltyValue");
const preliminaryPenaltyUnit = document.getElementById("preliminaryPenaltyUnit");
const preliminaryPenaltyPaymentDays = document.getElementById("preliminaryPenaltyPaymentDays");
const preliminaryTerms = document.getElementById("preliminaryTerms");
const contractPreview = document.getElementById("contractPreview");
const contractDraftSection = document.querySelector(".contract-draft");

const demoUsers = [
  { login: "Piotr Kowalczyk", password: "Kowalczyk", name: "Piotr Kowalczyk" },
  { login: "Petro Pundyk", password: "Pundyk", name: "Petro Pundyk" },
];

const state = {
  user: null,
  offerSequence: 1,
  savedOffers: [],
  savedContracts: [],
  boardNotes: [],
  editingOfferId: null,
  nextOfferNumber: "",
};

const currency = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

const formatDate = (date) => new Intl.DateTimeFormat("pl-PL").format(date);

const formatDateTime = (value) =>
  new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));

const formatDisplayDate = (value) => {
  if (!value) {
    return "-";
  }
  return new Intl.DateTimeFormat("pl-PL").format(new Date(value));
};

const nextOfferNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const sequence = String(state.offerSequence).padStart(3, "0");
  return `OF/${year}/${month}/${sequence}`;
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
};

const relocatePreliminarySettingsSection = () => {
  const section = preliminaryPenaltyValue?.closest(".section-box");
  if (!section || !contractDraftSection) {
    return;
  }

  if (section.nextElementSibling === contractDraftSection) {
    return;
  }

  contractDraftSection.before(section);
};

const openPreliminaryContractEditor = (offerId) => {
  editOffer(offerId, "contracts");

  window.requestAnimationFrame(() => {
    const section = preliminaryPenaltyValue?.closest(".section-box");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    preliminaryTerms?.focus();
  });
};

const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.error || "REQUEST_FAILED");
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

relocatePreliminarySettingsSection();

const applyBootstrapData = (payload) => {
  state.savedOffers = payload.offers || [];
  state.savedContracts = payload.contracts || [];
  state.boardNotes = payload.boardNotes || [];
  state.nextOfferNumber = payload.nextOfferNumber || state.nextOfferNumber;
  renderSavedOffers();
  renderSavedReceipts();
  renderSavedContracts();
  renderBoardNotes();
};

const CATEGORY_UNIT = "__category__";

const refreshOfferNumberPreview = async () => {
  if (state.editingOfferId) {
    return;
  }

  try {
    const payload = await apiRequest(`/api/offers/preview-number?kind=${encodeURIComponent(getDocumentKind())}`, {
      method: "GET",
    });
    state.nextOfferNumber = payload.nextOfferNumber;
    offerNumber.textContent = payload.nextOfferNumber;
    linkedOffer.value = payload.nextOfferNumber;
  } catch (_error) {
    offerNumber.textContent = state.nextOfferNumber || offerNumber.textContent;
  }
};

const switchView = (isLoggedIn) => {
  loginView.classList.toggle("hidden", isLoggedIn);
  dashboardView.classList.toggle("hidden", !isLoggedIn);
};

const toggleClientFields = () => {
  const selected = document.querySelector('input[name="clientType"]:checked')?.value;
  document.getElementById("individualFields").classList.toggle("hidden", selected !== "individual");
  document.getElementById("companyFields").classList.toggle("hidden", selected !== "company");
};

const collectItems = () => {
  return [...itemsBody.querySelectorAll("tr")].map((row) => {
    const type = row.dataset.itemType || "item";
    const name = row.querySelector(".item-name").value.trim();
    const unit = type === "category" ? CATEGORY_UNIT : row.querySelector(".item-unit").value;
    const quantity = type === "category" ? 0 : Number(row.querySelector(".item-quantity").value) || 0;
    const price = type === "category" ? 0 : Number(row.querySelector(".item-price").value) || 0;
    return { type, name, unit, quantity, price, total: quantity * price };
  });
};

const isChargeableItem = (item) => item.type !== "category" && (item.name || item.quantity > 0 || item.price > 0);

const getChargeableItems = (items = collectItems()) => items.filter(isChargeableItem);

const getDiscountSettings = (source = null) => {
  if (source) {
    const normalizedType = source.discountType === "percent" || source.discountType === "amount" ? source.discountType : "none";
    const normalizedValue = Math.max(0, Number(source.discountValue) || 0);
    return {
      type: normalizedType,
      value: normalizedType === "none" ? 0 : normalizedValue,
    };
  }

  const normalizedType = discountType?.value === "percent" || discountType?.value === "amount" ? discountType.value : "none";
  const normalizedValue = Math.max(0, Number(discountValue?.value) || 0);
  return {
    type: normalizedType,
    value: normalizedType === "none" ? 0 : normalizedValue,
  };
};

const getReceivedAmount = (source = null) => {
  const rawValue = source?.receivedAmount ?? receivedAmount?.value;
  return Math.max(0, Number(rawValue) || 0);
};

const calculateDocumentTotals = ({
  items = collectItems(),
  vatRateValue = vatRate?.value || "23",
  discount = getDiscountSettings(),
  receivedAmountValue = getReceivedAmount(),
} = {}) => {
  const subtotal = getChargeableItems(items).reduce((sum, item) => sum + item.total, 0);
  const normalizedDiscountType = discount.type === "percent" || discount.type === "amount" ? discount.type : "none";
  const inputDiscountValue = Math.max(0, Number(discount.value) || 0);
  const normalizedDiscountValue =
    normalizedDiscountType === "percent" ? Math.min(inputDiscountValue, 100) : inputDiscountValue;

  let discountAmount = 0;
  if (normalizedDiscountType === "percent") {
    discountAmount = subtotal * (normalizedDiscountValue / 100);
  } else if (normalizedDiscountType === "amount") {
    discountAmount = normalizedDiscountValue;
  }

  discountAmount = Math.min(subtotal, discountAmount);

  const discountedNet = Math.max(0, subtotal - discountAmount);
  const vatMultiplier = vatRateValue === "none" ? 0 : Number(vatRateValue) / 100;
  const vatAmount = discountedNet * vatMultiplier;
  const grossAmount = discountedNet + vatAmount;
  const paidAmount = Math.min(grossAmount, Math.max(0, Number(receivedAmountValue) || 0));
  const remainingAmount = Math.max(0, grossAmount - paidAmount);

  return {
    baseNet: subtotal,
    baseNetLabel: currency.format(subtotal),
    discountType: normalizedDiscountType,
    discountValue: normalizedDiscountValue,
    discountAmount,
    net: discountedNet,
    vat: vatAmount,
    gross: grossAmount,
    paidAmount,
    remaining: remainingAmount,
    hasDiscount: discountAmount > 0,
    hasReceivedAmount: paidAmount > 0,
    netLabel: currency.format(discountedNet),
    vatLabel: currency.format(vatAmount),
    grossLabel: currency.format(grossAmount),
    discountLabel: currency.format(discountAmount),
    paidLabel: currency.format(paidAmount),
    remainingLabel: currency.format(remainingAmount),
  };
};

const getCategoryTotals = (items = collectItems()) => {
  const totals = new Map();
  let currentCategoryIndex = null;
  let currentTotal = 0;

  items.forEach((item, index) => {
    if (item.type === "category") {
      if (currentCategoryIndex !== null) {
        totals.set(currentCategoryIndex, currentTotal);
      }
      currentCategoryIndex = index;
      currentTotal = 0;
      return;
    }

    if (currentCategoryIndex !== null && item.name) {
      currentTotal += item.total;
    }
  });

  if (currentCategoryIndex !== null) {
    totals.set(currentCategoryIndex, currentTotal);
  }

  return totals;
};

const syncCategoryRowTotals = (items = collectItems()) => {
  const categoryTotals = getCategoryTotals(items);
  [...itemsBody.querySelectorAll("tr")].forEach((row, index) => {
    if ((row.dataset.itemType || "item") !== "category") {
      return;
    }

    const totalLabel = row.querySelector(".item-total");
    totalLabel.textContent = currency.format(categoryTotals.get(index) || 0);
  });
};

const updateDiscountVisibility = () => {
  const currentDiscount = getDiscountSettings();
  const hasConfigurableDiscount = currentDiscount.type !== "none";

  if (discountValueField) {
    discountValueField.classList.toggle("hidden", !hasConfigurableDiscount);
  }
};

const updateTotals = () => {
  const items = collectItems();
  const totals = calculateDocumentTotals({
    items,
    vatRateValue: vatRate.value,
    discount: getDiscountSettings(),
    receivedAmountValue: getReceivedAmount(),
  });

  syncCategoryRowTotals(items);
  updateDiscountVisibility();

  netTotal.textContent = totals.hasDiscount ? totals.baseNetLabel : totals.netLabel;
  vatValue.textContent = totals.vatLabel;
  grossTotal.textContent = totals.hasReceivedAmount ? totals.remainingLabel : totals.grossLabel;

  if (discountSummaryRow && discountSummaryLabel && discountTotalValue) {
    discountSummaryRow.hidden = !totals.hasDiscount;
    if (totals.hasDiscount) {
      discountSummaryLabel.textContent =
        totals.discountType === "percent" ? `Zniżka (${String(totals.discountValue).replace(".", ",")}%)` : "Zniżka kwotowa";
      discountTotalValue.textContent = `- ${totals.discountLabel}`;
    }
  }

  if (receivedSummaryRow && receivedTotalValue && grossTotalLabel) {
    receivedSummaryRow.hidden = !totals.hasReceivedAmount;
    grossTotalLabel.textContent = totals.hasReceivedAmount ? "Do zapłaty" : "Razem";
    if (totals.hasReceivedAmount) {
      receivedTotalValue.textContent = `- ${totals.paidLabel}`;
    }
  }
};

const getTotalsSnapshot = () => {
  const items = collectItems();
  return calculateDocumentTotals({
    items,
    vatRateValue: vatRate.value,
    discount: getDiscountSettings(),
    receivedAmountValue: getReceivedAmount(),
  });
};

const getClientType = () => document.querySelector('input[name="clientType"]:checked')?.value || "individual";

const getDocumentKind = () => document.querySelector('input[name="documentKind"]:checked')?.value || "offer";

const getDocumentLabels = (documentKind = getDocumentKind()) =>
  documentKind === "receipt"
    ? {
        kind: "receipt",
        singular: "rachunek",
        singularCapital: "Rachunek",
        header: "RACHUNEK",
        generator: "Generator rachunku",
        newTitle: "Nowy rachunek",
        titleLabel: "Tytuł rachunku",
        validUntilLabel: "Termin płatności",
        itemsTitle: "Pozycje rachunku",
        saveLabel: "Zapisz rachunek",
        savedLabel: "Rachunek",
        numberLabel: "Numer rachunku",
        dateLabel: "Data wystawienia",
        filenameSuffix: "rachunek",
      }
    : {
        kind: "offer",
        singular: "oferta",
        singularCapital: "Oferta",
        header: "OFERTA",
        generator: "Generator oferty",
        newTitle: "Nowa oferta",
        titleLabel: "Tytuł oferty",
        validUntilLabel: "Oferta ważna do",
        itemsTitle: "Pozycje oferty",
        saveLabel: "Zapisz ofertę",
        savedLabel: "Oferta",
        numberLabel: "Numer oferty",
        dateLabel: "Data utworzenia",
        filenameSuffix: "oferta",
      };

const getOfferDocumentKind = (offer = {}) => offer.contractTerms?.documentKind || "offer";

const updateDocumentKindUi = () => {
  const labels = getDocumentLabels();
  offerGeneratorEyebrow.textContent = labels.generator;
  offerPanelTitle.textContent = state.editingOfferId ? `Edycja: ${labels.singular}` : labels.newTitle;
  offerTitleLabel.textContent = labels.titleLabel;
  validUntilLabel.textContent = labels.validUntilLabel;
  itemsSectionTitle.textContent = labels.itemsTitle;
  offerNumberBadgeLabel.textContent = labels.numberLabel;
  saveOfferButton.textContent = state.editingOfferId ? `Zapisz zmiany w ${labels.singular}` : labels.saveLabel;
  if (saveContractButton) {
    saveContractButton.textContent = state.editingOfferId ? "Zapisz zmiany w umowie" : "Zapisz ofertę i umowę";
  }
};

const isReceiptDocument = (offer = {}) => getOfferDocumentKind(offer) === "receipt";

const getClientLabel = () => {
  if (getClientType() === "company") {
    return document.getElementById("companyName").value.trim() || "Nie podano firmy";
  }
  return document.getElementById("individualName").value.trim() || "Nie podano klienta";
};

const getClientDetails = () => {
  const type = getClientType();
  if (type === "company") {
    return {
      type,
      companyName: document.getElementById("companyName").value.trim(),
      taxId: document.getElementById("companyTaxId").value.trim(),
      contact: document.getElementById("companyContact").value.trim(),
      phone: document.getElementById("companyPhone").value.trim(),
      email: document.getElementById("companyEmail").value.trim(),
      address: document.getElementById("companyAddress").value.trim(),
    };
  }

  return {
    type,
    name: document.getElementById("individualName").value.trim(),
    phone: document.getElementById("individualPhone").value.trim(),
    email: document.getElementById("individualEmail").value.trim(),
    address: document.getElementById("individualAddress").value.trim(),
  };
};

const syncContractPreview = () => {
  const items = getChargeableItems().filter((item) => item.name);
  const totals = getTotalsSnapshot();
  const isCompany = getClientType() === "company";
  contractClient.textContent = getClientLabel();
  contractValue.textContent = isCompany
    ? `${totals.netLabel} netto + VAT ${totals.vatLabel} = ${totals.grossLabel} brutto`
    : `${totals.grossLabel} brutto`;
  contractScope.textContent = items.length ? items.map((item) => item.name).join(", ") : "Brak pozycji";

  if (!linkedOffer.value.trim()) {
    linkedOffer.value = offerNumber.textContent;
  }

  renderContractPreview();
};

const moveItemRow = (row, direction) => {
  const targetRow = direction === "up" ? row.previousElementSibling : row.nextElementSibling;
  if (!targetRow) {
    return;
  }

  if (direction === "up") {
    itemsBody.insertBefore(row, targetRow);
  } else {
    itemsBody.insertBefore(targetRow, row);
  }

  updateTotals();
  syncContractPreview();
};

const createItemRow = (prefill = {}) => {
  const fragment = itemRowTemplate.content.cloneNode(true);
  const row = fragment.querySelector("tr");
  const nameInput = row.querySelector(".item-name");
  const unitInput = row.querySelector(".item-unit");
  const quantityInput = row.querySelector(".item-quantity");
  const priceInput = row.querySelector(".item-price");
  const totalLabel = row.querySelector(".item-total");
  const moveUpButton = row.querySelector(".move-item-up");
  const moveDownButton = row.querySelector(".move-item-down");
  const insertBelowButton = row.querySelector(".insert-item-below");
  const type = prefill.type || (prefill.unit === CATEGORY_UNIT ? "category" : "item");

  row.dataset.itemType = type;
  row.classList.toggle("item-category-row", type === "category");

  nameInput.value = prefill.name || "";
  unitInput.value = type === "category" ? "m2" : prefill.unit || "m2";
  quantityInput.value = type === "category" ? "" : prefill.quantity ?? 1;
  priceInput.value = type === "category" ? "" : prefill.price ?? 0;
  nameInput.placeholder = type === "category" ? "Np. Instalacja gazowa" : "Np. malowanie";
  unitInput.disabled = type === "category";
  quantityInput.disabled = type === "category";
  priceInput.disabled = type === "category";

  const resizeNameInput = () => {
    nameInput.style.height = "auto";
    nameInput.style.height = `${Math.max(nameInput.scrollHeight, 42)}px`;
  };

  const recalc = () => {
    if (type === "category") {
      updateTotals();
      syncContractPreview();
      return;
    }
    const quantity = Number(quantityInput.value) || 0;
    const price = Number(priceInput.value) || 0;
    totalLabel.textContent = currency.format(quantity * price);
    updateTotals();
    syncContractPreview();
  };

  row.querySelector(".remove-item").addEventListener("click", () => {
    row.remove();
    updateTotals();
    syncContractPreview();
  });
  moveUpButton.addEventListener("click", () => moveItemRow(row, "up"));
  moveDownButton.addEventListener("click", () => moveItemRow(row, "down"));
  insertBelowButton.addEventListener("click", () => {
    const newRow = createItemRow();
    itemsBody.insertBefore(newRow, row.nextElementSibling);
    updateTotals();
    syncContractPreview();
    newRow.querySelector(".item-name")?.focus();
  });

  quantityInput.addEventListener("input", recalc);
  priceInput.addEventListener("input", recalc);
  nameInput.addEventListener("input", () => {
    resizeNameInput();
    updateTotals();
    syncContractPreview();
  });

  itemsBody.appendChild(row);
  resizeNameInput();
  recalc();
  return row;
};

const openTab = (tabName) => {
  document.querySelectorAll("[data-tab-target]").forEach((item) => item.classList.remove("is-active"));
  document.querySelectorAll("[data-tab]").forEach((panel) => panel.classList.remove("is-active"));
  document.querySelector(`[data-tab-target="${tabName}"]`)?.classList.add("is-active");
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add("is-active");
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const formatMultilineHtml = (value) => {
  const text = String(value ?? "").trim();
  return text ? escapeHtml(text) : "-";
};

const logoUrl = new URL("logo-oferteo.png", window.location.href).href;
let cachedLogoDataUrl = null;

const getPenaltyLabel = (value, unit, timing) => {
  const normalizedValue = value ? String(value).replace(".", ",") : "0";
  const normalizedUnit = unit === "%" ? "%" : "zł";
  return `${normalizedValue} ${normalizedUnit} ${timing || ""}`.trim();
};

const getPaymentAmountLabel = (value, unit) => {
  const normalizedValue = value ? String(value).replace(".", ",") : "0";
  return unit === "%" ? `${normalizedValue}%` : `${normalizedValue} zł`;
};

const getContractTerms = () => {
  const discount = getDiscountSettings();
  return {
    documentKind: getDocumentKind(),
    discountType: discount.type,
    discountValue: String(discount.value || 0),
    receivedAmount: String(getReceivedAmount()),
    contractDate: contractDate.value,
    contractCity: contractCity.value.trim() || "Warszawa",
    worksiteAddress: worksiteAddress.value.trim(),
    materialsProvider: materialsProvider.value,
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    paymentMode: paymentMode.value,
    paymentInstallments: paymentInstallments.value || "2",
    paymentHasAdvance: paymentHasAdvance.value,
    paymentAdvanceValue: paymentAdvanceValue.value,
    paymentAdvanceUnit: paymentAdvanceUnit.value,
    paymentAdvanceTaxMode: paymentAdvanceTaxMode.value,
    paymentAdvanceDate: paymentAdvanceDate.value,
    paymentFinalDate: paymentFinalDate.value,
    paymentScheduleDetails: paymentScheduleDetails.value.trim(),
    materialsPenaltyEnabled: materialsPenaltyEnabled.checked,
    materialsPenaltyValue: materialsPenaltyValue.value,
    materialsPenaltyUnit: materialsPenaltyUnit.value,
    materialsPenaltyTiming: materialsPenaltyTiming.value.trim(),
    breachPenaltyEnabled: breachPenaltyEnabled.checked,
    breachPenaltyValue: breachPenaltyValue.value,
    breachPenaltyUnit: breachPenaltyUnit.value,
    breachPenaltyTiming: breachPenaltyTiming.value.trim(),
    breachCureDays: breachCureDays.value || "3",
    preliminaryPenaltyValue: preliminaryPenaltyValue.value || "5000",
    preliminaryPenaltyUnit: preliminaryPenaltyUnit.value || "zł",
    preliminaryPenaltyPaymentDays: preliminaryPenaltyPaymentDays.value || "7",
    preliminaryTerms: preliminaryTerms.value.trim(),
  };
};

const updatePaymentSettingsVisibility = () => {
  const isInstallments = paymentMode?.value === "installments";
  const hasAdvance = paymentHasAdvance?.value === "yes";

  if (paymentInstallmentsField) {
    paymentInstallmentsField.hidden = !isInstallments;
  }

  [paymentAdvanceValueField, paymentAdvanceUnitField, paymentAdvanceTaxModeField, paymentAdvanceDateField].forEach((field) => {
    if (field) {
      field.hidden = !hasAdvance;
    }
  });
};

const getScopeHtml = (items) => {
  const namedItems = items.filter((item) => item.name);

  if (!namedItems.length) {
    return "<li>Zakres prac zostanie uzupełniony po dodaniu pozycji oferty.</li>";
  }

  return namedItems
    .map(
      (item) =>
        item.type === "category"
          ? `<li><strong>${escapeHtml(item.name)}</strong></li>`
          : `<li>${escapeHtml(item.name)} - ${escapeHtml(item.quantity)} ${escapeHtml(item.unit)} po ${currency.format(
              item.price
            )}, wartość: ${currency.format(item.total)}</li>`
    )
    .join("");
};

const getClientContractHtml = (clientDetails) => {
  if (clientDetails.type === "company") {
    return `
      <p><strong>ZAMAWIAJĄCYM:</strong><br />
      ${escapeHtml(clientDetails.companyName || "-")}<br />
      ${escapeHtml(clientDetails.address || "-")}<br />
      NIP: ${escapeHtml(clientDetails.taxId || "-")}<br />
      Osoba kontaktowa: ${escapeHtml(clientDetails.contact || "-")}<br />
      Tel.: ${escapeHtml(clientDetails.phone || "-")}<br />
      E-mail: ${escapeHtml(clientDetails.email || "-")}</p>
    `;
  }

  return `
    <p><strong>ZAMAWIAJĄCYM:</strong><br />
    ${escapeHtml(clientDetails.name || "-")}<br />
    ${escapeHtml(clientDetails.address || "-")}<br />
    Tel.: ${escapeHtml(clientDetails.phone || "-")}<br />
    E-mail: ${escapeHtml(clientDetails.email || "-")}</p>
  `;
};

const buildPaymentClauseHtml = (terms) => {
  const paragraphs = [];
  const count = Math.max(1, Number(terms.paymentInstallments) || 1);
  const finalDateLabel = terms.paymentFinalDate
    ? ` do dnia <strong>${escapeHtml(formatDisplayDate(terms.paymentFinalDate))}</strong>`
    : "";

  if (terms.paymentMode === "single") {
    paragraphs.push(
      `<p>3. Strony ustalają, że wynagrodzenie będzie płatne <strong>jednorazowo</strong>${finalDateLabel}.</p>`
    );
  } else if (terms.paymentMode === "after_completion") {
    paragraphs.push(
      `<p>3. Strony ustalają, że wynagrodzenie będzie płatne <strong>po zakończeniu prac</strong>${
        finalDateLabel || " po dokonaniu odbioru końcowego"
      }.</p>`
    );
  } else {
    paragraphs.push(
      `<p>3. Strony ustalają, że wynagrodzenie będzie płatne w <strong>${escapeHtml(String(count))} transzach</strong>.</p>`
    );
  }

  if (terms.paymentHasAdvance === "yes") {
    const advanceLabel = getPaymentAmountLabel(terms.paymentAdvanceValue, terms.paymentAdvanceUnit);
    const advanceTaxModeLabel = terms.paymentAdvanceUnit === "%" ? "" : ` ${terms.paymentAdvanceTaxMode || "brutto"}`;
    const advanceDateLabel = terms.paymentAdvanceDate
      ? ` do dnia <strong>${escapeHtml(formatDisplayDate(terms.paymentAdvanceDate))}</strong>`
      : "";
    paragraphs.push(
      `<p>4. Pierwsza płatność ma charakter <strong>zaliczki</strong> w wysokości <strong>${escapeHtml(
        `${advanceLabel}${advanceTaxModeLabel}`
      )}</strong>${advanceDateLabel}.</p>`
    );
  }

  if (terms.paymentScheduleDetails) {
    paragraphs.push(
      `<p>${paragraphs.length + 3}. Harmonogram płatności Strony ustalają następująco: <strong>${escapeHtml(
        terms.paymentScheduleDetails
      )}</strong>.</p>`
    );
  } else if (terms.paymentMode === "installments") {
    paragraphs.push(
      `<p>${paragraphs.length + 3}. Szczegółowe terminy i wysokość poszczególnych transz Strony ustalają indywidualnie przed rozpoczęciem prac albo w toku ich realizacji.</p>`
    );
  }

  paragraphs.push(
    `<p>${paragraphs.length + 3}. Wszelkie prace dodatkowe będą rozliczane odrębnie po ich wcześniejszym zaakceptowaniu przez Zamawiającego.</p>`
  );

  return paragraphs.join("");
};

const buildContractHtml = (offer) => {
  const terms = offer.contractTerms;
  const isCompany = offer.clientDetails.type === "company";
  const materialsPenaltyLabel = getPenaltyLabel(
    terms.materialsPenaltyValue,
    terms.materialsPenaltyUnit,
    terms.materialsPenaltyTiming
  );
  const breachPenaltyLabel = getPenaltyLabel(
    terms.breachPenaltyValue,
    terms.breachPenaltyUnit,
    terms.breachPenaltyTiming
  );
  const materialsPenaltySection = terms.materialsPenaltyEnabled
    ? `<p>2. W razie opóźnienia w dostarczeniu materiałów przez Zamawiającego Wykonawca ma prawo wstrzymać wykonywanie prac, odpowiednio wydłużyć termin realizacji prac o okres przestoju oraz naliczyć Zamawiającemu karę umowną w wysokości <strong>${escapeHtml(
        materialsPenaltyLabel
      )}</strong>.</p>`
    : "";
  const breachPenaltySection = terms.breachPenaltyEnabled
    ? `<p>3. W przypadku niewykonania lub nienależytego wykonania przez Zamawiającego obowiązków wynikających z niniejszej umowy Wykonawca ma prawo naliczyć karę umowną w wysokości <strong>${escapeHtml(
        breachPenaltyLabel
      )}</strong>.</p>`
    : "";
  const breachFollowupNumber = terms.breachPenaltyEnabled ? "4" : terms.materialsPenaltyEnabled ? "3" : "2";
  const remunerationHtml = isCompany
    ? `
      <p>1. Strony ustalają wynagrodzenie za wykonanie prac objętych niniejszą umową w następującej wysokości:</p>
      <p><strong>Wartość netto:</strong> ${escapeHtml(offer.netLabel)}</p>
      <p><strong>Podatek VAT:</strong> ${escapeHtml(offer.vatLabel)}</p>
      <p><strong>Wartość brutto:</strong> ${escapeHtml(offer.grossLabel)}</p>
    `
    : `
      <p>1. Strony ustalają wynagrodzenie za wykonanie prac objętych niniejszą umową na kwotę brutto: <strong>${escapeHtml(
        offer.grossLabel
      )}</strong>.</p>
    `;
  const paymentClauseHtml = buildPaymentClauseHtml(terms);

  return `
    <div class="contract-document">
      <h3>UMOWA O WYKONANIE PRAC REMONTOWYCH</h3>
      <p>zawarta w dniu <strong>${escapeHtml(formatDisplayDate(terms.contractDate))}</strong> w miejscowości <strong>${escapeHtml(
        terms.contractCity
      )}</strong></p>
      <p><strong>pomiędzy:</strong></p>
      <p><strong>WYKONAWCĄ:</strong><br />Piotr Kowalczyk<br />P&amp;P Profinish<br />ul. Banderii 4/276<br />01-164 Warszawa<br />NIP: 7962883242</p>
      ${getClientContractHtml(offer.clientDetails)}
      <p>zwanymi dalej łącznie „Stronami”, a każda z osobna „Stroną”.</p>
      <h4>§1. Przedmiot umowy</h4>
      <p>1. Zamawiający zleca, a Wykonawca zobowiązuje się do wykonania prac remontowych zgodnie z zakresem określonym w ofercie nr <strong>${escapeHtml(
        offer.number
      )}</strong> z dnia <strong>${escapeHtml(offer.date)}</strong>, stanowiącej podstawę ustaleń Stron.</p>
      <p>2. Zakres prac obejmuje w szczególności:</p>
      <ul>${getScopeHtml(offer.items)}</ul>
      <p>3. Wszelkie prace niewskazane w zakresie będą traktowane jako prace dodatkowe i podlegać będą odrębnemu rozliczeniu po uprzednim uzgodnieniu ich zakresu oraz wartości przez Strony.</p>
      <p>4. Prace zostaną wykonane pod adresem: <strong>${escapeHtml(terms.worksiteAddress || "-")}</strong>.</p>
      <p>5. Wykonawca zobowiązuje się wykonać przedmiot umowy zgodnie z zasadami sztuki budowlanej, obowiązującymi przepisami prawa oraz z należytą starannością.</p>
      <h4>§2. Materiały budowlane</h4>
      <p>1. Strony ustalają, że materiały budowlane i pomocnicze zapewnia: <strong>${escapeHtml(terms.materialsProvider)}</strong>.</p>
      <p>2. W przypadku gdy materiały zapewnia Zamawiający, zobowiązany jest on do dostarczenia materiałów odpowiedniej jakości i w ilości umożliwiającej ciągłą realizację prac.</p>
      <p>3. Wykonawca nie ponosi odpowiedzialności za wady lub opóźnienia wynikające z użycia materiałów dostarczonych przez Zamawiającego, jeżeli uprzednio zgłosił zastrzeżenia co do ich jakości, przydatności lub kompletności.</p>
      <h4>§3. Termin realizacji</h4>
      <p>1. Rozpoczęcie prac nastąpi w dniu: <strong>${escapeHtml(formatDisplayDate(terms.startDate))}</strong>.</p>
      <p>2. Przewidywany termin zakończenia prac ustala się na dzień: <strong>${escapeHtml(
        formatDisplayDate(terms.endDate)
      )}</strong>.</p>
      <p>3. Termin realizacji może ulec odpowiedniemu przedłużeniu w przypadku prac dodatkowych, opóźnień w dostawie materiałów, przeszkód niezależnych od Wykonawcy albo innych okoliczności uzgodnionych przez Strony.</p>
      <h4>§4. Wynagrodzenie</h4>
      ${remunerationHtml}
      <p>2. Podstawą ustalenia wynagrodzenia jest oferta nr <strong>${escapeHtml(offer.number)}</strong>.</p>
      ${paymentClauseHtml}
      <h4>§5. Obowiązki Wykonawcy</h4>
      <p>1. Wykonawca zobowiązuje się do wykonania prac zgodnie z umową, obowiązującymi przepisami prawa i zasadami sztuki budowlanej, stosowania materiałów odpowiedniej jakości, jeżeli obowiązek ich zapewnienia spoczywa na Wykonawcy, zachowania należytego porządku w miejscu wykonywania prac oraz realizacji prac zgodnie z dokonanymi ustaleniami albo poinformowania Zamawiającego o konieczności wydłużenia terminu.</p>
      <h4>§6. Obowiązki Zamawiającego</h4>
      <p>1. Zamawiający zobowiązuje się do udostępnienia miejsca wykonywania prac, współdziałania z Wykonawcą w zakresie niezbędnym do wykonania umowy, odbioru prac po ich zakończeniu, terminowej zapłaty wynagrodzenia, dostarczenia materiałów odpowiedniej jakości, jeżeli obowiązek ich zapewnienia spoczywa na Zamawiającym, oraz poinformowania osób trzecich o prowadzonych pracach, jeżeli jest to wymagane lub uzasadnione okolicznościami.</p>
      <h4>§7. Gwarancja i odpowiedzialność</h4>
      <p>1. Wykonawca udziela gwarancji na wykonane prace na okres: <strong>${escapeHtml(offer.warranty)}</strong>.</p>
      <p>2. Wszelkie usterki wynikające z wadliwego wykonania prac Wykonawca zobowiązuje się usunąć w terminie 14 dni od dnia skutecznego zgłoszenia przez Zamawiającego, chyba że charakter usterki lub warunki techniczne uniemożliwiają usunięcie ich w tym terminie.</p>
      <h4>§7a. Odpowiedzialność Zamawiającego</h4>
      <p>1. W przypadku gdy obowiązek zapewnienia materiałów budowlanych spoczywa na Zamawiającym, Zamawiający zobowiązany jest do ich dostarczania terminowo, w ilości odpowiedniej do zachowania ciągłości prac oraz w jakości umożliwiającej prawidłowe wykonanie robót.</p>
      ${materialsPenaltySection}
      ${breachPenaltySection}
      <p>${breachFollowupNumber}. Jeżeli naruszenie obowiązków przez Zamawiającego uniemożliwia realizację prac albo powoduje istotne utrudnienie w ich wykonywaniu, Wykonawca ma prawo po uprzednim wezwaniu Zamawiającego do usunięcia naruszenia w terminie <strong>${escapeHtml(
        terms.breachCureDays
      )} dni</strong> wstrzymać realizację prac, odpowiednio skorygować termin realizacji lub odstąpić od umowy w całości albo w części.</p>
      <p>${Number(breachFollowupNumber) + 1}. W przypadku odstąpienia od umowy z przyczyn leżących po stronie Zamawiającego, Wykonawcy przysługuje wynagrodzenie za faktycznie wykonany zakres prac według stanu na dzień przerwania realizacji, płatne w terminie <strong>7 dni</strong> od dnia sporządzenia rozliczenia albo wezwania do zapłaty.</p>
      <h4>§7b. Odpowiedzialność Wykonawcy</h4>
      <p>1. Wykonawca ponosi odpowiedzialność za należyte wykonanie prac objętych niniejszą umową, zgodnie z jej postanowieniami, zasadami sztuki budowlanej oraz obowiązującymi przepisami prawa.</p>
      <p>2. W przypadku stwierdzenia wad lub usterek wynikających z nienależytego wykonania prac przez Wykonawcę, Wykonawca zobowiązuje się do ich usunięcia w terminie 14 dni od dnia skutecznego zgłoszenia przez Zamawiającego, chyba że charakter wady, zakres prac naprawczych albo warunki techniczne uniemożliwiają usunięcie ich w tym terminie.</p>
      <p>3. Wykonawca nie ponosi odpowiedzialności za wady i uszkodzenia wynikające z właściwości materiałów dostarczonych przez Zamawiającego, skutki wykonania prac zgodnie z wyraźnymi wskazaniami Zamawiającego po uprzednim zgłoszeniu zastrzeżeń, uszkodzenia lub wady powstałe wskutek ingerencji osób trzecich po wykonaniu prac, skutki niewłaściwego użytkowania oraz opóźnienia i następstwa zdarzeń niezależnych od Wykonawcy.</p>
      <p>4. Jeżeli Wykonawca opóźnia się z realizacją prac z przyczyn leżących wyłącznie po jego stronie, Zamawiający ma prawo wezwać Wykonawcę do należytego wykonywania umowy i wyznaczyć mu odpowiedni termin na usunięcie naruszenia.</p>
      <h4>§8. Postanowienia końcowe</h4>
      <p>1. Wszelkie zmiany niniejszej umowy wymagają formy pisemnej pod rygorem nieważności.</p>
      <p>2. W sprawach nieuregulowanych niniejszą umową zastosowanie mają odpowiednie przepisy Kodeksu cywilnego.</p>
      <p>3. Strony zobowiązują się dążyć do polubownego rozwiązania wszelkich sporów wynikających z niniejszej umowy, a w przypadku braku porozumienia spory rozstrzygać będzie sąd właściwy miejscowo dla siedziby Wykonawcy.</p>
      <p>4. Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze Stron.</p>
      <div class="signature-row">
        <div><strong>ZAMAWIAJĄCY</strong><p>DATA: ____________________</p><p>PODPIS: ____________________</p></div>
        <div><strong>WYKONAWCA</strong><p>DATA: ____________________</p><p>PODPIS: ____________________</p></div>
      </div>
    </div>
  `;
};

const buildOfferPdfHtml = (offer) => {
  const documentLabels = getDocumentLabels(getOfferDocumentKind(offer));
  const categoryTotals = getCategoryTotals(offer.items || []);
  const clientBlock =
    offer.clientType === "company"
      ? `
        <div><strong>Firma:</strong> ${escapeHtml(offer.clientDetails.companyName || "")}</div>
        <div><strong>NIP:</strong> ${escapeHtml(offer.clientDetails.taxId || "-")}</div>
        <div><strong>Kontakt:</strong> ${escapeHtml(offer.clientDetails.contact || "-")}</div>
        <div><strong>Telefon:</strong> ${escapeHtml(offer.clientDetails.phone || "-")}</div>
        <div><strong>E-mail:</strong> ${escapeHtml(offer.clientDetails.email || "-")}</div>
        <div><strong>Adres:</strong> ${escapeHtml(offer.clientDetails.address || "-")}</div>
      `
      : `
        <div><strong>Klient:</strong> ${escapeHtml(offer.clientDetails.name || "")}</div>
        <div><strong>Telefon:</strong> ${escapeHtml(offer.clientDetails.phone || "-")}</div>
        <div><strong>E-mail:</strong> ${escapeHtml(offer.clientDetails.email || "-")}</div>
        <div><strong>Adres:</strong> ${escapeHtml(offer.clientDetails.address || "-")}</div>
      `;

  const itemsRows = offer.items
    .map(
      (item, index) =>
        item.type === "category"
          ? `
        <tr>
          <td colspan="4" style="border:1px solid #d7d1c8; padding:7px 8px; text-align:left; background:#efe5d7; font-weight:700;">${escapeHtml(
            item.name
          )}</td>
          <td style="border:1px solid #d7d1c8; padding:7px 8px; text-align:left; background:#efe5d7; font-weight:700;">${currency.format(
            categoryTotals.get(index) || 0
          )}</td>
        </tr>
      `
          : `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.unit)}</td>
          <td>${escapeHtml(item.quantity)}</td>
          <td>${currency.format(item.price)}</td>
          <td>${currency.format(item.total)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #1f1a17; font-size: 11px; line-height: 1.35; padding: 0;">
      <div style="display:grid; gap:4px; justify-items:center; margin: 8px 0 16px;">
        <h1 style="margin:0; font-size:20px; text-align:center;">${documentLabels.header}</h1>
        <h2 style="margin:0; font-size:13px; text-align:center; font-weight:600;">${escapeHtml(offer.title || documentLabels.singularCapital)}</h2>
      </div>
      <div style="margin-bottom:12px;">
        <div><strong>${documentLabels.numberLabel}:</strong> ${escapeHtml(offer.number)}</div>
        <div><strong>${documentLabels.dateLabel}:</strong> ${escapeHtml(offer.date)}</div>
        <div><strong>${documentLabels.validUntilLabel}:</strong> ${escapeHtml(offer.validUntil || "-")}</div>
        <div><strong>Autor:</strong> ${escapeHtml(offer.author)}</div>
      </div>
      <section style="margin-top:12px;">
        <h3 style="margin:0 0 8px; font-size:13px;">Dane klienta</h3>
        ${clientBlock}
      </section>
      <table style="width:100%; border-collapse:collapse; margin-top:16px; font-size:10.5px;">
        <thead>
          <tr>
            <th style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left; background:#f3ede5;">Usługa</th>
            <th style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left; background:#f3ede5;">Jednostka</th>
            <th style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left; background:#f3ede5;">Ilość</th>
            <th style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left; background:#f3ede5;">Cena</th>
            <th style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left; background:#f3ede5;">Suma</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>
      ${buildOfferPdfTotalsHtml(offer)}
      <section style="padding-top:8px;">
        <h3 style="margin:0 0 8px; font-size:13px;">Uwagi</h3>
        <div style="white-space:pre-wrap;">${formatMultilineHtml(offer.notes)}</div>
      </section>
    </div>
  `;
};

const buildPreliminaryContractHtml = (offer) => {
  const terms = offer.contractTerms || {};
  const isCompany = offer.clientDetails.type === "company";
  const preliminaryPenaltyLabel = getPaymentAmountLabel(terms.preliminaryPenaltyValue, terms.preliminaryPenaltyUnit);
  const penaltyPaymentDays = String(terms.preliminaryPenaltyPaymentDays || "7");
  const additionalTermsHtml = terms.preliminaryTerms
    ? `<p>5. Dodatkowe ustalenia Stron: <strong>${escapeHtml(terms.preliminaryTerms)}</strong>.</p>`
    : "";
  const remunerationHtml = isCompany
    ? `<p>4. Strony przyjmują, że orientacyjna wartość planowanej realizacji według oferty nr <strong>${escapeHtml(
        offer.number
      )}</strong> wynosi <strong>${escapeHtml(offer.netLabel)}</strong> netto + VAT, tj. <strong>${escapeHtml(
        offer.grossLabel
      )}</strong> brutto.</p>`
    : `<p>4. Strony przyjmują, że orientacyjna wartość planowanej realizacji według oferty nr <strong>${escapeHtml(
        offer.number
      )}</strong> wynosi <strong>${escapeHtml(offer.grossLabel)}</strong> brutto.</p>`;

  return `
    <div class="contract-document">
      <h3>UMOWA WSTĘPNA O WYKONANIE PRAC REMONTOWYCH</h3>
      <p>zawarta w dniu <strong>${escapeHtml(formatDisplayDate(terms.contractDate))}</strong> w miejscowości <strong>${escapeHtml(
        terms.contractCity || "Warszawa"
      )}</strong></p>
      <p><strong>pomiędzy:</strong></p>
      <p><strong>WYKONAWCĄ:</strong><br />Piotr Kowalczyk<br />P&amp;P Profinish<br />ul. Banderii 4/276<br />01-164 Warszawa<br />NIP: 7962883242</p>
      ${getClientContractHtml(offer.clientDetails)}
      <p>zwanymi dalej łącznie „Stronami”, a każda z osobna „Stroną”.</p>
      <h4>§1. Cel umowy wstępnej</h4>
      <p>1. Strony potwierdzają wolę zawarcia właściwej umowy o wykonanie prac remontowych na podstawie oferty nr <strong>${escapeHtml(
        offer.number
      )}</strong> z dnia <strong>${escapeHtml(offer.date)}</strong>.</p>
      <p>2. Niniejsza umowa wstępna służy rezerwacji terminu realizacji oraz potwierdzeniu podstawowych warunków współpracy.</p>
      <h4>§2. Zakres i termin planowanych prac</h4>
      <p>1. Planowany zakres prac obejmuje w szczególności:</p>
      <ul>${getScopeHtml(offer.items)}</ul>
      <p>2. Planowane miejsce realizacji prac: <strong>${escapeHtml(terms.worksiteAddress || "-")}</strong>.</p>
      <p>3. Planowany termin rozpoczęcia prac: <strong>${escapeHtml(formatDisplayDate(terms.startDate))}</strong>.</p>
      <p>4. Planowany termin zakończenia prac: <strong>${escapeHtml(formatDisplayDate(terms.endDate))}</strong>.</p>
      ${remunerationHtml}
      <h4>§3. Rezerwacja terminu i kara za rezygnację</h4>
      <p>1. Z chwilą podpisania niniejszej umowy Wykonawca rezerwuje termin realizacji dla Zamawiającego i organizuje harmonogram prac z uwzględnieniem tej rezerwacji.</p>
      <p>2. W przypadku rezygnacji Zamawiającego z realizacji prac bez ważnej przyczyny po zawarciu niniejszej umowy, Zamawiający zobowiązuje się zapłacić na rzecz Wykonawcy karę umowną w wysokości <strong>${escapeHtml(
        preliminaryPenaltyLabel
      )}</strong>.</p>
      <p>3. Kara, o której mowa powyżej, płatna jest w terminie <strong>${escapeHtml(
        penaltyPaymentDays
      )} dni</strong> od dnia doręczenia wezwania do zapłaty.</p>
      <p>4. Zawarcie umowy właściwej o wykonanie prac remontowych nie wyłącza skuteczności ustaleń organizacyjnych wynikających z niniejszej umowy wstępnej.</p>
      ${additionalTermsHtml}
      <h4>§4. Postanowienia końcowe</h4>
      <p>1. W sprawach nieuregulowanych niniejszą umową zastosowanie mają odpowiednie przepisy Kodeksu cywilnego.</p>
      <p>2. Wszelkie zmiany niniejszej umowy wymagają formy pisemnej.</p>
      <p>3. Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze Stron.</p>
      <div class="signature-row">
        <div><strong>ZAMAWIAJĄCY</strong><p>DATA: ____________________</p><p>PODPIS: ____________________</p></div>
        <div><strong>WYKONAWCA</strong><p>DATA: ____________________</p><p>PODPIS: ____________________</p></div>
      </div>
    </div>
  `;
};

const buildOfferPdfRows = (offer) => {
  const categoryTotals = getCategoryTotals(offer.items || []);

  return (offer.items || []).map((item, index) =>
    item.type === "category"
      ? `
        <tr>
          <td colspan="4" style="border:1px solid #d7d1c8; padding:7px 8px; text-align:left; background:#efe5d7; font-weight:700;">${escapeHtml(
            item.name
          )}</td>
          <td style="border:1px solid #d7d1c8; padding:7px 8px; text-align:left; background:#efe5d7; font-weight:700;">${currency.format(
            categoryTotals.get(index) || 0
          )}</td>
        </tr>
      `
      : `
        <tr>
          <td style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left;">${escapeHtml(item.name)}</td>
          <td style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left;">${escapeHtml(item.unit)}</td>
          <td style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left;">${escapeHtml(item.quantity)}</td>
          <td style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left;">${currency.format(item.price)}</td>
          <td style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left;">${currency.format(item.total)}</td>
        </tr>
      `
  );
};

const getOfferDiscountTerms = (offer = {}) => ({
  discountType: offer.contractTerms?.discountType,
  discountValue: offer.contractTerms?.discountValue,
});

const buildOfferPdfTotalsHtml = (offer) => {
  const vatLabel = offer.vatRate === "none" ? "Bez faktury / bez VAT" : `${offer.vatRate}%`;
  const totals = calculateDocumentTotals({
    items: offer.items || [],
    vatRateValue: offer.vatRate,
    discount: getOfferDiscountTerms(offer),
    receivedAmountValue: getReceivedAmount(offer.contractTerms || {}),
  });
  const discountSummaryHtml = totals.hasDiscount
    ? `<div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e4ddd4;"><span>${
        totals.discountType === "percent" ? `Zniżka (${String(totals.discountValue).replace(".", ",")}%)` : "Zniżka kwotowa"
      }</span><span>- ${escapeHtml(totals.discountLabel)}</span></div>`
    : "";
  const receivedSummaryHtml = totals.hasReceivedAmount
    ? `<div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e4ddd4;"><span>Wpłacono</span><span>- ${escapeHtml(
        totals.paidLabel
      )}</span></div>`
    : "";

  return `
    <div style="margin-top:16px; width:280px; margin-left:auto; font-size:10.5px;">
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e4ddd4;"><span>Stawka VAT</span><span>${escapeHtml(vatLabel)}</span></div>
      ${discountSummaryHtml}
      ${receivedSummaryHtml}
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e4ddd4;"><span>Netto</span><span>${escapeHtml(totals.hasDiscount ? totals.baseNetLabel : totals.netLabel || offer.netLabel || "-")}</span></div>
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e4ddd4;"><span>VAT</span><span>${escapeHtml(totals.vatLabel || offer.vatLabel || "-")}</span></div>
      <div style="display:flex; justify-content:space-between; padding:6px 0; font-weight:700;"><span>${totals.hasReceivedAmount ? "Do zapłaty" : "Razem"}</span><span>${escapeHtml(
        totals.hasReceivedAmount ? totals.remainingLabel : totals.grossLabel || offer.grossLabel || offer.totalLabel
      )}</span></div>
    </div>
  `;
};

const buildOfferPdfHeaderHtml = (offer, continuation = false) => {
  const documentLabels = getDocumentLabels(getOfferDocumentKind(offer));
  const clientBlock =
    offer.clientType === "company"
      ? `
        <div><strong>Firma:</strong> ${escapeHtml(offer.clientDetails.companyName || "")}</div>
        <div><strong>NIP:</strong> ${escapeHtml(offer.clientDetails.taxId || "-")}</div>
        <div><strong>Kontakt:</strong> ${escapeHtml(offer.clientDetails.contact || "-")}</div>
        <div><strong>Telefon:</strong> ${escapeHtml(offer.clientDetails.phone || "-")}</div>
        <div><strong>E-mail:</strong> ${escapeHtml(offer.clientDetails.email || "-")}</div>
        <div><strong>Adres:</strong> ${escapeHtml(offer.clientDetails.address || "-")}</div>
      `
      : `
        <div><strong>Klient:</strong> ${escapeHtml(offer.clientDetails.name || "")}</div>
        <div><strong>Telefon:</strong> ${escapeHtml(offer.clientDetails.phone || "-")}</div>
        <div><strong>E-mail:</strong> ${escapeHtml(offer.clientDetails.email || "-")}</div>
        <div><strong>Adres:</strong> ${escapeHtml(offer.clientDetails.address || "-")}</div>
      `;

  if (continuation) {
    return `
      <div style="display:grid; gap:4px; justify-items:center; margin: 8px 0 14px;">
        <h1 style="margin:0; font-size:18px; text-align:center;">${documentLabels.header} - ciąg dalszy</h1>
        <div style="font-size:10.5px; color:#6c6257;">${escapeHtml(offer.number)}</div>
      </div>
    `;
  }

  return `
    <div style="display:grid; gap:4px; justify-items:center; margin: 8px 0 16px;">
      <h1 style="margin:0; font-size:20px; text-align:center;">${documentLabels.header}</h1>
      <h2 style="margin:0; font-size:13px; text-align:center; font-weight:600;">${escapeHtml(offer.title || documentLabels.singularCapital)}</h2>
    </div>
    <div style="margin-bottom:12px;">
      <div><strong>${documentLabels.numberLabel}:</strong> ${escapeHtml(offer.number)}</div>
      <div><strong>${documentLabels.dateLabel}:</strong> ${escapeHtml(offer.date)}</div>
      <div><strong>${documentLabels.validUntilLabel}:</strong> ${escapeHtml(offer.validUntil || "-")}</div>
      <div><strong>Autor:</strong> ${escapeHtml(offer.author)}</div>
    </div>
    <section style="margin-top:12px;">
      <h3 style="margin:0 0 8px; font-size:13px;">Dane klienta</h3>
      ${clientBlock}
    </section>
  `;
};

const buildOfferPdfTableHtml = (rowsHtml) => `
  <table style="width:100%; border-collapse:collapse; margin-top:16px; font-size:10.5px;">
    <thead>
      <tr>
        <th style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left; background:#f3ede5;">Usługa</th>
        <th style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left; background:#f3ede5;">Jednostka</th>
        <th style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left; background:#f3ede5;">Ilość</th>
        <th style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left; background:#f3ede5;">Cena</th>
        <th style="border:1px solid #d7d1c8; padding:6px 7px; text-align:left; background:#f3ede5;">Suma</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
`;

const buildOfferPdfTrailingHtml = (offer) => {
  return `
    ${buildOfferPdfTotalsHtml(offer)}
    <section style="padding-top:12px;">
      <h3 style="margin:0 0 8px; font-size:13px;">Uwagi</h3>
      <div style="white-space:pre-wrap;">${formatMultilineHtml(offer.notes)}</div>
    </section>
  `;
};

const buildOfferPageDocumentHtml = (contentHtml) => `
  <div style="font-family: Arial, sans-serif; color:#1f1a17; background:#ffffff; font-size:11px; line-height:1.35; padding:0;">
    ${contentHtml}
  </div>
`;

const buildOfferPdfRowBlocks = (offer) => {
  const items = offer.items || [];
  const rows = buildOfferPdfRows(offer);
  const blocks = [];

  for (let index = 0; index < rows.length; index += 1) {
    const item = items[index];
    if (item?.type === "category") {
      let blockHtml = rows[index];
      const nextItem = items[index + 1];

      if (nextItem && nextItem.type !== "category") {
        blockHtml += rows[index + 1];
        index += 1;
      }

      blocks.push(blockHtml);
      continue;
    }

    blocks.push(rows[index]);
  }

  return blocks;
};

const paginateOfferContent = (offer) => {
  const rowBlocks = buildOfferPdfRowBlocks(offer);
  const trailingHtml = buildOfferPdfTrailingHtml(offer);
  const measureHost = document.createElement("div");
  measureHost.style.position = "fixed";
  measureHost.style.left = "-10000px";
  measureHost.style.top = "0";
  measureHost.style.width = "794px";
  measureHost.style.padding = "34px 42px";
  measureHost.style.boxSizing = "border-box";
  measureHost.style.background = "#ffffff";
  document.body.appendChild(measureHost);

  const metrics = getPdfPageMetrics();
  const maxContentHeightPx = Math.floor((794 * metrics.printableHeight) / metrics.printableWidth);
  const pages = [];

  const measurePageHeight = (html) => {
    measureHost.innerHTML = buildOfferPageDocumentHtml(html);
    return measureHost.firstElementChild?.scrollHeight || 0;
  };

  const buildPageHtml = (pageRows, continuation = false, extraHtml = "") =>
    `${buildOfferPdfHeaderHtml(offer, continuation)}${buildOfferPdfTableHtml(pageRows.join(""))}${extraHtml}`;

  let currentRows = [];
  let isContinuation = false;

  rowBlocks.forEach((rowBlockHtml) => {
    const candidateRows = [...currentRows, rowBlockHtml];
    const candidateHtml = buildPageHtml(candidateRows, isContinuation);
    if (measurePageHeight(candidateHtml) > maxContentHeightPx && currentRows.length) {
      pages.push(buildOfferPageDocumentHtml(buildPageHtml(currentRows, isContinuation)));
      currentRows = [rowBlockHtml];
      isContinuation = true;
    } else {
      currentRows = candidateRows;
    }
  });

  if (!currentRows.length) {
    currentRows = [];
  }

  const finalCandidateHtml = buildPageHtml(currentRows, isContinuation, trailingHtml);
  if (measurePageHeight(finalCandidateHtml) <= maxContentHeightPx) {
    pages.push(buildOfferPageDocumentHtml(finalCandidateHtml));
  } else {
    if (currentRows.length) {
      pages.push(buildOfferPageDocumentHtml(buildPageHtml(currentRows, isContinuation)));
    }
    pages.push(buildOfferPageDocumentHtml(`${buildOfferPdfHeaderHtml(offer, true)}${trailingHtml}`));
  }

  measureHost.remove();
  return pages;
};

const exportOfferPagesPdf = async ({ offer, filename }) => {
  const doc = createPdf();
  if (!doc) {
    return;
  }

  await preloadLogoForPdf();
  const pagesHtml = paginateOfferContent(offer);
  const metrics = getPdfPageMetrics();

  for (let index = 0; index < pagesHtml.length; index += 1) {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.style.width = "794px";
    container.style.padding = "34px 42px";
    container.style.boxSizing = "border-box";
    container.style.background = "#ffffff";
    container.innerHTML = pagesHtml[index];
    document.body.appendChild(container);

    try {
      const canvas = await window.html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 794,
        width: 794,
        scrollX: 0,
        scrollY: 0,
      });

      if (index > 0) {
        doc.addPage();
      }

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pageImageHeightMm = (canvas.height * metrics.printableWidth) / canvas.width;
      doc.addImage(imgData, "JPEG", metrics.pageMarginX, metrics.contentTop, metrics.printableWidth, pageImageHeightMm);
    } finally {
      container.remove();
    }
  }

  doc.save(filename);
};

const buildContractPdfHtml = (offer, htmlBuilder = buildContractHtml) => {
  const rawHtml = htmlBuilder(offer);
  const titleMatch = rawHtml.match(/<h3>(.*?)<\/h3>/);
  const contractTitle = titleMatch?.[1] || "UMOWA";
  const contractBody = rawHtml.replace(
    /<h3>.*?<\/h3>/,
    ""
  );

  return `
    <div style="font-family: Arial, sans-serif; color: #1f1a17; background: #ffffff; font-size: 11px; line-height: 1.45;">
      <div style="display:grid; justify-items:center; gap:8px; margin: 8px 0 18px;">
        <h1 style="margin:0; font-size:22px; text-align:center; letter-spacing:0.02em;">${contractTitle}</h1>
      </div>
      <div style="border-top:1px solid #d7d1c8; padding-top:18px;">
        ${contractBody}
      </div>
    </div>
  `;
};

const createPdf = () => {
  if (!window.jspdf?.jsPDF || !window.html2canvas) {
    showToast("Biblioteki PDF nie zostały załadowane. Odśwież stronę i spróbuj ponownie.");
    return null;
  }
  return new window.jspdf.jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
};

const preloadLogoForPdf = async () => {
  if (cachedLogoDataUrl !== null) {
    return cachedLogoDataUrl;
  }

  try {
    const response = await fetch(logoUrl);
    if (!response.ok) {
      cachedLogoDataUrl = "";
      return cachedLogoDataUrl;
    }

    const blob = await response.blob();
    cachedLogoDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    cachedLogoDataUrl = "";
  }

  return cachedLogoDataUrl;
};

const waitForImages = async (container) => {
  const images = [...container.querySelectorAll("img")];
  await Promise.all(
    images.map(
      (image) =>
        new Promise((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        })
    )
  );
};

const getPdfPageMetrics = () => ({
  pageMarginX: 10,
  contentTop: 10,
  contentBottom: 287,
  printableWidth: 190,
  printableHeight: 277,
});

const buildPageSliceCanvases = (canvas, printableWidth, printableHeight) => {
  const pageHeightPx = Math.floor((canvas.width * printableHeight) / printableWidth);
  const slices = [];
  let renderedHeightPx = 0;

  while (renderedHeightPx < canvas.height) {
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedHeightPx);
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;

    const pageContext = pageCanvas.getContext("2d");
    pageContext.fillStyle = "#ffffff";
    pageContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    pageContext.drawImage(
      canvas,
      0,
      renderedHeightPx,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      pageCanvas.width,
      sliceHeightPx
    );

    slices.push(pageCanvas);
    renderedHeightPx += sliceHeightPx;
  }

  return slices;
};

const exportHtmlAsPdf = async ({ html, filename, compact = false }) => {
  const doc = createPdf();
  if (!doc) {
    return;
  }

  await preloadLogoForPdf();

  const container = document.createElement("div");
  const pageWidthPx = 794;
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.width = `${pageWidthPx}px`;
  container.style.padding = compact ? "22px 30px" : "34px 42px";
  container.style.boxSizing = "border-box";
  container.style.background = "#ffffff";
  container.style.color = "#1f1a17";
  container.style.zIndex = "1";
  container.style.opacity = "1";
  container.style.pointerEvents = "none";
  container.style.transform = "none";
  container.style.overflow = "visible";
  container.innerHTML = html;
  document.body.appendChild(container);

  const contractDocument = container.querySelector(".contract-document");
  if (contractDocument) {
    contractDocument.style.padding = "0";
    contractDocument.style.border = "0";
    contractDocument.style.background = "#ffffff";
    contractDocument.style.borderRadius = "0";
    contractDocument.style.boxShadow = "none";
    contractDocument.style.lineHeight = compact ? "1.32" : "1.52";
    contractDocument.style.fontSize = compact ? "9.8px" : "11px";
  }

  container.querySelectorAll(".contract-document h3").forEach((node) => {
    node.style.textAlign = "center";
    node.style.fontSize = compact ? "20px" : "22px";
    node.style.margin = compact ? "0 0 14px" : "0 0 18px";
  });

  container.querySelectorAll(".contract-document h4").forEach((node) => {
    node.style.margin = compact ? "12px 0 6px" : "16px 0 8px";
    node.style.fontSize = compact ? "13px" : "14px";
  });

  container.querySelectorAll(".contract-document p, .contract-document li").forEach((node) => {
    node.style.margin = compact ? "0 0 7px" : "0 0 9px";
  });

  container.querySelectorAll(".signature-row").forEach((node) => {
    node.style.marginTop = compact ? "18px" : "24px";
    node.style.paddingTop = compact ? "12px" : "16px";
    node.style.borderTop = "1px solid #d7d1c8";
  });

  await waitForImages(container);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  try {
    const canvas = await window.html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: pageWidthPx,
      width: pageWidthPx,
      scrollX: 0,
      scrollY: 0,
    });

    const metrics = getPdfPageMetrics();
    const slices = buildPageSliceCanvases(canvas, metrics.printableWidth, metrics.printableHeight);

    slices.forEach((pageCanvas, pageIndex) => {
      if (pageIndex > 0) {
        doc.addPage();
      }

      const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.98);
      const pageImageHeightMm = (pageCanvas.height * metrics.printableWidth) / pageCanvas.width;
      doc.addImage(pageImgData, "JPEG", metrics.pageMarginX, metrics.contentTop, metrics.printableWidth, pageImageHeightMm);
    });

    doc.save(filename);
  } finally {
    container.remove();
  }
};

const buildContractPageDocumentHtml = (contentHtml, compact = true) => `
  <div class="contract-document" style="font-family: Arial, sans-serif; color:#1f1a17; background:#ffffff; padding:0; border:0; border-radius:0; box-shadow:none; line-height:${compact ? "1.32" : "1.45"}; font-size:${compact ? "9.8px" : "11px"};">
    ${contentHtml}
  </div>
`;

const paginateContractContent = (offer, htmlBuilder = buildContractHtml) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(htmlBuilder(offer), "text/html");
  const root = parsed.body.querySelector(".contract-document");
  if (!root) {
    return [buildContractPageDocumentHtml(buildContractPdfHtml(offer, htmlBuilder), true)];
  }

  const titleNode = root.querySelector("h3");
  const titleHtml = titleNode
    ? `<h3 style="text-align:center; font-size:20px; margin:0 0 14px;">${titleNode.textContent}</h3>`
    : "";

  const blocks = [];
  let currentBlock = [];

  [...root.children].forEach((child) => {
    if (child.tagName === "H3") {
      return;
    }

    if (child.tagName === "H4" || child.classList.contains("signature-row")) {
      if (currentBlock.length) {
        blocks.push(currentBlock.join(""));
        currentBlock = [];
      }
      currentBlock.push(child.outerHTML);
      return;
    }

    currentBlock.push(child.outerHTML);
  });

  if (currentBlock.length) {
    blocks.push(currentBlock.join(""));
  }

  const measureHost = document.createElement("div");
  measureHost.style.position = "fixed";
  measureHost.style.left = "-10000px";
  measureHost.style.top = "0";
  measureHost.style.width = "794px";
  measureHost.style.padding = "22px 30px";
  measureHost.style.boxSizing = "border-box";
  measureHost.style.background = "#ffffff";
  document.body.appendChild(measureHost);

  const metrics = getPdfPageMetrics();
  const maxContentHeightPx = Math.floor((794 * metrics.printableHeight) / metrics.printableWidth);
  const pages = [];
  let pageHtml = titleHtml;

  const measurePageHeight = (html) => {
    measureHost.innerHTML = buildContractPageDocumentHtml(html, true);
    const node = measureHost.firstElementChild;
    node.querySelectorAll("h4").forEach((heading) => {
      heading.style.margin = "12px 0 6px";
      heading.style.fontSize = "13px";
    });
    node.querySelectorAll("p, li").forEach((el) => {
      el.style.margin = "0 0 7px";
    });
    const signature = node.querySelector(".signature-row");
    if (signature) {
      signature.style.marginTop = "18px";
      signature.style.paddingTop = "12px";
      signature.style.borderTop = "1px solid #d7d1c8";
    }
    return node.scrollHeight;
  };

  blocks.forEach((blockHtml, index) => {
    const candidateHtml = pageHtml ? `${pageHtml}${blockHtml}` : blockHtml;
    const candidateHeight = measurePageHeight(candidateHtml);

    if (candidateHeight > maxContentHeightPx && pageHtml) {
      pages.push(buildContractPageDocumentHtml(pageHtml, true));
      pageHtml = blockHtml;
    } else {
      pageHtml = candidateHtml;
    }

    if (index === blocks.length - 1 && pageHtml) {
      pages.push(buildContractPageDocumentHtml(pageHtml, true));
    }
  });

  measureHost.remove();
  return pages;
};

const exportContractPagesPdf = async ({ offer, filename, htmlBuilder = buildContractHtml }) => {
  const doc = createPdf();
  if (!doc) {
    return;
  }

  await preloadLogoForPdf();
  const pagesHtml = paginateContractContent(offer, htmlBuilder);
  const metrics = getPdfPageMetrics();

  for (let index = 0; index < pagesHtml.length; index += 1) {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.style.width = "794px";
    container.style.padding = "22px 30px";
    container.style.boxSizing = "border-box";
    container.style.background = "#ffffff";
    container.innerHTML = pagesHtml[index];
    document.body.appendChild(container);

    try {
      const canvas = await window.html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 794,
        width: 794,
        scrollX: 0,
        scrollY: 0,
      });

      if (index > 0) {
        doc.addPage();
      }

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pageImageHeightMm = (canvas.height * metrics.printableWidth) / canvas.width;
      doc.addImage(imgData, "JPEG", metrics.pageMarginX, metrics.contentTop, metrics.printableWidth, pageImageHeightMm);
    } finally {
      container.remove();
    }
  }

  doc.save(filename);
};

const renderContractPreview = () => {
  const totals = getTotalsSnapshot();
  const items = collectItems().filter((item) => item.name);
  const offer = {
    number: offerNumber.textContent,
    date: offerDate.textContent,
    items,
    totalLabel: totals.hasReceivedAmount ? totals.remainingLabel : totals.grossLabel,
    netLabel: totals.netLabel,
    vatLabel: totals.vatLabel,
    grossLabel: totals.grossLabel,
    warranty: warrantyPeriod.value,
    clientDetails: getClientDetails(),
    contractTerms: getContractTerms(),
  };

  contractPreview.innerHTML = buildContractHtml(offer);
};

const downloadOfferPdf = (offerId) => {
  const offer = state.savedOffers.find((entry) => entry.id === offerId);
  const documentLabels = getDocumentLabels(getOfferDocumentKind(offer));
  if (!offer) {
    showToast("Nie udało się przygotować PDF tego dokumentu.");
    return;
  }
  (async () => {
    await exportOfferPagesPdf({
      offer,
      filename: `${offer.number}-${documentLabels.filenameSuffix}.pdf`,
    });
  })().catch(() => {
    showToast("Nie udało się wygenerować PDF tego dokumentu.");
  });
};

const downloadContractPdf = (offerId) => {
  const offer = state.savedOffers.find((entry) => entry.id === offerId);
  if (!offer) {
    showToast("Nie udało się przygotować PDF tej umowy.");
    return;
  }
  (async () => {
    await exportContractPagesPdf({
      offer,
      filename: `${offer.number}-umowa.pdf`,
    });
  })().catch(() => {
    showToast("Nie udało się wygenerować PDF tej umowy.");
  });
};

const downloadPreliminaryContractPdf = (offerId) => {
  const offer = state.savedOffers.find((entry) => entry.id === offerId);
  if (!offer) {
    showToast("Nie udało się przygotować PDF umowy wstępnej.");
    return;
  }
  (async () => {
    await exportContractPagesPdf({
      offer,
      filename: `${offer.number}-umowa-wstepna.pdf`,
      htmlBuilder: buildPreliminaryContractHtml,
    });
  })().catch(() => {
    showToast("Nie udało się wygenerować PDF umowy wstępnej.");
  });
};

const deleteOffer = async (offerId) => {
  try {
    const payload = await apiRequest(`/api/offers/${offerId}`, {
      method: "DELETE",
    });
    applyBootstrapData(payload);
    if (state.editingOfferId === offerId) {
      resetOfferForm();
    }
    showToast("Usunięto ofertę i powiązaną umowę.");
  } catch (_error) {
    showToast("Nie udało się usunąć tego zapisu.");
  }
};

const editOffer = (offerId, tabToOpen = "offers") => {
  const offer = state.savedOffers.find((entry) => entry.id === offerId);
  if (!offer) {
    showToast("Nie udało się odnaleźć zapisanej oferty.");
    return;
  }

  state.editingOfferId = offer.id;
  const documentKind = getOfferDocumentKind(offer);
  document.querySelector(`input[name="documentKind"][value="${documentKind}"]`).checked = true;
  updateDocumentKindUi();
  offerNumber.textContent = offer.number;
  offerDate.textContent = offer.date;
  linkedOffer.value = offer.number;
  document.getElementById("offerTitle").value = offer.title;
  document.getElementById("validUntil").value = offer.validUntil;
  document.getElementById("offerNotes").value = offer.notes;
  warrantyPeriod.value = offer.warranty;
  vatRate.value = offer.vatRate;
  discountType.value = offer.contractTerms.discountType || "none";
  discountValue.value = offer.contractTerms.discountValue || "0";
  receivedAmount.value = offer.contractTerms.receivedAmount || "0";
  contractDate.value = offer.contractTerms.contractDate || "";
  contractCity.value = offer.contractTerms.contractCity || "Warszawa";
  worksiteAddress.value = offer.contractTerms.worksiteAddress || "";
  materialsProvider.value = offer.contractTerms.materialsProvider || "Wykonawca";
  startDateInput.value = offer.contractTerms.startDate || "";
  endDateInput.value = offer.contractTerms.endDate || "";
  paymentMode.value = offer.contractTerms.paymentMode || "installments";
  paymentInstallments.value = offer.contractTerms.paymentInstallments || "2";
  paymentHasAdvance.value = offer.contractTerms.paymentHasAdvance || "no";
  paymentAdvanceValue.value = offer.contractTerms.paymentAdvanceValue || "0";
  paymentAdvanceUnit.value = offer.contractTerms.paymentAdvanceUnit || "zł";
  paymentAdvanceTaxMode.value = offer.contractTerms.paymentAdvanceTaxMode || "brutto";
  paymentAdvanceDate.value = offer.contractTerms.paymentAdvanceDate || "";
  paymentFinalDate.value = offer.contractTerms.paymentFinalDate || "";
  paymentScheduleDetails.value = offer.contractTerms.paymentScheduleDetails || "";
  materialsPenaltyEnabled.checked = offer.contractTerms.materialsPenaltyEnabled ?? true;
  materialsPenaltyValue.value = offer.contractTerms.materialsPenaltyValue || "300";
  materialsPenaltyUnit.value = offer.contractTerms.materialsPenaltyUnit || "zł";
  materialsPenaltyTiming.value = offer.contractTerms.materialsPenaltyTiming || "za każdy dzień opóźnienia";
  breachPenaltyEnabled.checked = offer.contractTerms.breachPenaltyEnabled ?? true;
  breachPenaltyValue.value = offer.contractTerms.breachPenaltyValue || "2";
  breachPenaltyUnit.value = offer.contractTerms.breachPenaltyUnit || "%";
  breachPenaltyTiming.value = offer.contractTerms.breachPenaltyTiming || "za każdy dzień naruszenia";
  breachCureDays.value = offer.contractTerms.breachCureDays || "3";
  preliminaryPenaltyValue.value = offer.contractTerms.preliminaryPenaltyValue || "5000";
  preliminaryPenaltyUnit.value = offer.contractTerms.preliminaryPenaltyUnit || "zł";
  preliminaryPenaltyPaymentDays.value = offer.contractTerms.preliminaryPenaltyPaymentDays || "7";
  preliminaryTerms.value = offer.contractTerms.preliminaryTerms || "";
  updatePaymentSettingsVisibility();

  document.querySelector(`input[name="clientType"][value="${offer.clientType}"]`).checked = true;
  toggleClientFields();

  if (offer.clientType === "company") {
    document.getElementById("companyName").value = offer.clientDetails.companyName || "";
    document.getElementById("companyTaxId").value = offer.clientDetails.taxId || "";
    document.getElementById("companyContact").value = offer.clientDetails.contact || "";
    document.getElementById("companyPhone").value = offer.clientDetails.phone || "";
    document.getElementById("companyEmail").value = offer.clientDetails.email || "";
    document.getElementById("companyAddress").value = offer.clientDetails.address || "";
  } else {
    document.getElementById("individualName").value = offer.clientDetails.name || "";
    document.getElementById("individualPhone").value = offer.clientDetails.phone || "";
    document.getElementById("individualEmail").value = offer.clientDetails.email || "";
    document.getElementById("individualAddress").value = offer.clientDetails.address || "";
  }

  itemsBody.innerHTML = "";
  offer.items.forEach((item) => createItemRow(item));
  updateDocumentKindUi();
  updatePaymentSettingsVisibility();
  updateTotals();
  syncContractPreview();
  openTab(tabToOpen);
  showToast(`Wczytano do edycji: ${offer.number}.`);
};

const renderBoardNotes = () => {
  if (!boardNotesList) {
    return;
  }

  if (!state.boardNotes.length) {
    boardNotesList.innerHTML = '<p class="empty-state">Tablica jest jeszcze pusta.</p>';
    return;
  }

  boardNotesList.innerHTML = state.boardNotes
    .map(
      (note) => `
        <article class="board-note-card">
          <div class="board-note-head">
            <div>
              <strong>Notatka</strong>
              <div class="board-note-meta">Dodana przez ${note.author} • ${formatDateTime(note.createdAt)}</div>
            </div>
            <button type="button" class="button button-secondary delete-board-note" data-note-id="${note.id}">Usuń</button>
          </div>

          ${note.entries
            .map(
              (entry, index) => `
                <div class="${index === 0 ? "board-note-body" : "board-note-entry"}">
                  ${index === 0 ? "" : `<div class="board-note-entry-meta">Dopisane przez ${entry.author} • ${formatDateTime(entry.createdAt)}</div>`}
                  <div>${escapeHtml(entry.text)}</div>
                </div>
              `
            )
            .join("")}

          <div class="board-note-actions">
            <label>
              Dopisz
              <textarea class="board-note-reply" rows="3" placeholder="Dopisz krótki tekst do tej notatki"></textarea>
            </label>
            <button type="button" class="button button-primary append-board-note" data-note-id="${note.id}">Dopisz</button>
          </div>
        </article>
      `
    )
    .join("");

  boardNotesList.querySelectorAll(".delete-board-note").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const payload = await apiRequest(`/api/board-notes/${button.dataset.noteId}`, {
          method: "DELETE",
        });
        state.boardNotes = payload.boardNotes || [];
        renderBoardNotes();
        showToast("Usunięto notatkę z tablicy.");
      } catch (_error) {
        showToast("Nie udało się usunąć notatki.");
      }
    });
  });

  boardNotesList.querySelectorAll(".append-board-note").forEach((button) => {
    button.addEventListener("click", async () => {
      const card = button.closest(".board-note-card");
      const textarea = card?.querySelector(".board-note-reply");
      const value = textarea?.value.trim() || "";
      if (!value) {
        showToast("Wpisz treść aktualizacji.");
        return;
      }

      try {
        const payload = await apiRequest(`/api/board-notes/${button.dataset.noteId}/entries`, {
          method: "POST",
          body: JSON.stringify({ text: value }),
        });
        state.boardNotes = payload.boardNotes || [];
        renderBoardNotes();
        showToast("Dopisano aktualizację do notatki.");
      } catch (_error) {
        showToast("Nie udało się dopisać aktualizacji.");
      }
    });
  });
};

const addBoardNote = async () => {
  const value = boardNoteInput?.value.trim() || "";
  if (!value) {
    showToast("Wpisz treść notatki.");
    return;
  }

  try {
    const payload = await apiRequest("/api/board-notes", {
      method: "POST",
      body: JSON.stringify({ text: value }),
    });
    state.boardNotes = payload.boardNotes || [];
    boardNoteInput.value = "";
    renderBoardNotes();
    showToast("Dodano nową notatkę do tablicy.");
  } catch (_error) {
    showToast("Nie udało się dodać notatki.");
  }
};

const renderSavedOffers = () => {
  const offers = state.savedOffers.filter((offer) => !isReceiptDocument(offer));

  if (!offers.length) {
    savedOffersList.innerHTML = '<p class="empty-state">Nie ma jeszcze zapisanych ofert.</p>';
    return;
  }

  savedOffersList.innerHTML = offers
    .map(
      (offer) => {
        const documentLabels = getDocumentLabels(getOfferDocumentKind(offer));
        return `
        <article class="saved-offer-card">
          <strong>${offer.number} - ${documentLabels.savedLabel}: ${offer.title || "Bez tytułu"}</strong>
          <div class="saved-meta">
            <span>Autor: ${offer.author}</span>
            <span>Klient: ${offer.clientLabel}</span>
            <span>Data: ${offer.date}</span>
            <span>Wartość: ${offer.totalLabel}</span>
          </div>
          <div class="saved-actions">
            <button type="button" class="button button-secondary edit-offer" data-offer-id="${offer.id}">Edytuj ofertę</button>
            <button type="button" class="button button-secondary download-offer-pdf" data-offer-id="${offer.id}">Pobierz PDF</button>
            <button type="button" class="button button-secondary delete-offer" data-offer-id="${offer.id}">X</button>
          </div>
        </article>
      `;
      }
    )
    .join("");

  savedOffersList.querySelectorAll(".edit-offer").forEach((button) => {
    button.addEventListener("click", () => editOffer(button.dataset.offerId));
  });
  savedOffersList.querySelectorAll(".download-offer-pdf").forEach((button) => {
    button.addEventListener("click", () => downloadOfferPdf(button.dataset.offerId));
  });
  savedOffersList.querySelectorAll(".delete-offer").forEach((button) => {
    button.addEventListener("click", () => deleteOffer(button.dataset.offerId));
  });
};

const renderSavedReceipts = () => {
  if (!savedReceiptsList) {
    return;
  }

  const receipts = state.savedOffers.filter(isReceiptDocument);

  if (!receipts.length) {
    savedReceiptsList.innerHTML = '<p class="empty-state">Nie ma jeszcze zapisanych rachunków.</p>';
    return;
  }

  savedReceiptsList.innerHTML = receipts
    .map(
      (offer) => `
        <article class="saved-offer-card">
          <strong>${offer.number} - Rachunek: ${offer.title || "Bez tytułu"}</strong>
          <div class="saved-meta">
            <span>Autor: ${offer.author}</span>
            <span>Klient: ${offer.clientLabel}</span>
            <span>Data: ${offer.date}</span>
            <span>Wartość: ${offer.totalLabel}</span>
          </div>
          <div class="saved-actions">
            <button type="button" class="button button-secondary edit-receipt" data-offer-id="${offer.id}">Edytuj rachunek</button>
            <button type="button" class="button button-secondary download-receipt-pdf" data-offer-id="${offer.id}">Pobierz PDF</button>
            <button type="button" class="button button-secondary delete-receipt" data-offer-id="${offer.id}">X</button>
          </div>
        </article>
      `
    )
    .join("");

  savedReceiptsList.querySelectorAll(".edit-receipt").forEach((button) => {
    button.addEventListener("click", () => editOffer(button.dataset.offerId));
  });
  savedReceiptsList.querySelectorAll(".download-receipt-pdf").forEach((button) => {
    button.addEventListener("click", () => downloadOfferPdf(button.dataset.offerId));
  });
  savedReceiptsList.querySelectorAll(".delete-receipt").forEach((button) => {
    button.addEventListener("click", () => deleteOffer(button.dataset.offerId));
  });
};

const renderSavedContracts = () => {
  if (!state.savedContracts.length) {
    savedContractsList.innerHTML = '<p class="empty-state">Umowy pojawią się automatycznie po zapisaniu oferty.</p>';
    return;
  }

  savedContractsList.innerHTML = state.savedContracts
    .map(
      (contract) => `
        <article class="saved-offer-card">
          <strong>${contract.offerNumber} - szkic umowy</strong>
          <div class="saved-meta">
            <span>Klient: ${contract.clientLabel}</span>
            <span>Kwota: ${contract.totalLabel}</span>
            <span>Gwarancja: ${contract.warranty}</span>
          </div>
          <div class="saved-actions">
            <button type="button" class="button button-secondary edit-contract" data-offer-id="${contract.offerId}">Edytuj z oferty</button>
            <button type="button" class="button button-secondary edit-preliminary-contract" data-offer-id="${contract.offerId}">Edytuj umowę wstępną</button>
            <button type="button" class="button button-secondary download-contract-pdf" data-offer-id="${contract.offerId}">Pobierz PDF</button>
            <button type="button" class="button button-secondary download-preliminary-contract-pdf" data-offer-id="${contract.offerId}">Umowa wstępna</button>
            <button type="button" class="button button-secondary delete-contract" data-offer-id="${contract.offerId}">X</button>
          </div>
        </article>
      `
    )
    .join("");

  savedContractsList.querySelectorAll(".edit-contract").forEach((button) => {
    button.addEventListener("click", () => editOffer(button.dataset.offerId, "contracts"));
  });
  savedContractsList.querySelectorAll(".edit-preliminary-contract").forEach((button) => {
    button.addEventListener("click", () => openPreliminaryContractEditor(button.dataset.offerId));
  });
  savedContractsList.querySelectorAll(".download-contract-pdf").forEach((button) => {
    button.addEventListener("click", () => downloadContractPdf(button.dataset.offerId));
  });
  savedContractsList.querySelectorAll(".download-preliminary-contract-pdf").forEach((button) => {
    button.addEventListener("click", () => downloadPreliminaryContractPdf(button.dataset.offerId));
  });
  savedContractsList.querySelectorAll(".delete-contract").forEach((button) => {
    button.addEventListener("click", () => deleteOffer(button.dataset.offerId));
  });
};

const resetOfferForm = () => {
  state.editingOfferId = null;
  document.querySelector('input[name="documentKind"][value="offer"]').checked = true;
  updateDocumentKindUi();
  document.getElementById("offerTitle").value = "";
  document.getElementById("validUntil").value = "";
  document.getElementById("offerNotes").value = "";
  document.getElementById("individualName").value = "";
  document.getElementById("individualPhone").value = "";
  document.getElementById("individualEmail").value = "";
  document.getElementById("individualAddress").value = "";
  document.getElementById("companyName").value = "";
  document.getElementById("companyTaxId").value = "";
  document.getElementById("companyContact").value = "";
  document.getElementById("companyPhone").value = "";
  document.getElementById("companyEmail").value = "";
  document.getElementById("companyAddress").value = "";
  document.querySelector('input[name="clientType"][value="individual"]').checked = true;
  toggleClientFields();
  itemsBody.innerHTML = "";
  createItemRow();
  vatRate.value = "23";
  discountType.value = "none";
  discountValue.value = "0";
  receivedAmount.value = "0";
  warrantyPeriod.value = "12 miesięcy";
  contractDate.value = new Date().toISOString().slice(0, 10);
  contractCity.value = "Warszawa";
  worksiteAddress.value = "";
  materialsProvider.value = "Wykonawca";
  startDateInput.value = "";
  endDateInput.value = "";
  paymentMode.value = "installments";
  paymentInstallments.value = "2";
  paymentHasAdvance.value = "no";
  paymentAdvanceValue.value = "0";
  paymentAdvanceUnit.value = "zł";
  paymentAdvanceTaxMode.value = "brutto";
  paymentAdvanceDate.value = "";
  paymentFinalDate.value = "";
  paymentScheduleDetails.value = "";
  materialsPenaltyEnabled.checked = true;
  materialsPenaltyValue.value = "300";
  materialsPenaltyUnit.value = "zł";
  materialsPenaltyTiming.value = "za każdy dzień opóźnienia";
  breachPenaltyEnabled.checked = true;
  breachPenaltyValue.value = "2";
  breachPenaltyUnit.value = "%";
  breachPenaltyTiming.value = "za każdy dzień naruszenia";
  breachCureDays.value = "3";
  preliminaryPenaltyValue.value = "5000";
  preliminaryPenaltyUnit.value = "zł";
  preliminaryPenaltyPaymentDays.value = "7";
  preliminaryTerms.value = "";
  updatePaymentSettingsVisibility();
  offerNumber.textContent = state.nextOfferNumber || offerNumber.textContent;
  offerDate.textContent = formatDate(new Date());
  linkedOffer.value = offerNumber.textContent;
  updateDocumentKindUi();
  syncContractPreview();
  updateTotals();
  refreshOfferNumberPreview();
};

const prefillDemoData = () => {
  document.getElementById("offerTitle").value = "Oferta prac remontowych - lokal usługowy";
  document.getElementById("validUntil").value = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  document.getElementById("companyName").value = "Nowak Investment Sp. z o.o.";
  document.getElementById("companyTaxId").value = "5251234567";
  document.getElementById("companyContact").value = "Piotr Nowak";
  document.getElementById("companyPhone").value = "501 200 300";
  document.getElementById("companyEmail").value = "biuro@nowakinvest.pl";
  document.getElementById("companyAddress").value = "ul. Słoneczna 4, 05-500 Piaseczno";
  document.querySelector('input[name="clientType"][value="company"]').checked = true;
  toggleClientFields();

  itemsBody.innerHTML = "";
  createItemRow({ type: "category", name: "Prace wykończeniowe" });
  createItemRow({ name: "Malowanie ścian", unit: "m2", quantity: 180, price: 24 });
  createItemRow({ name: "Gładź szpachlowa", unit: "m2", quantity: 180, price: 31 });
  createItemRow({ type: "category", name: "Elementy wykończeniowe" });
  createItemRow({ name: "Montaż listew przypodłogowych", unit: "mb", quantity: 56, price: 18 });
  document.getElementById("offerNotes").value =
    "Termin realizacji do ustalenia po akceptacji oferty. Materiały po stronie inwestora.";
  vatRate.value = "8";
  discountType.value = "none";
  discountValue.value = "0";
  worksiteAddress.value = "ul. Słoneczna 4, 05-500 Piaseczno";
  startDateInput.value = new Date().toISOString().slice(0, 10);
  endDateInput.value = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  updateTotals();
  syncContractPreview();
  showToast("Wypełniono ofertę przykładowymi danymi.");
};

const saveOffer = async () => {
  const items = collectItems().filter((item) => item.name);
  const chargeableItems = getChargeableItems(items);
  const totals = getTotalsSnapshot();
  const documentLabels = getDocumentLabels();

  if (!document.getElementById("offerTitle").value.trim()) {
    showToast(`Dodaj tytuł ${documentLabels.singular} przed zapisem.`);
    return;
  }

  if (!chargeableItems.length) {
    showToast("Dodaj przynajmniej jedną pozycję dokumentu.");
    return;
  }

  const offer = {
    id: state.editingOfferId || undefined,
    number: state.editingOfferId ? offerNumber.textContent : undefined,
    title: document.getElementById("offerTitle").value.trim(),
    author: state.user?.name || "Nieznany użytkownik",
    clientType: getClientType(),
    clientLabel: getClientLabel(),
    clientDetails: getClientDetails(),
    issueDate: new Date().toISOString().slice(0, 10),
    date: offerDate.textContent,
    validUntil: document.getElementById("validUntil").value,
    notes: document.getElementById("offerNotes").value.trim(),
    items,
    totalLabel: totals.grossLabel,
    netLabel: totals.netLabel,
    vatLabel: totals.vatLabel,
    grossLabel: totals.grossLabel,
    vatRate: vatRate.value,
    warranty: warrantyPeriod.value,
    contractTerms: getContractTerms(),
    totals: {
      net: totals.net,
      vat: totals.vat,
      gross: totals.gross,
    },
  };

  try {
    const payload = await apiRequest("/api/offers", {
      method: "POST",
      body: JSON.stringify(offer),
    });
    applyBootstrapData(payload);
    showToast(
      state.editingOfferId
        ? `Zapisano zmiany w ${documentLabels.singular}.`
        : documentLabels.kind === "receipt"
          ? "Rachunek został zapisany."
          : "Oferta i szkic umowy zostały zapisane."
    );
    resetOfferForm();
  } catch (_error) {
    showToast("Nie udało się zapisać oferty.");
  }
};

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const login = String(formData.get("login") || "").trim();
  const password = String(formData.get("password") || "").trim();

  try {
    const payload = await apiRequest("/api/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    });
    state.user = payload.user;
    currentUserLabel.textContent = payload.user.name;
    switchView(true);
    const bootstrap = await apiRequest("/api/bootstrap", { method: "GET" });
    applyBootstrapData(bootstrap);
    resetOfferForm();
    showToast(`Zalogowano jako ${payload.user.name}.`);
  } catch (_error) {
    showToast("Nieprawidłowy login lub hasło.");
  }
});

logoutButton?.addEventListener("click", async () => {
  try {
    await apiRequest("/api/logout", { method: "POST" });
  } catch (_error) {
    // Intentionally ignore logout errors on the client.
  }
  state.user = null;
  state.savedOffers = [];
  state.savedContracts = [];
  state.boardNotes = [];
  currentUserLabel.textContent = "-";
  loginForm.reset();
  switchView(false);
  renderSavedOffers();
  renderSavedContracts();
  renderSavedReceipts();
  renderBoardNotes();
  showToast("Wylogowano.");
});

addItemButton?.addEventListener("click", () => createItemRow());
addCategoryButton?.addEventListener("click", () => createItemRow({ type: "category" }));
addBoardNoteButton?.addEventListener("click", addBoardNote);
boardNoteInput?.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    addBoardNote();
  }
});
vatRate?.addEventListener("change", () => {
  updateTotals();
  syncContractPreview();
});
discountType?.addEventListener("change", () => {
  updateTotals();
  syncContractPreview();
});
discountValue?.addEventListener("input", () => {
  updateTotals();
  syncContractPreview();
});
receivedAmount?.addEventListener("input", () => {
  updateTotals();
  syncContractPreview();
});
[
  contractDate,
  contractCity,
  worksiteAddress,
  materialsProvider,
  startDateInput,
  endDateInput,
  paymentMode,
  paymentInstallments,
  paymentHasAdvance,
  paymentAdvanceValue,
  paymentAdvanceUnit,
  paymentAdvanceTaxMode,
  paymentAdvanceDate,
  paymentFinalDate,
  paymentScheduleDetails,
  materialsPenaltyEnabled,
  materialsPenaltyValue,
  materialsPenaltyUnit,
  materialsPenaltyTiming,
  breachPenaltyEnabled,
  breachPenaltyValue,
  breachPenaltyUnit,
  breachPenaltyTiming,
  breachCureDays,
  warrantyPeriod,
].forEach((field) => {
  field?.addEventListener("input", syncContractPreview);
  field?.addEventListener("change", syncContractPreview);
});
paymentMode?.addEventListener("change", updatePaymentSettingsVisibility);
paymentHasAdvance?.addEventListener("change", updatePaymentSettingsVisibility);
prefillButton?.addEventListener("click", prefillDemoData);
saveOfferButton?.addEventListener("click", saveOffer);
saveContractButton?.addEventListener("click", saveOffer);

document.querySelectorAll('input[name="clientType"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    toggleClientFields();
    syncContractPreview();
  });
});

document.querySelectorAll('input[name="documentKind"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    updateDocumentKindUi();
    syncContractPreview();
    refreshOfferNumberPreview();
  });
});

document.querySelectorAll("[data-tab-target]").forEach((button) => {
  button.addEventListener("click", () => openTab(button.dataset.tabTarget));
});

const initializeApp = async () => {
  createItemRow();
  offerDate.textContent = formatDate(new Date());
  updatePaymentSettingsVisibility();

  try {
    const bootstrap = await apiRequest("/api/bootstrap", { method: "GET" });
    state.user = bootstrap.user;
    currentUserLabel.textContent = bootstrap.user.name;
    switchView(true);
    applyBootstrapData(bootstrap);
    resetOfferForm();
  } catch (_error) {
    renderSavedOffers();
    renderSavedContracts();
    renderSavedReceipts();
    renderBoardNotes();
    switchView(false);
    resetOfferForm();
  }
};

initializeApp();
