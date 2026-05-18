# Azure Tietokannan Asennus - Lukupäiväkirja

**TÄRKEÄÄ:** SQLite ei toimi tuotannossa Azureen! Tiedot katoavat jokaisessa uudelleenkäynnistyksessä. Tämä opas auttaa sinua luomaan oikean tietokannan.

## Miksi Azure-tietokanta on pakollinen?

❌ **SQLite-ongelmat Azuressa:**

- App Service pyyhkii tiedostot uudelleenkäynnistyksen yhteydessä
- Kaikki kirjat ja kuvat katoavat
- Ei skaalaudu useisiin instansseihin
- Ei varmuuskopiointia

✅ **Azure-tietokannan edut:**

- Pysyvä tallennustila
- Automaattiset varmuuskopiot
- Skaalautuvuus
- Korkea saatavuus

## Vaihtoehto 1: Azure SQL Database (Suositeltu)

### 1. Luo Azure SQL Database

```bash
# Luo SQL Server
az sql server create \
  --name lukupaivakirja-sql \
  --resource-group lukupaivakirja-rg \
  --location northeurope \
  --admin-user sqladmin \
  --admin-password 'YourStrongPassword123!'

# Salli Azure-palvelut
az sql server firewall-rule create \
  --resource-group lukupaivakirja-rg \
  --server lukupaivakirja-sql \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Luo tietokanta
az sql db create \
  --resource-group lukupaivakirja-rg \
  --server lukupaivakirja-sql \
  --name lukupaivakirja \
  --service-objective Basic \
  --backup-storage-redundancy Local
```

### 2. Hae Connection String

```bash
az sql db show-connection-string \
  --client ado.net \
  --name lukupaivakirja \
  --server lukupaivakirja-sql
```

Tulos näyttää tältä:

```
Server=tcp:lukupaivakirja-sql.database.windows.net,1433;Database=lukupaivakirja;User ID=sqladmin;Password=YourStrongPassword123!;Encrypt=true;Connection Timeout=30;
```

### 3. Muuta Sequelize-yhteensopivaksi

```
mssql://sqladmin:YourStrongPassword123!@lukupaivakirja-sql.database.windows.net:1433/lukupaivakirja?encrypt=true
```

### 4. Lisää App Serviceen

**Azure Portal:**

1. Avaa App Service → Configuration → Application settings
2. Lisää uusi asetus:
   - Name: `AZURE_SQL_CONNECTION_STRING`
   - Value: `mssql://sqladmin:YourStrongPassword123!@lukupaivakirja-sql.database.windows.net:1433/lukupaivakirja?encrypt=true`
3. Lisää toinen asetus:
   - Name: `NODE_ENV`
   - Value: `production`
4. Tallenna ja käynnistä uudelleen

**Azure CLI:**

```bash
az webapp config appsettings set \
  --name lukupaivakirja-backend \
  --resource-group lukupaivakirja-rg \
  --settings \
    NODE_ENV=production \
    AZURE_SQL_CONNECTION_STRING="mssql://sqladmin:YourStrongPassword123!@lukupaivakirja-sql.database.windows.net:1433/lukupaivakirja?encrypt=true"
```

### Hinta: ~€4.20/kk (Basic tier)

## Vaihtoehto 2: Azure Database for PostgreSQL

PostgreSQL on avoimen lähdekoodin vaihtoehto ja usein halvempi.

### 1. Luo PostgreSQL Server

```bash
# Luo PostgreSQL Flexible Server
az postgres flexible-server create \
  --name lukupaivakirja-postgres \
  --resource-group lukupaivakirja-rg \
  --location northeurope \
  --admin-user pgadmin \
  --admin-password 'YourStrongPassword123!' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 15 \
  --public-access 0.0.0.0-255.255.255.255

# Luo tietokanta
az postgres flexible-server db create \
  --resource-group lukupaivakirja-rg \
  --server-name lukupaivakirja-postgres \
  --database-name lukupaivakirja
```

### 2. Hae Connection String

```
postgresql://pgadmin:YourStrongPassword123!@lukupaivakirja-postgres.postgres.database.azure.com:5432/lukupaivakirja?ssl=true
```

