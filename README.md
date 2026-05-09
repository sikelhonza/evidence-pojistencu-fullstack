# Evidence pojištěnců – Fullstack aplikace

Moderní webová aplikace pro správu evidence pojištěnců a jejich pojistných smluv. Postavená na Django REST Framework a React.

---

## Technologie

**Backend:**
- Python / Django
- Django REST Framework
- Simple JWT – autentizace pomocí JWT tokenů
- SQLite (vývoj)

**Frontend:**
- React + Vite
- React Router – navigace mezi stránkami
- Axios – komunikace s API
- React Hot Toast – notifikace

---

## Funkce

**Pro nepřihlášené uživatele:**
- Landing page s popisem aplikace

**Pro přihlášené uživatele:**
- Osobní profil s přehledem pojistek
- Upozornění na pojistky blížící se k vypršení

**Pro administrátory:**
- Přehled všech pojištěnců
- Přidávání, úprava a mazání pojištěnců
- Správa pojistných smluv (životní, automobilové, cestovní a další)
- Admin dashboard se statistikami a přehledem aktivity

---

## Role

| Role | Přístup |
|------|---------|
| Nepřihlášený | Landing page |
| User | Vlastní profil, pojistky |
| Admin | Vše výše + správa všech pojištěnců |

---

## Spuštění pomocí Docker (doporučeno)

### Požadavky
- [Docker Desktop](https://www.docker.com/get-started)

### Spuštění
```bash
docker-compose up --build
```

Aplikace poběží na:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## Manuální instalace

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

Vytvořeno jako portfoliový projekt.