# Ilmaiset Tietokantavaihtoehdot - Lukupäiväkirja

**Ei tarvitse Azure-tietokantaa!** Käytä näitä ilmaisia vaihtoehtoja sen sijaan.

## 🎉 Suositeltu: Supabase (PostgreSQL)

**Ilmainen tier:**

- ✅ 500 MB tietokantaa
- ✅ Rajoittamaton määrä rivejä
- ✅ 50,000 kuukausittaista käyttäjää
- ✅ Automaattiset varmuuskopiot
- ✅ Ei luottokorttia tarvita

### 1. Luo Supabase-tietokanta

1. Mene osoitteeseen: https://supabase.com
2. Klikkaa **"Start your project"** → **"Sign up"**
3. Kirjaudu GitHub-tilillä (nopein tapa)
4. Klikkaa **"New Project"**
5. Täytä tiedot:
   - **Name:** lukupaivakirja
   - **Database Password:** Luo vahva salasana (tallenna tämä!)
   - **Region:** Europe (Stockholm tai Frankfurt)
   - **Pricing Plan:** Free
6. Klikkaa **"Create new project"** (kestää ~2 min)

### 2. Hae Connection String

1. Kun projekti on valmis, klikkaa **"Settings"** (vaihtoehto-kuvake vasemmalla)
2. Klikkaa **"Database"**
3. Vieritä alas kohtaan **"Connection string"**
4. Valitse **"URI"** ja kopioi connection string

Se näyttää tältä:

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

**TÄRKEÄÄ:** Vaihda `[YOUR-PASSWORD]` sillä salasanalla, jonka loit vaiheessa 1.5.

### 3. Lisää Azure App Serviceen

**Vaihtoehto A: Azure Portal**

1. Avaa Azure Portal → App Service → **lukupaivakirja-backend**
2. Klikkaa **Configuration** → **Application settings**
3. Klikkaa **"+ New application setting"**
4. Täytä:
   - **Name:** `POSTGRESQL_CONNECTION_STRING`
   - **Value:** (liitä Supabasen connection string)
5. Lisää toinen asetus:
   - **Name:** `NODE_ENV`
   - **Value:** `production`
6. Klikkaa **"Save"** → **"Continue"**
7. App Service käynnistyy uudelleen automaattisesti

**Vaihtoehto B: Azure CLI**

```bash
az webapp config appsettings set \
  --name lukupaivakirja-backend \
  --resource-group lukupaivakirja-rg \
  --settings \
    NODE_ENV=production \
    POSTGRESQL_CONNECTION_STRING="postgresql://postgres:SALASANA@db.xxxxx.supabase.co:5432/postgres"
```

### 4. Testaa paikallisesti ensin

```bash
cd backend

# Luo .env tiedosto
cat > .env << 'EOF'
NODE_ENV=production
POSTGRESQL_CONNECTION_STRING=postgresql://postgres:SALASANA@db.xxxxx.supabase.co:5432/postgres
EOF

# Käynnistä
npm start
```

Jos näet:

```
Using cloud database (Azure SQL/PostgreSQL)
Database connection established successfully
Database tables synchronized
Server running on port 3001
```

✅ **Toimii! Voit nyt julkaista Azureen.**

---

## Vaihtoehto 2: Neon (PostgreSQL)

**Ilmainen tier:**

- ✅ 512 MB tietokantaa
- ✅ 1 projekti
- ✅ Serverless (ei maksua kun ei käytössä)
- ✅ Ei luottokorttia

### 1. Luo Neon-tietokanta

1. Mene: https://neon.tech
2. **"Sign up"** → Kirjaudu GitHubilla
3. Klikkaa **"Create a project"**
4. Täytä:
   - **Project name:** lukupaivakirja
   - **Region:** Europe (Frankfurt)
   - **Postgres version:** 15
5. Klikkaa **"Create project"**

### 2. Hae Connection String

Projektin luonnin jälkeen näet connection stringin automaattisesti:

