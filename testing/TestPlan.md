# Test Plan – Pojišťovna app

## Co testuji

Chci ověřit že formulář pro správu pojištěnců funguje správně, API vrací správné odpovědi a přihlašování funguje jak má.

## Co je v rozsahu

| Oblast | Zahrnuto |
|---|---|
| Formulář pojištěnců (přidat / upravit / zrušit) | ✅ |
| API endpointy (CRUD) | ✅ |
| Autentizace (JWT cookie) | ✅ |
| Validace vstupů (frontend + backend) | ✅ |
| UI / responzivita | částečně |

## Jak testuji

- Manuálně přes UI v prohlížeči
- API volání přes Postman
- Zkouším i hraniční případy – prázdná pole, špatné formáty, duplicitní email

## Prostředí

- Backend: Django REST Framework
- Frontend: React
- Databáze: PostgreSQL (Docker)
- API klient: Postman
- Prohlížeč: Chrome

## Poznámka k autentizaci

Backend ukládá JWT token do httpOnly cookie, ne do Authorization headeru. V Postmanu to funguje automaticky – po přihlášení se cookie uloží a posílá se s každým dalším requestem.

## Kdy je testování hotové

- Všechny critical testy prošly
- Žádný otevřený bug s prioritou Critical nebo High
- Formulář správně zpracovává validní i nevalidní vstupy
- API vrací správné HTTP status kódy

## Priority

| Priorita | Oblast |
|---|---|
| 🔴 Critical | Přihlášení, JWT autentizace |
| 🔴 Critical | Přidání / úprava pojištěnce |
| 🔴 Critical | Přístup bez autentizace (401) |
| 🟡 High | Validace formuláře (frontend + backend) |
| 🟡 High | API error handling (400) |
| 🟢 Medium | UI feedback (toast notifikace) |
| 🟢 Medium | Cancel button / reset formuláře |
| 🟢 Medium | Edge cases (prázdný věk, double submit) |

## Výsledky

| Test Case | Popis | Výsledek |
|---|---|---|
| TC-001 | Přidání pojištěnce s validními daty | ✅ PASS |
| TC-002 | Přidání pojištěnce s prázdnými poli | ✅ PASS |
| TC-003 | Neplatný email | ✅ PASS |
| TC-004 | Věk mimo rozsah | ✅ PASS |
| TC-005 | Smazání hodnoty věku | ✅ PASS |
| TC-006 | Úprava existujícího pojištěnce | ✅ PASS |
| TC-007 | Zrušení editace (Cancel button) | ✅ PASS |
| TC-008 | Double submit | ✅ PASS |
| TC-009 | GET /api/pojistenci/ | ✅ PASS |
| TC-010 | POST s neplatnými daty | ✅ PASS |
| TC-011 | Přístup bez autentizace | ✅ PASS |
