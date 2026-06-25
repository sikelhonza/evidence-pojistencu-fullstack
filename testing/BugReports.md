# Bug Reports

---

## BUG-001 — Formulář po zrušení editace zůstával vyplněný

**Priorita:** Medium  
**Status:** ✅ Opraveno  
**Nalezeno v:** PojistenecForm.jsx  
**Nalezeno při:** TC-007

**Popis:**  
Po kliknutí na tlačítko „Zrušit" v režimu editace se formulář nevynuloval. Pole zůstala vyplněná daty editovaného pojištěnce.

**Kroky k reprodukci:**
1. Klikni na „Upravit" u libovolného pojištěnce
2. Klikni na „Zrušit" bez jakékoli změny

**Aktuální chování:**  
Formulář zobrazuje data editovaného pojištěnce i po zrušení.

**Očekávané chování:**  
Formulář se resetuje na prázdný stav, nadpis se změní zpět na „Přidat nového pojištěnce".

**Oprava:**  
Přidáno `setFormData(emptyForm)` do onClick handleru tlačítka Zrušit.

```js
onClick={() => {
  setEditData(null);
  setFormData(emptyForm);
}}
```

---

## BUG-002 — Nesprávné porovnání v handleInputChange způsobovalo špatný typ věku

**Priorita:** High  
**Status:** ✅ Opraveno  
**Nalezeno v:** PojistenecForm.jsx  
**Nalezeno při:** TC-005

**Popis:**  
V handleInputChange bylo porovnáváno `value === "vek"` místo `name === "vek"`. Věk se proto nikdy nepřeváděl na číslo a odesílal se jako string.

**Aktuální chování:**  
Pole věk odesílalo hodnotu jako string (např. `"35"` místo `35`), což mohlo způsobit chybu na backendu.

**Očekávané chování:**  
Pole věk odesílá číselnou hodnotu.

**Oprava:**

```js
// Před opravou
[name]: value === "vek" ? Number(value) : value

// Po opravě
[name]: name === "vek" ? (value === "" ? "" : Number(value)) : value
```

---

## BUG-003 — Prázdný věk se ukládal jako 0 místo prázdného stringu

**Priorita:** Medium  
**Status:** ✅ Opraveno  
**Nalezeno v:** PojistenecForm.jsx  
**Nalezeno při:** TC-005

**Popis:**  
Když uživatel smazal hodnotu z pole Věk, `Number("")` vrátilo `0`. Formulář pak odesílal věk `0`, přestože pole bylo vizuálně prázdné. Backend přijal hodnotu `0`, která je mimo povolený rozsah (min=1).

**Aktuální chování:**  
Smazání hodnoty věku → odešle se `0`.

**Očekávané chování:**  
Smazání hodnoty věku → pole zůstane prázdné, formulář neprojde validací.

**Oprava:**

```js
[name]: name === "vek" ? (value === "" ? "" : Number(value)) : value
```