# Render Deployment Guide - Lukupäiväkirja

Tämä opas auttaa sinua julkaisemaan Lukupäiväkirja-sovelluksen Render-pilvipalveluun. **Render on paljon helpompi kuin Azure!**

## ✅ Miksi Render?

- ✅ **Ilmainen tier** (ei luottokorttia vaadita)
- ✅ **Automaattinen deployment** GitLabista/GitHubista
- ✅ **Ilmainen PostgreSQL-tietokanta**
- ✅ **Yksinkertainen konfiguraatio**
- ✅ **HTTPS automaattisesti**

## 📖 Vaihe 1: Valmistele projekti

### 1.1 Lisää build script frontendiin

Frontend tarvitsee skriptin joka rakentaa tuotantoversion:

```json
// frontend/package.json sisältää jo tämän, joten ei toimenpiteitä!
"scripts": {
  "build": "react-scripts build"
}
```

### 1.2 Tarkista backend konfiguraatio

Backend on jo valmis! Se käyttää `PORT` ympäristömuuttujaa jota Render tarjoaa.

## 📖 Vaihe 2: Luo Render-tili

1. Mene osoitteeseen https://render.com
2. Klikkaa "Get Started for Free"
3. Rekisteröidy GitLab- tai GitHub-tilillä (suositus) tai sähköpostilla
4. Vahvista sähköpostiosoitteesi

## 📖 Vaihe 3: Yhdistä GitLab-repo

1. Kirjaudu Render Dashboard: https://dashboard.render.com
2. Jos käytit GitLabia rekisteröityessä, repo näkyy automaattisesti
3. Jos et, klikkaa "New +" → "Blueprint" tai "Web Service" ja yhdistä GitLab

## 📖 Vaihe 4: Luo PostgreSQL-tietokanta (ILMAINEN)

1. Render Dashboardissa klikkaa "New +" → "PostgreSQL"
2. Täytä tiedot:
   - **Name**: `lukupaivakirja-db`
   - **Database**: `lukupaivakirja`
   - **User**: `lukupaivakirja` (tai auto-generated)
   - **Region**: Frankfurt (lähinnä Suomea)
   - **Instance Type**: **Free** (valitse tämä!)
3. Klikkaa "Create Database"
4. **Tärkeää**: Kopioi talteen **Internal Database URL** (näkyy tietokannan sivulla)
   - Muodossa: `postgresql://user:password@host/database`

⚠️ **Huom**: Ilmainen PostgreSQL-tietokanta on rajoitettu (90 päivää), mutta voit luoda uuden ilmaisen tietokannan sen jälkeen.

## 📖 Vaihe 5: Julkaise Backend

### 5.1 Luo Backend Web Service

1. Render Dashboardissa klikkaa "New +" → "Web Service"
2. Valitse repositorysi (`gmwahl/lukupaivakirja`)
3. Täytä tiedot:
   - **Name**: `lukupaivakirja-backend`
   - **Region**: Frankfurt
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**

### 5.2 Lisää ympäristömuuttujat

Klikkaa "Advanced" ja lisää seuraavat ympäristömuuttujat:

```
DATABASE_URL=postgresql://user:password@host/database
NODE_ENV=production
```

(Kopioi `DATABASE_URL` vaiheesta 4)

4. Klikkaa "Create Web Service"

Render alkaa rakentaa ja julkaista backendiä. Tämä kestää ~2-5 minuuttia.

## 📖 Vaihe 6: Julkaise Frontend

### 6.1 Luo Frontend Static Site

1. Render Dashboardissa klikkaa "New +" → "Static Site"
2. Valitse sama repository
3. Täytä tiedot:
   - **Name**: `lukupaivakirja-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### 6.2 Lisää ympäristömuuttuja

Klikkaa "Advanced" ja lisää:

```
REACT_APP_API_URL=https://lukupaivakirja-backend.onrender.com
```

(Vaihda URL backendin todelliseen URL:iin, jonka näet backend-servicen dashboardissa)

4. Klikkaa "Create Static Site"

## 📖 Vaihe 7: Päivitä Frontend konfiguraatio

Frontend tarvitsee päivityksen jotta se käyttää Render-backendia. Päivitä `frontend/src/App.js`:

```javascript
// Lisää tiedoston alkuun:
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// Päivitä kaikki fetch-kutsut käyttämään API_URL:
// Esimerkki:
fetch(`${API_URL}/api/books`)
  .then((res) => res.json())
  .then((data) => setBooks(data));
```

Committoi muutokset ja pushaa GitLabiin. Render julkaisee automaattisesti päivitetyn version!

## 📖 Vaihe 8: Testaa sovellus

1. Avaa frontendisi URL (esim. `https://lukupaivakirja-frontend.onrender.com`)
2. Lisää kirja testiksi
3. Tarkista että kirja tallentuu ja näkyy listassa
4. Päivitä sivu → kirjan pitäisi yhä näkyä (PostgreSQL toimii!)

## ⚙️ Automaattinen deployment

Kun pushaat muutoksia GitLabiin `main`-branchiin, Render julkaisee automaattisesti uuden version!

```bash
git add .
git commit -m "Update books feature"
git push origin main
```

## 🐛 Ongelmanratkaisu

### Backend ei käynnisty

1. Tarkista lokit: Backend Dashboard → "Logs"
2. Varmista että `DATABASE_URL` on asetettu oikein
3. Tarkista että `package.json` sisältää kaikki riippuvuudet

### Frontend ei näytä tietoja

1. Tarkista että `REACT_APP_API_URL` on oikein
2. Avaa selaimen konsoli (F12) ja katso virheet
3. Varmista että backend on päällä (avaa backend URL selaimessa)

### "Service Unavailable" virhe

Ilmainen Render-backend nukkuu 15 minuutin toimettomuuden jälkeen. Ensimmäinen pyyntö herättää sen (kestää ~30s).

## 💰 Kustannukset

- **Backend**: ILMAINEN (rajoituksella: nukkuu 15 min jälkeen)
- **Frontend**: ILMAINEN
- **PostgreSQL**: ILMAINEN 90 päivää
- **Yhteensä**: €0/kk

### Päivitys maksulliseen (jos tarvitset):

- **Backend**: €7/kk (ei nuku, enemmän tehoa)
- **PostgreSQL**: €7/kk (jatkuva)

## 📚 Hyödylliset linkit

- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs
- GitLab Repo: https://gitlab.utu.fi/gmwahl/lukupaivakirja

## 🎉 Valmista!

Sovelluksesi on nyt julkaistu osoitteessa:

- Frontend: `https://lukupaivakirja-frontend.onrender.com`
- Backend: `https://lukupaivakirja-backend.onrender.com`

Jaa URL ystävillesi!
