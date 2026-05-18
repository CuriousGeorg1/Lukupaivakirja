# Lukupäiväkirja

Web-pohjainen lukupäiväkirjasovellus, jossa voit tallentaa lukemasi kirjat, lisätä kuvia ja kirjoittaa arvioita.

## 📋 Tehtävänannon täyttyminen

### REST API (Tehtävä 5)

✅ **REST API CRUD-toiminnallisuus toteutettu:**

- **Books API:** Create, Read, Update, Delete
- **Genres API:** Create, Read
- PostgreSQL/SQLite -tietokanta ORM:llä (Sequelize)

✅ **Kaksi toisiinsa 1:N-suhteella liittyvää taulua:**

- `genres` (kategoriat) - yksi kategoria voi sisältää monta kirjaa
- `books` (kirjat) - yksi kirja kuuluu yhteen kategoriaan
- Foreign key: `books.genre_id` → `genres.id`

### REST API 2 (Tehtävä 6)

✅ **Web-sovellus käyttöliittymällä:**

- React-frontend tarjoaa käyttöliittymän API:lle
- Toiminnallisuus: kirjojen lisäys, muokkaus, poisto, kategorioiden valinta
- PostgreSQL-tietokanta (Supabase) tuotantokäytössä
- SQLite kehityskäytössä

💡 **Huomio palvelinasennuksesta:**
Backend voidaan julkaista pilvipalvelussa (Render, Azure, ym.) web-serverillä.
Tämä projekti on optimoitu pilvipalveluihin, jotka tarjoavat Node.js-ympäristön.

## 🎯 Ominaisuudet

- ✅ Kirjojen lisääminen, muokkaaminen ja poistaminen
- ✅ Kategorioiden hallinta (Fiktio, Tietokirja, Fantasia, jne.)
- 📸 Kirjan kansikuvan lataus
- ✍️ Kirjan nimen, kirjailijan, kategorian ja arvion tallentaminen
- 📱 Responsiivinen ja moderni käyttöliittymä
- ☁️ Valmis julkaistavaksi pilveen (Render, Azure, jne.)

## 🛠️ Teknologiat

**Frontend:**

- React 18
- CSS3 (modernit graadisentit ja animaatiot)

**Backend:**

- Node.js
- Express
- SQLite (kehitys) / PostgreSQL (tuotanto - Supabase, Azure, Render)
- Multer (kuvien lataus)
- Sequelize ORM (tietokanta-adapteri)

## � REST API Endpointit

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

## �📦 Asennus ja käyttö paikallisesti

### Vaatimukset

- Node.js (versio 14 tai uudempi)
- npm

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

## 🚀 Julkaisu pilvipalveluun

### ☁️ Supabase PostgreSQL -tietokanta

Sovellus tukee Supabase PostgreSQL-tietokantaa. Tämä on suositeltava vaihtoehto, sillä Supabase tarjoaa:

- ✅ **Ilmainen PostgreSQL-tietokanta** (500 MB, 2 GB siirto/kk)
- ✅ **Ei luottokorttia tarvita**
- ✅ **Automaattiset backupit**
- ✅ **Graafinen käyttöliittymä** tietokannan hallintaan
- ✅ **RESTful API** (jos haluat laajentaa myöhemmin)

#### 1. Luo Supabase-projekti

1. Mene osoitteeseen: https://supabase.com
2. Kirjaudu sisään (GitHub, Google tai sähköpostilla)
3. Klikkaa **"New project"**
4. Täytä tiedot:
   - **Name:** Lukupaivakirja
   - **Database Password:** Keksi vahva salasana (tallenna talteen!)
   - **Region:** Europe (Helsinki tai Frankfurt)
   - **Pricing Plan:** Free
5. Klikkaa **"Create new project"** (kestää ~2 minuuttia)

#### 2. Luo tietokannan taulut

1. Siirry projektin **SQL Editor** -välilehdelle (vasemmasta valikosta)
2. Klikkaa **"New query"**
3. Kopioi ja liitä sisältö tiedostosta `backend/supabase-schema.sql`
4. Klikkaa **"Run"** (tai paina Cmd/Ctrl + Enter)
5. Näet viestin: "Success. No rows returned"

#### 3. Hae yhteysosoite (Connection String)

1. Siirry **Project Settings** (hammasratas-kuvake vasemmassa palkissa)
2. Valitse **Database** vasemmasta valikosta
3. Vieritä alas kohtaan **"Connection string"**
4. Valitse **"URI"** -välilehti
5. **TÄRKEÄÄ:** Valitse **"Use connection pooling"** ja **"Transaction"** mode
6. Kopioi connection string, joka näyttää tältä:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```
7. Korvaa `[password]` kohdassa aiemmin luomallasi salasanalla

#### 4. Aseta ympäristömuuttuja

**Paikalliseen kehitykseen:**

Avaa `backend/.env` tiedosto ja päivitä:

```bash
NODE_ENV=production
POSTGRESQL_CONNECTION_STRING=postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Tuotantoon (esim. Render):**