### 3. Lisää App Serviceen

```bash
az webapp config appsettings set \
  --name lukupaivakirja-backend \
  --resource-group lukupaivakirja-rg \
  --settings \
    NODE_ENV=production \
    POSTGRESQL_CONNECTION_STRING="postgresql://pgadmin:YourStrongPassword123!@lukupaivakirja-postgres.postgres.database.azure.com:5432/lukupaivakirja?ssl=true"
```

### Hinta: ~€10-12/kk (Burstable B1ms)

## Vaihtoehto 3: Azure Cosmos DB (NoSQL)

Jos haluat NoSQL-ratkaisun ja olet valmis muuttamaan koodia.

```bash
az cosmosdb create \
  --name lukupaivakirja-cosmos \
  --resource-group lukupaivakirja-rg \
  --kind MongoDB \
  --locations regionName=northeurope \
  --server-version 4.2
```

**Huom:** Vaatii koodin muutoksia MongoDB-yhteensopivaksi.

### Hinta: Alkaa ~€23/kk (400 RU/s)

## Kustannusvertailu

| Tietokanta             | Kuukausihinta | Sopii                     |
| ---------------------- | ------------- | ------------------------- |
| **Azure SQL Basic**    | €4.20         | ✅ Pienille sovelluksille |
| **PostgreSQL B1ms**    | €10-12        | ✅ Avoimen lähdekoodin    |
| **SQL Standard S0**    | €13           | Keskikokoisille           |
| **Cosmos DB (400 RU)** | €23           | Globaalille skaalalle     |

## Testaa yhteyttä paikallisesti

Ennen kuin julkaiset Azureen, testaa tietokantayhteyttä:

```bash
cd backend

# Luo .env tiedosto
cat > .env << EOF
NODE_ENV=production
AZURE_SQL_CONNECTION_STRING=mssql://sqladmin:password@server.database.windows.net:1433/lukupaivakirja?encrypt=true
EOF

# Asenna riippuvuudet
npm install

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

✅ Tietokantayhteys toimii!

## Tietoturva

### 1. Firewall-säännöt

**Salli vain App Service:**

```bash
# Hae App Servicen IP-osoitteet
az webapp show \
  --name lukupaivakirja-backend \
  --resource-group lukupaivakirja-rg \
  --query outboundIpAddresses --output tsv

# Lisää firewall-säännöt jokaiselle IP:lle
az sql server firewall-rule create \
  --resource-group lukupaivakirja-rg \
  --server lukupaivakirja-sql \
  --name AppService1 \
  --start-ip-address 40.68.XXX.XXX \
  --end-ip-address 40.68.XXX.XXX
```

### 2. Käytä Azure Key Vault salasanoille

```bash
# Luo Key Vault
az keyvault create \
  --name lukupaivakirja-vault \
  --resource-group lukupaivakirja-rg \
  --location northeurope

# Tallenna connection string
az keyvault secret set \
  --vault-name lukupaivakirja-vault \
  --name DbConnectionString \
  --value "mssql://..."

# Anna App Servicelle oikeudet
az webapp identity assign \
  --name lukupaivakirja-backend \
  --resource-group lukupaivakirja-rg

# Referoi App Servicessa
# @Microsoft.KeyVault(SecretUri=https://lukupaivakirja-vault.vault.azure.net/secrets/DbConnectionString/)
```

### 3. VNet-integraatio (parannetulle tietoturvalle)

App Service ja tietokanta voivat kommunikoida suljetussa verkossa.

## Migraatio SQLite:stä Azureen

Jos sinulla on jo dataa SQLite-tietokannassa:

### 1. Vie data

```bash
# Asenna sqlite3
brew install sqlite3  # macOS

# Vie JSON-muotoon
sqlite3 lukupaivakirja.db "SELECT json_group_array(json_object('title', title, 'author', author, 'review', review, 'image_path', image_path)) FROM books;" > books.json
```

### 2. Tuo Azure SQL:ään

```javascript
// import-data.js
const { Sequelize } = require("sequelize");
const fs = require("fs");

const sequelize = new Sequelize("your-connection-string", {
  dialect: "mssql",
  dialectOptions: { options: { encrypt: true } },
});

