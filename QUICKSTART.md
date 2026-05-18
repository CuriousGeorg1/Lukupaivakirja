# Pikalähtöohje - Lukupäiväkirja

## Paikallinen kehitysympäristö (5 minuuttia)

### Vaihtoehto 1: Automaattinen asennus

**macOS/Linux:**
\`\`\`bash
chmod +x install.sh
./install.sh
\`\`\`

**Windows:**
\`\`\`cmd
install.bat
\`\`\`

### Vaihtoehto 2: Manuaalinen asennus

1. **Asenna riippuvuudet:**
   \`\`\`bash

# Backend

cd backend
npm install

# Frontend

cd ../frontend
npm install
\`\`\`

2. **Käynnistä sovellukset:**

**Terminaali 1 - Backend:**
\`\`\`bash
cd backend
npm start
\`\`\`

**Terminaali 2 - Frontend:**
\`\`\`bash
cd frontend
npm start
\`\`\`

3. **Avaa selaimessa:** http://localhost:3000

## Testidataa

Sovellus on tyhjä alussa. Lisää ensimmäinen kirjasi:

**Esimerkki 1:**

- Nimi: Tuntematon sotilas
- Kirjailija: Väinö Linna
- Arvio: Suomalaisen sotakirjallisuuden klassikko
- Kuva: (lataa kirjan kansikuva)

**Esimerkki 2:**

- Nimi: Seitsemän veljestä
- Kirjailija: Aleksis Kivi
- Arvio: Ensimmäinen suomenkielinen romaani
- Kuva: (lataa kirjan kansikuva)

## Nopea Azure-julkaisu

**⚠️ ENSIN: Luo Azure-tietokanta!** SQLite ei toimi tuotannossa.

📘 **Lue pakollisena:** [AZURE_DATABASE.md](AZURE_DATABASE.md)

Katso yksityiskohtaiset deployment-ohjeet: [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)

**Nopein tapa:**

1. Luo Azure-tili: https://azure.microsoft.com
2. Asenna VS Code -laajennus: "Azure App Service"
3. Kirjaudu Azure-tilillesi VS Codessa
4. Luo kaksi Web App -instanssia Azure Portalissa
5. Deploy käyttäen VS Code -laajennusta

## Tuki

Katso täydellinen dokumentaatio: [README.md](README.md)