Lisää ympäristömuuttuja web serviceen:

- **Key:** `POSTGRESQL_CONNECTION_STRING`
- **Value:** Connection string Supabasesta

#### 5. Testaa yhteys

Käynnistä backend:
\`\`\`bash
cd backend
npm start
\`\`\`

Näet lokissa:

```
Using cloud database (Azure SQL/PostgreSQL)
Database connection established successfully
Database tables synchronized
Server running on port 3001
```

#### 6. Tarkista tietokanta

Supabase **Table Editor** -välilehdellä:

- Näet `books` taulun
- Voit lisätä, muokata ja poistaa rivejä suoraan
- Näet kaikki sarakkeet: id, title, author, review, image_path, created_at

#### Vinkkejä:

- 📊 **Table Editor:** Hallinnoi dataa visuaalisesti
- 🔍 **SQL Editor:** Aja SQL-kyselyitä suoraan
- 📈 **Database Usage:** Seuraa tietokannan käyttöä (Reports)
- 🔒 **Row Level Security (RLS):** Tällä hetkellä ei käytössä (voit ottaa käyttöön myöhemmin)

---

### ⭐ Suositeltu: Render (Helpoin!)

**Render on PALJON helpompi kuin Azure!** Ilmainen tier, ei luottokorttia, automaattinen deployment.

📘 **Katso yksityiskohtaiset ohjeet:** [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)  
⚡ **Pika-aloitus:** [RENDER_QUICKSTART.md](RENDER_QUICKSTART.md)

**Miksi Render?**

- ✅ Täysin ilmainen (backend + frontend + PostgreSQL)
- ✅ Ei luottokorttia vaadita
- ✅ ~20 minuuttia setupiin (vs. Azure 2-4h)
- ✅ Automaattinen deployment GitLabista
- ✅ HTTPS automaattisesti

**Pika-askeleet:**

1. Luo tili: https://render.com
2. Luo PostgreSQL-tietokanta (FREE)
3. Luo Backend Web Service (FREE)
4. Luo Frontend Static Site (FREE)
5. Valmis! 🎉

---

### Vaihtoehtoinen: Azure-julkaisu

Jos haluat käyttää Azurea (monimutkaisempi, vaatii luottokortin):

#### TÄRKEÄÄ: Tietokanta ensin!

SQLite ei toimi tuotannossa Azureen. **Luo ensin Azure SQL Database:**

📘 **Katso yksityiskohtaiset ohjeet:** [AZURE_DATABASE.md](AZURE_DATABASE.md)

**Nopea yhteenveto:**

```bash
# 1. Luo Azure SQL Database
az sql server create --name lukupaivakirja-sql --resource-group lukupaivakirja-rg \
  --location northeurope --admin-user sqladmin --admin-password 'YourPassword123!'

az sql db create --resource-group lukupaivakirja-rg --server lukupaivakirja-sql \
  --name lukupaivakirja --service-objective Basic

# 2. Lisää connection string App Serviceen
az webapp config appsettings set --name lukupaivakirja-backend \
  --resource-group lukupaivakirja-rg \
  --settings AZURE_SQL_CONNECTION_STRING="mssql://sqladmin:YourPassword123!@lukupaivakirja-sql.database.windows.net:1433/lukupaivakirja?encrypt=true"
