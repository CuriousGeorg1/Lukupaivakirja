# 🚀 Render Deployment - Quick Checklist

## ✅ Ennen deploymenttia

- [x] Koodi GitLabissa (gmwahl/lukupaivakirja)
- [x] Backend käyttää PORT-ympäristömuuttujaa ✓
- [x] Frontend käyttää REACT_APP_API_URL ✓
- [x] CORS päällä backendissä ✓

Kaikki valmista! Seuraa vain [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) ohjeita.

## 📋 Deployment-järjestys

1. **Luo Render-tili** (5 min)
   - https://render.com → "Get Started for Free"

2. **Luo PostgreSQL-tietokanta** (2 min)
   - New + → PostgreSQL
   - Valitse FREE tier
   - Kopioi "Internal Database URL"

3. **Luo Backend** (5 min)
   - New + → Web Service
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Lisää env: `DATABASE_URL=<postgres-url>`
   - FREE tier

4. **Luo Frontend** (5 min)
   - New + → Static Site
   - Root Directory: `frontend`
   - Build: `npm install && npm run build`
   - Publish: `build`
   - Lisää env: `REACT_APP_API_URL=https://lukupaivakirja-backend.onrender.com`
   - FREE tier

5. **Testaa** (2 min)
   - Avaa frontend URL
   - Lisää kirja
   - Päivitä sivu → kirja näkyy yhä!

## 🎉 Valmis!

Yhteensä ~20 minuuttia, täysin ilmainen, automaattinen deployment GitLabista!

## 💡 Vinkit

- Backend herää ~30s ensimmäisestä pyynnöstä (ilmainen tier)
- PostgreSQL ilmainen 90 päivää → luo uusi sen jälkeen
- Joka push GitLabiin → automaattinen deployment!

## 🆚 Render vs Azure

| Ominaisuus    | Render           | Azure              |
| ------------- | ---------------- | ------------------ |
| Ilmainen tier | ✅ Kyllä         | ⚠️ Rajoitettu      |
| Luottokortti  | ❌ Ei vaadita    | ✅ Vaaditaan       |
| Setup-aika    | 20 min           | 2-4 tuntia         |
| Auto-deploy   | ✅ GitLab/GitHub | ⚠️ Vaatii setuppia |
| Vaikeus       | ⭐ Helppo        | ⭐⭐⭐⭐⭐ Vaikea  |

**Suositus**: Käytä Renderiä!
