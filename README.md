# Generator ofert i umow

Wewnetrzna aplikacja do:
- logowania uzytkownikow,
- tworzenia ofert,
- generowania umow remontowych,
- zapisywania i edycji dokumentow,
- wspolnej tablicy notatek.

## Uruchomienie

1. Ustaw zmienne srodowiskowe:
- `SUPABASE_DB_URL`
- `APP_SESSION_SECRET`

2. Zainstaluj zaleznosci:
- `npm install`

3. Uruchom serwer:
- `npm start`

4. Otworz w przegladarce:
- `http://localhost:8080`

## Logowanie

Konta pobierane sa z tabeli `public.app_users` w bazie Supabase.
