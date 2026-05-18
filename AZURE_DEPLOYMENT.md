# Azure Deployment Guide - Lukupäiväkirja

Tämä opas auttaa sinua julkaisemaan Lukupäiväkirja-sovelluksen Azure-pilvipalveluun.

## ⚠️ TÄRKEÄÄ: Tietokanta on pakollinen!

**SQLite EI toimi tuotannossa Azuressa!** Lue [AZURE_DATABASE.md](AZURE_DATABASE.md) ja luo ensin tietokanta.

Ilman Azure-tietokantaa:
- ❌ Kaikki kirjat katoavat jokaisessa uudelleenkäynnistyksessä
- ❌ Sovellus ei skaalaudu
- ❌ Ei varmuuskopiointeja

**Suositus:** Luo Azure SQL Database (€4.20/kk) ennen deploymenttia.

## Vaihtoehto 1: Azure Portal (Helpoin aloittelijoille)

### 1. Luo Azure-tili

1. Mene osoitteeseen https://azure.microsoft.com
2. Luo ilmainen tili (saat $200 krediittejä 30 päiväksi)

### 2. Luo App Service Backend-sovellukselle

1. Kirjaudu [Azure Portal](https://portal.azure.com)
2. Klikkaa "+ Create a resource"
3. Etsi "Web App" ja valitse se
4. Täytä tiedot:
   - **Subscription**: Valitse tilauksesi
   - **Resource Group**: Luo uusi "lukupaivakirja-rg"
   - **Name**: "lukupaivakirja-backend" (tämä tulee osaksi URL:ia)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: North Europe
   - **Pricing Plan**: Basic B1 (tai Free F1 testaukseen)
5. Klikkaa "Review + Create" ja sitten "Create"

### 3. Luo App Service Frontend-sovellukselle

Toista samat vaiheet:

- **Name**: "lukupaivakirja-frontend"
- Muut asetukset samat kuin backendillä

### 4. Määritä ympäristömuuttujat

**Backend App Service:**

1. Avaa luomasi backend App Service
2. Mene "Configuration" → "Application settings"
3. Lisää uusi asetus:
   - Name: `PORT`
   - Value: `8080`
4. Tallenna

**Frontend App Service:**

1. Avaa frontend App Service
2. Mene "Configuration" → "Application settings"
3. Lisää uusi asetus:
   - Name: `REACT_APP_API_URL`
   - Value: `https://lukupaivakirja-backend.azurewebsites.net`
4. Tallenna

### 5. Julkaise sovellukset

**Vaihtoehto A: VS Code (suositeltu)**

1. Asenna "Azure App Service" -laajennus VS Codeen
2. Kirjaudu Azure-tilillesi
3. Klikkaa Azure-kuvaketta vasemmassa palkissa
4. Etsi luomasi App Servicet
5. **Backend:**
   - Oikea klikkaa "lukupaivakirja-backend" → "Deploy to Web App"
   - Valitse `backend` -kansio
   - Vahvista deployment
6. **Frontend:**
   - Ensin buildi frontend: `cd frontend && npm run build`
   - Oikea klikkaa "lukupaivakirja-frontend" → "Deploy to Web App"
   - Valitse `frontend/build` -kansio
   - Vahvista deployment

**Vaihtoehto B: Azure CLI**

\`\`\`bash

# Backend

cd backend
zip -r deploy.zip .
az webapp deployment source config-zip \\
--resource-group lukupaivakirja-rg \\
--name lukupaivakirja-backend \\
--src deploy.zip

# Frontend

cd ../frontend
npm run build
cd build
zip -r deploy.zip .
az webapp deployment source config-zip \\
--resource-group lukupaivakirja-rg \\
--name lukupaivakirja-frontend \\
--src deploy.zip
\`\`\`

### 6. Testaa sovellus

Avaa selaimessa: `https://lukupaivakirja-frontend.azurewebsites.net`

## Vaihtoehto 2: Azure Static Web Apps + Azure Functions

Modernimpi ja potentiaalisesti halvempi ratkaisu:

### 1. Luo Static Web App

\`\`\`bash

# Asenna Azure Static Web Apps CLI

npm install -g @azure/static-web-apps-cli

# Luo Static Web App

az staticwebapp create \\
--name lukupaivakirja \\
--resource-group lukupaivakirja-rg \\
--source https://github.com/YOURNAME/lukupaivakirja \\
--location "West Europe" \\
--branch main \\
--app-location "frontend" \\
--output-location "build"
\`\`\`

## Vaihtoehto 3: Azure Container Apps

Jos haluat käyttää Dockeria:

### 1. Luo Dockerfile backend-sovellukselle

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package\*.json ./
RUN npm ci --production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
\`\`\`

### 2. Buildi ja julkaise

\`\`\`bash

# Kirjaudu Azure Container Registry

az acr create --resource-group lukupaivakirja-rg \\
--name lukupaivakirjaregistry --sku Basic

# Buildi ja pushaa image

az acr build --registry lukupaivakirjaregistry \\
--image lukupaivakirja-backend:latest ./backend

# Luo Container App

az containerapp create \\
--name lukupaivakirja-backend \\
--resource-group lukupaivakirja-rg \\
--image lukupaivakirjaregistry.azurecr.io/lukupaivakirja-backend:latest \\
--target-port 8080 \\
--ingress external
\`\`\`

## Kustannusarvio (euroissa/kk)

| Vaihtoehto      | Hinta   | Soveltuu                |
| --------------- | ------- | ----------------------- |
| Free Tier (F1)  | €0      | Testaus, kehitys        |
| Basic B1        | ~€12-15 | Pieni tuotantokäyttö    |
| Standard S1     | ~€56-70 | Keskisuuri tuotanto     |
| Static Web Apps | €0-9    | Moderni JAMstack        |
| Container Apps  | ~€0-20  | Skaalautuva containerit |

## Tietoturva ja parannukset

### 1. Custom Domain ja SSL

\`\`\`bash

# Lisää custom domain

az webapp config hostname add \\
--webapp-name lukupaivakirja-frontend \\
--resource-group lukupaivakirja-rg \\
--hostname www.sinun-domain.fi

# SSL-sertifikaatti (ilmainen)

az webapp config ssl bind \\
--certificate-thumbprint <thumbprint> \\
--ssl-type SNI \\
--name lukupaivakirja-frontend \\
--resource-group lukupaivakirja-rg
\`\`\`

### 2. Azure Blob Storage kuviile

Korvaa lokaalitiedostotallennus Blob Storagella:

\`\`\`bash

# Luo Storage Account

az storage account create \\
--name lukupaivakirjastorage \\
--resource-group lukupaivakirja-rg \\
--location northeurope \\
--sku Standard_LRS

# Luo container

az storage container create \\
--name book-images \\
--account-name lukupaivakirjastorage \\
--public-access blob
\`\`\`

### 3. Azure SQL Database

Korvaa SQLite tuotantotietokannalla:

\`\`\`bash

# Luo SQL Server

az sql server create \\
--name lukupaivakirja-sql \\
--resource-group lukupaivakirja-rg \\
--location northeurope \\
--admin-user sqladmin \\
--admin-password 'SecurePassword123!'

# Luo tietokanta

az sql db create \\
--resource-group lukupaivakirja-rg \\
--server lukupaivakirja-sql \\
--name lukupaivakirjadb \\
--service-objective Basic
\`\`\`

## Seuranta ja lokitus

### Application Insights

\`\`\`bash

# Luo Application Insights

az monitor app-insights component create \\
--app lukupaivakirja-insights \\
--location northeurope \\
--resource-group lukupaivakirja-rg

# Liitä App Serviceen

az webapp config appsettings set \\
--name lukupaivakirja-backend \\
--resource-group lukupaivakirja-rg \\
--settings APPLICATIONINSIGHTS_CONNECTION_STRING="<connection-string>"
\`\`\`

## Vianetsintä

### Backend ei vastaa

1. Tarkista App Service logs: Portal → App Service → Log stream
2. Varmista että PORT-muuttuja on asetettu 8080:ksi
3. Tarkista CORS-asetukset

### Frontend ei löydä backendia

1. Tarkista että REACT_APP_API_URL on oikein
2. Buildata frontend uudelleen ympäristömuuttujan muuttamisen jälkeen
3. Tarkista CORS-asetukset backendissä

### Kuvat eivät lataudu

1. Azure App Service pyyhkii tiedostot uudelleenkäynnistyksen yhteydessä
2. Käytä Azure Blob Storagea pysyväistallenukseen
3. Tai käytä App Servicen persistent storage -ominaisuutta

## Lisäresurssit

- [Azure App Service dokumentaatio](https://docs.microsoft.com/azure/app-service/)
- [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Blob Storage](https://docs.microsoft.com/azure/storage/blobs/)
- [Azure SQL Database](https://docs.microsoft.com/azure/azure-sql/)
