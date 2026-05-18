# Lukupäiväkirja

Web-pohjainen lukupäiväkirjasovellus, jossa voit tallentaa lukemasi kirjat, lisätä kuvia ja kirjoittaa arvioita.

### REST API (Tehtävä 5)

**REST API CRUD-toiminnallisuus toteutettu:**

- **Books API:** Create, Read, Update, Delete
- **Genres API:** Create, Read
- PostgreSQL/SQLite -tietokanta ORM:llä (Sequelize)

  **Kaksi toisiinsa 1:N-suhteella liittyvää taulua:**

- `genres` (kategoriat) - yksi kategoria voi sisältää monta kirjaa
- `books` (kirjat) - yksi kirja kuuluu yhteen kategoriaan
- Foreign key: `books.genre_id` → `genres.id`

### REST API 2 (Tehtävä 6)

**Web-sovellus käyttöliittymällä:**

- React-frontend tarjoaa käyttöliittymän API:lle
- Toiminnallisuus: kirjojen lisäys, muokkaus, poisto, kategorioiden valinta
- PostgreSQL-tietokanta (Supabase) tuotantokäytössä
- SQLite kehityskäytössä

**Huomio palvelinasennuksesta:**
Julkaistu Render

## Ominaisuudet

- Kirjojen lisääminen, muokkaaminen ja poistaminen
- Kategorioiden hallinta (Fiktio, Tietokirja, Fantasia, jne.)
- Kirjan kansikuvan lataus
- Kirjan nimen, kirjailijan, kategorian ja arvion tallentaminen
- Responsiivinen ja moderni käyttöliittymä
- Valmis julkaistavaksi pilveen (Render, Azure, jne.)

## Teknologiat

**Frontend:**

- React
- CSS3

**Backend:**

- Node.js
- Express
- PostgreSQL (tuotanto - Supabase, Azure, Render)
- Multer (kuvien lataus)
- Sequelize ORM (tietokanta-adapteri)

## REST API Endpointit

### Books (Kirjat)

- `GET /api/books` - Hae kaikki kirjat (sisältää kategoria-tiedot)
- `GET /api/books/:id` - Hae yksittäinen kirja
- `POST /api/books` - Lisää uusi kirja (FormData: title, author, review, genre_id, image)
- `PUT /api/books/:id` - Päivitä kirja
- `DELETE /api/books/:id` - Poista kirja

### Genres (Kategoriat)

- `GET /api/genres` - Hae kaikki kategoriat
- `POST /api/genres` - Lisää uusi kategoria (JSON: {name})

### Health Check

- `GET /api/health` - Palvelimen tilatarkistus

**Tietokantarakenne (1:N-suhde):**

```
genres (1)          books (N)
├─ id              ├─ id
└─ name            ├─ title
                   ├─ author
                   ├─ review
                   ├─ image_path
                   ├─ genre_id (FK → genres.id)
                   └─ created_at
```

## Asennus ja käyttö paikallisesti

### 1. Asenna riippuvuudet

**Backend:**
\`\`\`bash
cd backend
npm install
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm install
\`\`\`

### 2. Käynnistä sovellus

**Backend (terminaali 1):**
\`\`\`bash
cd backend
npm start
\`\`\`
Backend käynnistyy osoitteeseen: http://localhost:3001

**Frontend (terminaali 2):**
\`\`\`bash
cd frontend
npm start
\`\`\`
Frontend käynnistyy osoitteeseen: http://localhost:3000

Sovellus avautuu automaattisesti selaimessa!

## Julkaisu pilvipalveluun

### Supabase PostgreSQL -tietokanta

Sovellus hyödyntää Supabase PostgreSQL

**Tuotantoon **

Lisää ympäristömuuttuja web serviceen:

- **Key:** `POSTGRESQL_CONNECTION_STRING`
- **Value:** Connection string Supabasesta

#### 5. Testaa yhteys

Käynnistä backend:
\`\`\`bash
cd backend
npm start
\`\`\`

### 3. CORS-asetukset

Backend on määritetty hyväksymään CORS-pyynnöt. Tuotannossa voi rajoittaa sallitut originit.

## 🔧 Ympäristömuuttujat

**Backend (paikallinen kehitys):**

```
PORT=3001
```

**Frontend (paikallinen kehitys):**

```
REACT_APP_API_URL=http://localhost:3001
```

**Tuotanto (Render):**

- Backend: `DATABASE_URL=` (Renderistä)
- Frontend: `REACT_APP_API_URL=`

## Sovelluksen rakenne

\`\`\`
Lukupaivakirja2/
├── backend/
│ ├── server.js # Express-serveri ja API-endpointit
│ ├── package.json
│ ├── uploads/ # Lähetetyt kuvat (luodaan automaattisesti)
│ └── lukupaivakirja.db # SQLite-tietokanta (luodaan automaattisesti)
├── frontend/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── components/
│ │ │ ├── BookForm.js # Kirjan lisäys/muokkaus -lomake
│ │ │ ├── BookForm.css
│ │ │ ├── BookList.js # Kirjalistaus
│ │ │ └── BookList.css
│ │ ├── App.js # Pääkomponentti
│ │ ├── App.css
│ │ ├── index.js
│ │ └── index.css
│ └── package.json
└── README.md
\`\`\`

## Tulevaisuuden parannukset

- [ ] Käyttäjän autentikointi
- [ ] Kirjojen suodatus ja hakutoiminto
- [ ] Tähtiarvostelut (1-5 tähteä)
- [ ] Kirjojen jakaminen sosiaalisessa mediassa
- [ ] Lukutilastot ja graafit
