# Test Cases – Pojišťovna app

---

## TC-001 – Přidání pojištěnce s validními daty

**Priorita:** Critical  
**Typ:** Manuální  
**Status:** ✅ PASS

Vyplnil jsem všechna pole správnými daty a kliknul na přidat. Formulář se resetoval a pojištěnec se objevil v seznamu. Toast notifikace se zobrazila správně.

**Data:**
- Jméno: Jan
- Příjmení: Novák
- Email: jan.novak@email.cz
- Telefon: +420123456789
- Věk: 35

---

## TC-002 – Prázdný formulář

**Priorita:** Critical  
**Typ:** Manuální  
**Status:** ✅ PASS

Zkusil jsem kliknout na přidat bez vyplnění čehokoli. Formulář se neodeslal, prohlížeč označil první prázdné pole.

---

## TC-003 – Neplatný email

**Priorita:** High  
**Typ:** Manuální  
**Status:** ✅ PASS

Zadal jsem `neplatny-email` bez @ a domény. Formulář se neodeslal, prohlížeč zobrazil hlášku u pole email.

---

## TC-004 – Věk mimo rozsah

**Priorita:** High  
**Typ:** Manuální  
**Status:** ✅ PASS

Zkoušel jsem věk 0 a pak 121. Formulář v obou případech nepustil dál, prohlížeč hlásil že hodnota musí být mezi 1 a 120.

---

## TC-005 – Smazání hodnoty věku

**Priorita:** Medium  
**Typ:** Manuální  
**Status:** ✅ PASS

Napsal jsem věk 25 a pak hodnotu smazal. Pole zůstalo prázdné, neuložilo se 0. Tenhle bug jsem předtím měl v kódu – `Number("")` vracel 0, opravil jsem to podmínkou.

---

## TC-006 – Úprava pojištěnce

**Priorita:** Critical  
**Typ:** Manuální  
**Status:** ✅ PASS

Kliknul jsem na Upravit u existujícího pojištěnce. Formulář se předvyplnil jeho daty. Změnil jsem příjmení a uložil. V seznamu se změna projevila hned.

---

## TC-007 – Zrušení editace

**Priorita:** Medium  
**Typ:** Manuální  
**Status:** ✅ PASS

Otevřel jsem editaci pojištěnce, něco změnil a pak kliknul Zrušit. Formulář se vyprázdnil a přepnul zpět na přidání. Data pojištěnce se nezměnila. Předtím jsem tady měl bug – formulář zůstával vyplněný, opravil jsem to přidáním `setFormData(emptyForm)` do onClick.

---

## TC-008 – Double submit

**Priorita:** Medium  
**Typ:** Manuální  
**Status:** ✅ PASS

Zkusil jsem kliknout na tlačítko dvakrát rychle za sebou. Vznikl jen jeden záznam. Přidal jsem `loading` state a `disabled={loading}` na tlačítko, takže po prvním kliknutí se tlačítko deaktivuje a zobrazí „Ukládání...".

---

## TC-009 – GET /api/pojistenci/

**Priorita:** Critical  
**Typ:** API (Postman)  
**Status:** ✅ PASS

Přihlásil jsem se přes `POST /api/auth/login/`, cookie se uložila automaticky. Pak jsem poslal GET na `/api/pojistenci/` a dostal jsem zpět seznam všech pojištěnců ve formátu JSON.

**Response:** 200 OK

---

## TC-010 – POST s neplatnými daty

**Priorita:** High  
**Typ:** API (Postman)  
**Status:** ✅ PASS

Poslal jsem POST s prázdným jménem, neplatným emailem, špatným telefonem a věkem 200. Backend vrátil 400 a v response byly chyby pro každé pole zvlášť.

**Request:**
```json
{
  "jmeno": "",
  "prijmeni": "Novák",
  "email": "neplatny",
  "telefon": "123",
  "vek": 200
}
```

**Response:** 400 Bad Request  
Chyby: jmeno, email, telefon, vek

---

## TC-011 – Přístup bez přihlášení

**Priorita:** Critical  
**Typ:** API (Postman)  
**Status:** ✅ PASS

Odhlásil jsem se přes `POST /api/auth/logout/` a zkusil GET na `/api/pojistenci/` bez cookie. Dostal jsem 401 a žádná data se nevrátila.

**Response:** 401 Unauthorized – `Authentication credentials were not provided.`