```
postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

Kopioi se ja käytä samalla tavalla kuin Supabasen kanssa!

---

## Vaihtoehto 3: Railway (PostgreSQL)

**Ilmainen tier:**

- ✅ $5 ilmaista käyttöä/kk
- ✅ Riittää pienelle sovellukselle
- ✅ Helppo käyttää

### 1. Luo Railway-tietokanta

1. Mene: https://railway.app
2. **"Start a New Project"** → Kirjaudu GitHubilla
3. Klikkaa **"New Project"** → **"Provision PostgreSQL"**
4. Nimeä projekti: **lukupaivakirja**

### 2. Hae Connection String

1. Klikkaa PostgreSQL-palvelua
2. Klikkaa **"Variables"**-välilehteä
3. Kopioi **`DATABASE_URL`** arvo

---

## Vaihtoehto 4: MongoDB Atlas (NoSQL)

Jos haluat kokeilla NoSQL:ää (vaatii koodin muutokset).

**Ilmainen tier:**

- ✅ 512 MB
- ✅ Shared cluster
- ✅ Ei luottokorttia

### 1. Luo MongoDB Atlas -tietokanta

1. Mene: https://www.mongodb.com/cloud/atlas
2. **"Try Free"** → Kirjaudu
3. Luo ilmainen cluster:
   - **Cloud Provider:** AWS
   - **Region:** Frankfurt (eu-central-1)
   - **Cluster Tier:** M0 Sandbox (FREE)
4. Luo käyttäjä ja salasana
5. Salli yhteydet kaikista IP-osoitteista (0.0.0.0/0)

### 2. Backend-muutokset

**Asenna Mongoose:**

```bash
cd backend
npm install mongoose
```

**Muuta db.js:**

```javascript
const mongoose = require("mongoose");

if (process.env.MONGODB_CONNECTION_STRING) {
  mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

  const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    review: String,
    image_path: String,
    created_at: { type: Date, default: Date.now },
  });

  const Book = mongoose.model("Book", bookSchema);
}
```

**Connection string:**

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lukupaivakirja?retryWrites=true&w=majority
```

---

## Kustannusvertailu

| Palvelu       | Ilmainen tier  | Maksullinen      | Rajoitukset              |
| ------------- | -------------- | ---------------- | ------------------------ |
| **Supabase**  | 500 MB         | $25/kk (8 GB)    | 50k aktiivista käyttäjää |
| **Neon**      | 512 MB         | $19/kk (10 GB)   | 1 projekti               |
| **Railway**   | $5 kredit/kk   | $5/kk per GB     | ~40-50h/kk ilmaiseksi    |
| **MongoDB**   | 512 MB         | $57/kk (2 GB)    | Shared cluster           |
| **Azure SQL** | ❌ EI ILMAISTA | €4.20/kk (Basic) | Azure-sidottu            |

**Suositus:** Aloita Supabasella - paras ilmainen tier!

---

## Testaa ennen julkaisua

### 1. Testaa paikallisesti

```bash
cd backend

# Luo .env
echo 'NODE_ENV=production' > .env
echo 'POSTGRESQL_CONNECTION_STRING=postgresql://...' >> .env

# Käynnistä
npm start

# Toisessa terminaalissa:
curl http://localhost:3001/books
```

### 2. Testaa että taulut luodaan

Avaa Supabase Dashboard:

1. Mene Supabase-projektiisi
2. Klikkaa **"Table Editor"** (vasemmalla)
3. Pitäisi näkyä **"books"**-taulu seuraavilla sarakkeilla:
   - id
   - title
   - author
   - review
   - image_path
   - created_at

### 3. Testaa lisäämällä kirja

```bash
curl -X POST http://localhost:3001/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Testi Kirja",
    "author": "Testi Kirjailija",
    "review": "Hyvä kirja!"
  }'
```

Tarkista Supabase Table Editorista - kirja pitäisi näkyä!

---

## Julkaise Azureen

### 1. Lisää ympäristömuuttuja

```bash
az webapp config appsettings set \
  --name lukupaivakirja-backend \
  --resource-group lukupaivakirja-rg \
  --settings \
    NODE_ENV=production \
    POSTGRESQL_CONNECTION_STRING="postgresql://postgres:SALASANA@db.xxxxx.supabase.co:5432/postgres"
```

### 2. Julkaise uudelleen (jos tarpeen)

```bash
cd backend
zip -r deploy.zip .

az webapp deployment source config-zip \
  --resource-group lukupaivakirja-rg \
  --name lukupaivakirja-backend \
  --src deploy.zip
```

### 3. Tarkista lokit

```bash
az webapp log tail \
  --name lukupaivakirja-backend \
  --resource-group lukupaivakirja-rg
```

Pitäisi näkyä:

```
Using cloud database (Azure SQL/PostgreSQL)
Database connection established successfully
```

---

## Vianmääritys

### "Connection timeout"

**Ratkaisu:** Tarkista että connection string on oikein.

```bash
# Testaa yhteyttä
psql "postgresql://postgres:SALASANA@db.xxxxx.supabase.co:5432/postgres"
```

### "SSL connection required"