```

**Sovellus tukee automaattisesti:**

- ✅ SQLite (paikallinen kehitys)
- ✅ Azure SQL Database (tuotanto)
- ✅ PostgreSQL (tuotanto)

Aseta vain ympäristömuuttuja `AZURE_SQL_CONNECTION_STRING` tai `POSTGRESQL_CONNECTION_STRING`!

### Vaihtoehto 1: Azure App Service (suositeltu helpoin tapa)

#### 1. Esivalmistelut

Asenna Azure CLI:
\`\`\`bash
brew install azure-cli # macOS

# tai lataa https://aka.ms/installazurecliwindows

\`\`\`

Kirjaudu Azure-tilillesi:
\`\`\`bash
az login
\`\`\`

#### 2. Luo resurssit Azureen

\`\`\`bash

# Luo resource group

az group create --name lukupaivakirja-rg --location northeurope

# Luo App Service Plan (Linux)

az appservice plan create \\
--name lukupaivakirja-plan \\
--resource-group lukupaivakirja-rg \\
--sku B1 \\
--is-linux

# Luo Web App backendille

az webapp create \\
--name lukupaivakirja-backend \\
--resource-group lukupaivakirja-rg \\
--plan lukupaivakirja-plan \\
--runtime "NODE|18-lts"

# Luo Web App frontendille

az webapp create \\
--name lukupaivakirja-frontend \\
--resource-group lukupaivakirja-rg \\
--plan lukupaivakirja-plan \\
--runtime "NODE|18-lts"
\`\`\`

#### 3. Määritä ympäristömuuttujat

**Backend:**
\`\`\`bash
az webapp config appsettings set \\
--name lukupaivakirja-backend \\
--resource-group lukupaivakirja-rg \\
--settings PORT=8080
\`\`\`

**Frontend:**
\`\`\`bash
az webapp config appsettings set \\
--name lukupaivakirja-frontend \\
--resource-group lukupaivakirja-rg \\
--settings REACT_APP_API_URL=https://lukupaivakirja-backend.azurewebsites.net
\`\`\`

#### 4. Julkaise sovellukset

**Backend:**
\`\`\`bash
cd backend
zip -r deploy.zip .
az webapp deployment source config-zip \\
--name lukupaivakirja-backend \\
--resource-group lukupaivakirja-rg \\
--src deploy.zip
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm run build
cd build
zip -r deploy.zip .
az webapp deployment source config-zip \\
--name lukupaivakirja-frontend \\
--resource-group lukupaivakirja-rg \\
--src deploy.zip
\`\`\`

### Vaihtoehto 2: VS Code Azure Extension

1. Asenna "Azure App Service" -laajennus VS Codeen
2. Kirjaudu Azure-tilillesi VS Codessa
3. Käytä "Deploy to Web App" -komentoa molemmille sovelluksille

### Vaihtoehto 3: GitHub Actions (CI/CD)

Deployment-tiedostot on valmiina `.github/workflows/` -kansiossa.

1. Luo GitHub-repositorio
2. Lisää GitHub Secretseihin:
   - `AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND`
   - `AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND`
3. Pushaa koodi GitHubiin - deployment tapahtuu automaattisesti!

## 📊 Tuotanto-optimoinnit Azurea varten

### 1. Korvaa SQLite Azure SQL:llä tai CosmosDB:llä

Nykyinen SQLite on hyvä kehitykseen, mutta tuotannossa suositellaan:

- **Azure SQL Database** (suositeltu)
- **Azure CosmosDB**

### 2. Käytä Azure Blob Storagea kuville

Vaihda kuvien tallennus backendin tiedostojärjestelmästä Azure Blob Storageen:
\`\`\`bash
npm install @azure/storage-blob --save
\`\`\`

### 3. CORS-asetukset

Backend on jo määritetty hyväksymään CORS-pyynnöt. Tuotannossa voit rajoittaa sallitut originit.

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

- Backend: `DATABASE_URL=postgresql://...` (automaattinen Renderistä)
- Frontend: `REACT_APP_API_URL=https://your-backend.onrender.com`

**Tuotanto (Azure):**

- Backend: `AZURE_SQL_CONNECTION_STRING` tai `POSTGRESQL_CONNECTION_STRING`
- Frontend: `REACT_APP_API_URL=https://your-backend.azurewebsites.net`

## 📝 API-dokumentaatio

### Endpoints

- `GET /api/books` - Hae kaikki kirjat
- `GET /api/books/:id` - Hae yksittäinen kirja
- `POST /api/books` - Lisää uusi kirja (multipart/form-data)
- `PUT /api/books/:id` - Päivitä kirja (multipart/form-data)
- `DELETE /api/books/:id` - Poista kirja
- `GET /api/health` - Terveydentyyntikysely

### Esimerkki POST-pyynnöstä:

\`\`\`javascript
const formData = new FormData();
formData.append('title', 'Kirjan nimi');
formData.append('author', 'Kirjailija');
formData.append('review', 'Arvio');
formData.append('image', imageFile);

fetch('http://localhost:3001/api/books', {
method: 'POST',
body: formData
});
\`\`\`

## 🎨 Sovelluksen rakenne

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

## 🐛 Kehitystyökalut

**Backend kehitys:**
\`\`\`bash
cd backend
npm install -g nodemon
npm run dev
\`\`\`

## � Lisenssi

MIT

## 📚 Dokumentaatio

- [README.md](README.md) - Pääohje
- [QUICKSTART.md](QUICKSTART.md) - Pika-aloitus paikalliseen kehitykseen
- **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) - Render-julkaisu (SUOSITELTU!)**
- **[RENDER_QUICKSTART.md](RENDER_QUICKSTART.md) - Render pika-aloitus**
- [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) - Azure-julkaisu (vaihtoehtoinen)
- [AZURE_DATABASE.md](AZURE_DATABASE.md) - Azure-tietokanta
- [ILMAINEN_TIETOKANTA.md](ILMAINEN_TIETOKANTA.md) - Ilmaiset tietokantavaihtoehdot

## 🤝 Tuki

Jos kohtaat ongelmia:

1. Tarkista että molemmat serverit (backend ja frontend) ovat käynnissä
2. Tarkista konsolista mahdolliset virheviestit
3. Varmista että portit 3000 ja 3001 ovat vapaana

## 🔮 Tulevaisuuden parannukset

- [ ] Käyttäjän autentikointi
- [ ] Kirjojen suodatus ja hakutoiminto
- [ ] Tähtiarvostelut (1-5 tähteä)
- [ ] Kirjojen jakaminen sosiaalisessa mediassa
- [ ] PWA-tuki (offline-toiminnallisuus)
- [ ] Dark mode
- [ ] Kirjojen vienti CSV/PDF-muodossa
- [ ] Lukutilastot ja graafit
