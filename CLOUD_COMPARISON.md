# ☁️ Cloud Provider Vertailu - Lukupäiväkirja

Tämä dokumentti auttaa sinua valitsemaan parhaan pilvipalvelun sovelluksellesi.

## 🏆 Suositus: **Render**

### Miksi Render voittaa?

| Kriteeri                | Render               | Azure                      | Railway              | Heroku           | Fly.io             |
| ----------------------- | -------------------- | -------------------------- | -------------------- | ---------------- | ------------------ |
| **Ilmainen tier**       | ✅ Erinomainen       | ⚠️ Rajoitettu              | ✅ Hyvä              | ⚠️ Rajoitettu    | ✅ Hyvä            |
| **Luottokortti**        | ❌ Ei vaadita        | ✅ Vaaditaan               | ❌ Ei vaadita        | ✅ Vaaditaan     | ✅ Vaaditaan       |
| **Setup-vaikeus**       | ⭐ Helppo            | ⭐⭐⭐⭐⭐ Erittäin vaikea | ⭐⭐ Kohtalainen     | ⭐⭐ Kohtalainen | ⭐⭐⭐ Vaikea      |
| **Setup-aika**          | 20 min               | 2-4 tuntia                 | 30 min               | 30 min           | 1 tunti            |
| **Auto-deploy**         | ✅ GitLab/GitHub     | ⚠️ Vaatii setuppia         | ✅ GitHub            | ✅ GitHub        | ⚠️ Vaatii setuppia |
| **PostgreSQL**          | ✅ Ilmainen 90 pv    | € Maksullinen              | ✅ Ilmainen 5GB      | € Maksullinen    | € Maksullinen      |
| **Suomi-dokumentaatio** | ⚠️ Englanti          | ✅ Osittain                | ⚠️ Englanti          | ⚠️ Englanti      | ⚠️ Englanti        |
| **Backend + Frontend**  | ✅ Molemmat ilmaisia | € ~€10/kk                  | ✅ Molemmat ilmaisia | € ~€14/kk        | ✅ Kohtalainen     |
| **HTTPS**               | ✅ Automaattinen     | ✅ Automaattinen           | ✅ Automaattinen     | ✅ Automaattinen | ✅ Automaattinen   |
| **Rajoitukset (free)**  | Nukkuu 15 min        | Vähän RAM/CPU              | Ei nukahda           | -                | 3 GB muistia       |

## 📊 Yksityiskohtainen vertailu

### 🥇 Render (SUOSITELTU)

**Plussat:**

- ✅ Täysin ilmainen aloittamiseen (ei luottokorttia)
- ✅ Helppokäyttöinen dashboard
- ✅ PostgreSQL ilmainen 90 päivää
- ✅ Automaattinen deployment GitLabista/GitHubista
- ✅ Static site frontendille (ilmainen)
- ✅ Web service backendille (ilmainen)
- ✅ HTTPS automaattisesti
- ✅ Ympäristömuuttujat helppo hallita

**Miinukset:**

- ⚠️ Backend nukkuu 15 min inaktiivisuuden jälkeen (herää 30s)
- ⚠️ PostgreSQL ilmainen vain 90 päivää (voi luoda uuden sen jälkeen)
- ⚠️ Rajoitettu RAM/CPU (512 MB RAM)

**Soveltuu:**

- ✅ Opiskelijaprojektit
- ✅ Portfoliot
- ✅ Prototyypit
- ✅ Pienet henkilökohtaiset sovellukset
- ✅ Demo-sovellukset

**Hinta:**

- Free: €0/kk (backend + frontend + PostgreSQL)
- Starter: €7/kk (ei nukahda, enemmän tehoa)