**Ratkaisu:** Varmista että connection stringissä on `?sslmode=require` tai backend-koodi sallii SSL:n.

Backend tukee jo SSL:ää:

```javascript
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
}
```

### "Authentication failed"

**Ratkaisu:**

1. Tarkista salasana
2. Jos salasanassa on erikoismerkkejä (@, #, %, jne.), ne pitää URL-enkoodata:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`

Esimerkki:

```
# Alkuperäinen salasana: P@ssw0rd#123
# URL-enkoodattu: P%40ssw0rd%23123
postgresql://postgres:P%40ssw0rd%23123@db.xxxxx.supabase.co:5432/postgres
```

### "Table doesn't exist"

**Ei hätää!** Sequelize luo taulut automaattisesti ensimmäisellä käynnistyskerralla:

```javascript
await sequelize.sync(); // Luo taulut jos ne eivät ole olemassa
```

---

## Varmuuskopiointi

### Supabase automaattiset varmuuskopiot

Ilmainen tier:

- ✅ Päivittäiset varmuuskopiot (7 päivää)
- ✅ Point-in-time recovery (7 päivää)

**Palauta varmuuskopiosta:**

1. Supabase Dashboard → **Database** → **Backups**
2. Valitse varmuuskopiopäivämäärä
3. Klikkaa **"Restore"**

### Manuaalinen varmuuskopiointi

```bash
# Vie koko tietokanta
pg_dump "postgresql://postgres:SALASANA@db.xxxxx.supabase.co:5432/postgres" > backup.sql

# Tuo takaisin
psql "postgresql://postgres:SALASANA@db.xxxxx.supabase.co:5432/postgres" < backup.sql

# Vie vain books-taulu
pg_dump -t books "postgresql://..." > books_backup.sql
```

---

## Monitorointi

### Supabase Dashboard

1. **Database → Usage:** Näyttää tietokantakoon ja kyselyjen määrän
2. **Logs → Postgres Logs:** Näyttää SQL-kyselyt ja virheet
3. **Database → Table Editor:** Selaa ja muokkaa dataa

### Azure Application Insights

Voit edelleen käyttää Application Insightsia backendin monitorointiin:

```bash
az webapp log tail \
  --name lukupaivakirja-backend \
  --resource-group lukupaivakirja-rg
```

---

## Migraatio SQLite:stä

Jos sinulla on jo dataa SQLite-tietokannassa:

```bash
# 1. Vie SQLite JSON-muotoon
sqlite3 lukupaivakirja.db << 'EOF'
.mode json
.output books.json
SELECT * FROM books;
.quit
EOF

# 2. Käynnistä backend Supabase-yhteydellä
NODE_ENV=production POSTGRESQL_CONNECTION_STRING="postgresql://..." npm start

# 3. Tuo data (käytä REST API:a)
cat books.json | jq -c '.[]' | while read book; do
  curl -X POST http://localhost:3001/books \
    -H "Content-Type: application/json" \
    -d "$book"
done
```

---

## Yhteenveto

### Asennusvaiheet:

1. ✅ **Luo Supabase-projekti** (2 minuuttia)
2. ✅ **Kopioi connection string**
3. ✅ **Testaa paikallisesti** (.env tiedostolla)
4. ✅ **Lisää Azure App Serviceen** (ympäristömuuttuja)
5. ✅ **Julkaise ja testaa**

### Miksi Supabase?

- ✅ **Täysin ilmainen** pienille sovelluksille
- ✅ **Ei luottokorttia** tarvita
- ✅ **PostgreSQL** jota backend jo tukee
- ✅ **Automaattiset varmuuskopiot**
- ✅ **Helppo käyttää** (web-pohjainen UI)
- ✅ **Hyvä ilmainen tier** (500 MB)
- ✅ **EU-serveri** (GDPR-yhteensopiva)

### Kaikki toimii automaattisesti:

- ✅ Backend tunnistaa `POSTGRESQL_CONNECTION_STRING` ympäristömuuttujan
- ✅ Sequelize luo taulut automaattisesti
- ✅ SQLite toimii edelleen paikallisessa kehityksessä
- ✅ Supabase toimii tuotannossa Azuressa

**Ei tarvitse muuttaa koodia - vain lisää ympäristömuuttuja!**

---

## Lisätietoa

- **Supabase Docs:** https://supabase.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Railway Docs:** https://docs.railway.app
- **Sequelize PostgreSQL:** https://sequelize.org/docs/v6/other-topics/dialect-specific-things/#postgresql

🎉 **Nyt voit käyttää ilmaista tietokantaa ilman Azure-maksujen huolta!**