const books = JSON.parse(fs.readFileSync("books.json"));

async function importData() {
  for (const book of books) {
    await sequelize.query(
      "INSERT INTO books (title, author, review, image_path) VALUES (?, ?, ?, ?)",
      { replacements: [book.title, book.author, book.review, book.image_path] },
    );
  }
  console.log("Import complete!");
}

importData();
```

## Varmuuskopiointi

### Azure SQL automaattiset varmuuskopiot

```bash
# Listaa saatavilla olevat varmuuskopiot
az sql db list-backups \
  --resource-group lukupaivakirja-rg \
  --server lukupaivakirja-sql \
  --database lukupaivakirja

# Palauta varmuuskopiosta
az sql db restore \
  --dest-name lukupaivakirja-restored \
  --resource-group lukupaivakirja-rg \
  --server lukupaivakirja-sql \
  --name lukupaivakirja \
  --time "2026-05-18T10:00:00Z"
```

Basic tier:

- **Point-in-time restore:** 7 päivää
- **Automaattiset varmuuskopiot:** Päivittäin

## Monitorointi

### Application Insights kyselymonitorointi

```bash
# Ota käyttöön SQL Analytics
az monitor app-insights component create \
  --app lukupaivakirja-insights \
  --location northeurope \
  --resource-group lukupaivakirja-rg

# Linkitä App Serviceen (tehty jo aiemmin)
```

### Seuraa hitaita kyselyitä

Azure Portalissa → SQL Database → Intelligent Performance → Query Performance Insight

## Skaalauspuikelemat

### Automaattinen skaalaus (SQL Database)

```bash
# Päivitä tier
az sql db update \
  --resource-group lukupaivakirja-rg \
  --server lukupaivakirja-sql \
  --name lukupaivakirja \
  --service-objective S1  # Standard tier
```

### Read Replicas (vain Premium)

Jos tarvitset paremman suorituskyvyn:

```bash
az sql db replica create \
  --resource-group lukupaivakirja-rg \
  --server lukupaivakirja-sql-read \
  --name lukupaivakirja \
  --partner-database lukupaivakirja \
  --partner-server lukupaivakirja-sql
```

## Vianmääritys

### "Connection refused"

1. Tarkista firewall-säännöt
2. Varmista että käytät oikeaa connection stringiä
3. Testaa yhteys: `telnet server.database.windows.net 1433`

### "Authentication failed"

1. Tarkista käyttäjätunnus ja salasana
2. Varmista että salasanassa ei ole erikoismerkkejä, jotka tarvitsevat URL-enkoodausta
3. Kokeile Azure Portalin Query Editor -työkalua

### "Database does not exist"

1. Varmista että tietokanta on luotu
2. Tarkista tietokannan nimi connection stringissä
3. Sequelize luo taulut automaattisesti, mutta ei tietokantaa

## Suorituskyvyn optimointi

### 1. Connection pooling

Sequelize käyttää automaattisesti connection poolingia:

```javascript
const sequelize = new Sequelize(connectionString, {
  pool: {
    max: 5, // Maksimi yhteydet
    min: 0, // Minimi yhteydet
    acquire: 30000,
    idle: 10000,
  },
});
```

### 2. Indeksit

```sql
-- Lisää indeksi usein haettaville kentille
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_created ON books(created_at);
```

### 3. Cached queries

Käytä Redis-välimuistia usein haettaville datalle.

## Yhteenveto

1. ✅ Luo Azure SQL Database (Basic, €4.20/kk)
2. ✅ Hae connection string
3. ✅ Lisää App Servicen ympäristömuuttujiin
4. ✅ Sovellus käyttää automaattisesti Azure SQL:ää tuotannossa
5. ✅ SQLite toimii edelleen paikallisesti kehityksessä

**Sovellus tukee nyt:**

- ✅ SQLite (kehitys)
- ✅ Azure SQL Database (tuotanto)
- ✅ PostgreSQL (tuotanto)
- ✅ Automaattinen valinta ympäristömuuttujien perusteella

Ei tarvitse muuttaa koodia - aseta vain ympäristömuuttuja!