**Dokumentaatio:** [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

---

### 🥈 Azure (Vaihtoehtoinen)

**Plussat:**

- ✅ Suomalaisten yritysten käyttämä (ammattikäyttö)
- ✅ Paljon lisäpalveluita (AI, ML, IoT jne.)
- ✅ Hyvä dokumentaatio
- ✅ Integration Visual Studioon
- ✅ Kattava ilmainen tier opiskelijoille ($100 krediittiä)

**Miinukset:**

- ❌ Monimutkainen setup (Resource Groups, App Services, jne.)
- ❌ Vaatii luottokortin
- ❌ Kallista ilman opiskelijakorttia
- ❌ Tietokanta kallis (Basic €4.20/kk)
- ❌ PALJON konfiguraatiota

**Soveltuu:**

- ✅ Ammattikäyttö
- ✅ Yrityssovellukset
- ✅ Skaalautuvat sovellukset
- ⚠️ Ei suositus opiskelijaprojekteille (liian monimutkainen)

**Hinta:**

- Basic tier: ~€10-15/kk (App Service + SQL Database)
- Opiskelijat: $100 ilmaista krediittiä

**Dokumentaatio:** [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)

---

### 🥉 Railway

**Plussat:**

- ✅ Ei vaadi luottokorttia (ilmainen tier)
- ✅ Helppokäyttöinen
- ✅ Automaattinen deployment
- ✅ PostgreSQL ilmainen (5GB)
- ✅ Backend ei nukahda ilmaisessa tierissä

**Miinukset:**

- ⚠️ Ilmainen tier: 500 tuntia/kk ($5 krediittiä)
- ⚠️ Ei static site -tukea (frontend tarvitsee web servicen)

**Soveltuu:**

- ✅ Pienet projektit
- ✅ Backend + full-stack sovellukset

**Hinta:**

- Free: $5 krediittiä/kk (riittää pienille projekteille)
- Hobby: $5/kk + usage

**Linkki:** https://railway.app

---

### Heroku

**Plussat:**

- ✅ Tunnettu ja vakaa
- ✅ Hyvä dokumentaatio

**Miinukset:**

- ❌ EI ENÄÄ ILMAISTA TIERIÄ (lopetettiin 2022)
- ❌ Vaaditaan maksullinen tier ($7/kk minimissään)

**Hinta:**

- Eco: $5/kk per dyno
- Basic: $7/kk per dyno
- PostgreSQL: $5/kk

**Linkki:** https://heroku.com

❌ **Ei suositus ilmaiseen käyttöön**

---

### Fly.io

**Plussat:**

- ✅ Hyvä ilmainen tier
- ✅ Nopea maailmanlaajuinen verkosto
- ✅ Hyvä PostgreSQL-tuki

**Miinukset:**

- ⚠️ Vaatii luottokortin
- ⚠️ Vaatii Dockerfile-osaamista
- ⚠️ Monimutkaisempi konfiguraatio

**Soveltuu:**

- ✅ Globaalit sovellukset
- ✅ Kehittyneet käyttäjät

**Hinta:**

- Free: 3 GB RAM yhteensä
- Pay-as-you-go sen jälkeen

**Linkki:** https://fly.io

---

## 🎯 Suositukset käyttötarkoituksen mukaan

### Opiskelijaprojekti / Portfolio

→ **Render** (ilmainen, helppo, ei luottokorttia)

### Lyhytaikainen demo (< 90 päivää)

→ **Render** (PostgreSQL ilmainen 90 päivää)

### Pitkäaikainen henkilökohtainen projekti

→ **Railway** (ei nukahda, jatkuva ilmainen tier)

### Ammattikäyttö / Yrityssovellus

→ **Azure** (kattavat palvelut, ammattituki)

### Prototyyppi päätöksentekijöille

→ **Render** (nopea setup, ei nukahda maksullisella tierillä)

---

## ⚡ Quick Start Guides

1. **Render (SUOSITELTU):** [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
2. **Azure:** [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)

---

## 🤔 Kysymyksiä?

### "Mikä on halvin?"

- **Ilmainen:** Render tai Railway
- **Pitkällä aikavälillä:** Railway ($5/kk) tai Render Starter ($7/kk)

### "Mikä on helpoin?"

- **Render** - selkeästi helpoin, vain 20 minuuttia setupiin

### "Mikä on paras opiskelijalle?"

- **Render** - ei vaadi luottokorttia, täysin ilmainen aloittamiseen

### "Mikä on paras CV:seen?"

- **Azure** - tunnettu yrityskäytössä, hyvä osaaminen työnhaussa

### "Mikä on paras tuotantokäyttöön?"

- **Azure** tai **Render Starter** ($7/kk) - ei nukahda, vakaa

---

## 📊 Yhteenveto

| Valitse     | Jos haluat                               |
| ----------- | ---------------------------------------- |
| **Render**  | Helppous, ilmainen, nopea setup          |
| **Azure**   | Ammattikäyttö, paljon palveluita, CV:hen |
| **Railway** | Backend joka ei nukahda ilmaiseksi       |
| **Fly.io**  | Globaali sovellus, edistynyt             |
| **Heroku**  | ❌ Ei suositus (ei ilmaista)             |

---

## 🎓 Oppimisen näkökulmasta

1. **Aloita Renderillä** → opi deployment-perusteet
2. **Kokeile Azurea** → opi enterprise-tason pilvipalveluita
3. **Vertaile Railway/Fly.io** → opi eri arkkitehtuureja

Render on paras valinta aloittamiseen! 🚀
