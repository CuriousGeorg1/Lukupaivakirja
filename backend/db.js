const sqlite3 = require("sqlite3").verbose();
const { Sequelize } = require("sequelize");

// Detect environment
const isProduction = process.env.NODE_ENV === "production";
const useAzureSQL = process.env.AZURE_SQL_CONNECTION_STRING;
const usePostgreSQL = process.env.POSTGRESQL_CONNECTION_STRING;

let db;
let sequelize;

async function initializeDatabase() {
  console.log("\n Database Configuration:");
  console.log("   NODE_ENV:", process.env.NODE_ENV || "not set");
  console.log(
    "   POSTGRESQL_CONNECTION_STRING:",
    !!process.env.POSTGRESQL_CONNECTION_STRING ? "✓ set" : "✗ not set",
  );
  console.log(
    "   AZURE_SQL_CONNECTION_STRING:",
    !!process.env.AZURE_SQL_CONNECTION_STRING ? "✓ set" : "✗ not set",
  );

  if (useAzureSQL || usePostgreSQL) {
    // Azure SQL or PostgreSQL with Sequelize
    console.log("Using cloud database (PostgreSQL)");

    if (useAzureSQL) {
      sequelize = new Sequelize(process.env.AZURE_SQL_CONNECTION_STRING, {
        dialect: "mssql",
        dialectOptions: {
          options: {
            encrypt: true,
            trustServerCertificate: false,
          },
        },
        logging: false,
      });
    } else {
      // Supabase PostgreSQL or other PostgreSQL
      console.log("Connecting to PostgreSQL database (Supabase/other)");
      sequelize = new Sequelize(process.env.POSTGRESQL_CONNECTION_STRING, {
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        logging: console.log, // Enable logging to see connection issues
      });
    }

    try {
      await sequelize.authenticate();
      console.log(" Database connection established successfully");
      console.log(`   Database: ${sequelize.config.database}`);
      console.log(`   Host: ${sequelize.config.host}`);
      console.log(`   Dialect: ${sequelize.config.dialect}`);

      // Define Genre model
      const Genre = sequelize.define(
        "Genre",
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
        },
        {
          tableName: "genres",
          timestamps: false,
        },
      );

      // Define Writer model
      const Writer = sequelize.define(
        "Writer",
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
        },
        {
          tableName: "writers",
          timestamps: false,
        },
      );

      // Define Book model
      const Book = sequelize.define(
        "Book",
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          author: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          writer_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: Writer,
              key: "id",
            },
          },
          review: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          image_path: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          genre_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: Genre,
              key: "id",
            },
          },
        },
        {
          tableName: "books",
          timestamps: true,
          createdAt: "created_at",
          updatedAt: false,
        },
      );

      // Define relationships
      Genre.hasMany(Book, { foreignKey: "genre_id" });
      Book.belongsTo(Genre, { foreignKey: "genre_id" });

      Writer.hasMany(Book, { foreignKey: "writer_id" });
      Book.belongsTo(Writer, { foreignKey: "writer_id" });

      // Sync database
      await sequelize.sync({ alter: false });
      console.log("Database tables synchronized");

      const genreCount = await Genre.count();
      if (genreCount === 0) {
        await Genre.bulkCreate([
          { name: "Fiktio" },
          { name: "Tietokirja" },
          { name: "Fantasia" },
          { name: "Tiede" },
          { name: "Historia" },
          { name: "Biografia" },
          { name: "Romantiikka" },
          { name: "Jännitys" },
          { name: "Scifi" },
          { name: "Muu" },
        ]);
        console.log("Default genres created");
      }

      return { sequelize, Book, Genre, Writer };
    } catch (error) {
      console.error("Unable to connect to database:");
      console.error("   Error name:", error.name);
      console.error("   Error message:", error.message);
      if (error.parent) {
        console.error("   Parent error:", error.parent.message);
      }
      console.error("\n🔍 Connection string info:");
      console.error(
        "   Using POSTGRESQL_CONNECTION_STRING:",
        !!process.env.POSTGRESQL_CONNECTION_STRING,
      );
      if (process.env.POSTGRESQL_CONNECTION_STRING) {
        // Log sanitized connection string (hide password)
        const sanitized = process.env.POSTGRESQL_CONNECTION_STRING.replace(
          /:([^@]+)@/,
          ":****@",
        );
        console.error("   Connection string (sanitized):", sanitized);
      }
      throw error;
    }
  } else {
    // SQLite for development
    console.log("Using SQLite database (development mode)");

    return new Promise((resolve, reject) => {
      db = new sqlite3.Database("./lukupaivakirja.db", (err) => {
        if (err) {
          console.error("Error opening database:", err.message);
          reject(err);
        } else {
          console.log("Connected to SQLite database");
          initializeSQLite()
            .then(() =>
              resolve({
                db,
                sequelize: null,
                Book: null,
                Genre: null,
                Writer: null,
              }),
            )
            .catch(reject);
        }
      });
    });
  }
}

function initializeSQLite() {
  return new Promise((resolve, reject) => {
    // Create genres table first
    db.run(
      `
      CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating genres table:", err.message);
          reject(err);
          return;
        }
        console.log("Genres table ready");

        // Create writers table
        db.run(
          `
          CREATE TABLE IF NOT EXISTS writers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
          )
        `,
          (err) => {
            if (err) {
              console.error("Error creating writers table:", err.message);
              reject(err);
              return;
            }
            console.log("Writers table ready");

            // Create books table with foreign key to genres and writers
            db.run(
              `
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT,
        writer_id INTEGER,
        review TEXT,
        image_path TEXT,
        genre_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (genre_id) REFERENCES genres(id),
        FOREIGN KEY (writer_id) REFERENCES writers(id)
      )
    `,
              (err) => {
                if (err) {
                  console.error("Error creating books table:", err.message);
                  reject(err);
                  return;
                }
                console.log("Books table ready");

                // Insert default genres if table is empty
                db.get(
                  "SELECT COUNT(*) as count FROM genres",
                  [],
                  (err, row) => {
                    if (err) {
                      reject(err);
                      return;
                    }

                    if (row.count === 0) {
                      const genres = [
                        "Fiktio",
                        "Tietokirja",
                        "Fantasia",
                        "Tiede",
                        "Historia",
                        "Biografia",
                        "Romantiikka",
                        "Jännitys",
                        "Scifi",
                        "Muu",
                      ];
                      const stmt = db.prepare(
                        "INSERT INTO genres (name) VALUES (?)",
                      );
                      genres.forEach((genre) => stmt.run(genre));
                      stmt.finalize((err) => {
                        if (err) {
                          reject(err);
                        } else {
                          console.log("Default genres created");
                          resolve();
                        }
                      });
                    } else {
                      resolve();
                    }
                  },
                );
              },
            );
          },
        );
      },
    );
  });
}

// Database operations abstraction
class DatabaseAdapter {
  constructor(db, Book, Genre, Writer) {
    this.db = db;
    this.Book = Book;
    this.Genre = Genre;
    this.Writer = Writer;
    this.useSequelize = !!Book;
  }

  async getAllGenres() {
    if (this.useSequelize) {
      const genres = await this.Genre.findAll({
        order: [["name", "ASC"]],
        raw: true,
      });
      return genres;
    } else {
      return new Promise((resolve, reject) => {
        this.db.all(
          "SELECT * FROM genres ORDER BY name ASC",
          [],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          },
        );
      });
    }
  }

  async getGenreById(id) {
    if (this.useSequelize) {
      const genre = await this.Genre.findByPk(id, { raw: true });
      return genre;
    } else {
      return new Promise((resolve, reject) => {
        this.db.get("SELECT * FROM genres WHERE id = ?", [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }
  }

  async createGenre(name) {
    if (this.useSequelize) {
      const genre = await this.Genre.create({ name });
      return genre.get({ plain: true });
    } else {
      return new Promise((resolve, reject) => {
        this.db.run(
          "INSERT INTO genres (name) VALUES (?)",
          [name],
          function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, name });
          },
        );
      });
    }
  }

  async getAllWriters() {
    if (this.useSequelize) {
      const writers = await this.Writer.findAll({
        order: [["name", "ASC"]],
        raw: true,
      });
      return writers;
    } else {
      return new Promise((resolve, reject) => {
        this.db.all(
          "SELECT * FROM writers ORDER BY name ASC",
          [],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          },
        );
      });
    }
  }

  async getWriterById(id) {
    if (this.useSequelize) {
      const writer = await this.Writer.findByPk(id, { raw: true });
      return writer;
    } else {
      return new Promise((resolve, reject) => {
        this.db.get("SELECT * FROM writers WHERE id = ?", [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }
  }

  async createWriter(name) {
    if (this.useSequelize) {
      const writer = await this.Writer.create({ name });
      return writer.get({ plain: true });
    } else {
      return new Promise((resolve, reject) => {
        this.db.run(
          "INSERT INTO writers (name) VALUES (?)",
          [name],
          function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, name });
          },
        );
      });
    }
  }

  async getAllBooks() {
    if (this.useSequelize) {
      const books = await this.Book.findAll({
        include: [
          { model: this.Genre, attributes: ["id", "name"] },
          { model: this.Writer, attributes: ["id", "name"] },
        ],
        order: [["created_at", "DESC"]],
      });
      return books.map((book) => {
        const bookData = book.get({ plain: true });
        return {
          ...bookData,
          genre_name: bookData.Genre ? bookData.Genre.name : null,
          writer_name: bookData.Writer ? bookData.Writer.name : null,
        };
      });
    } else {
      return new Promise((resolve, reject) => {
        this.db.all(
          `SELECT books.*, genres.name as genre_name, writers.name as writer_name
           FROM books 
           LEFT JOIN genres ON books.genre_id = genres.id 
           LEFT JOIN writers ON books.writer_id = writers.id
           ORDER BY books.created_at DESC`,
          [],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          },
        );
      });
    }
  }

  async getBookById(id) {
    if (this.useSequelize) {
      const book = await this.Book.findByPk(id, {
        include: [
          { model: this.Genre, attributes: ["id", "name"] },
          { model: this.Writer, attributes: ["id", "name"] },
        ],
      });
      if (!book) return null;
      const bookData = book.get({ plain: true });
      return {
        ...bookData,
        genre_name: bookData.Genre ? bookData.Genre.name : null,
        writer_name: bookData.Writer ? bookData.Writer.name : null,
      };
    } else {
      return new Promise((resolve, reject) => {
        this.db.get(
          `SELECT books.*, genres.name as genre_name, writers.name as writer_name
           FROM books 
           LEFT JOIN genres ON books.genre_id = genres.id 
           LEFT JOIN writers ON books.writer_id = writers.id
           WHERE books.id = ?`,
          [id],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          },
        );
      });
    }
  }

  async createBook(title, author, review, imagePath, genreId, writerId) {
    if (this.useSequelize) {
      const book = await this.Book.create({
        title,
        author,
        review,
        image_path: imagePath,
        genre_id: genreId,
        writer_id: writerId,
      });
      return book.get({ plain: true });
    } else {
      return new Promise((resolve, reject) => {
        this.db.run(
          "INSERT INTO books (title, author, review, image_path, genre_id, writer_id) VALUES (?, ?, ?, ?, ?, ?)",
          [title, author, review, imagePath, genreId, writerId],
          function (err) {
            if (err) reject(err);
            else
              resolve({
                id: this.lastID,
                title,
                author,
                review,
                image_path: imagePath,
                genre_id: genreId,
                writer_id: writerId,
              });
          },
        );
      });
    }
  }

  async updateBook(id, title, author, review, imagePath, genreId, writerId) {
    if (this.useSequelize) {
      await this.Book.update(
        {
          title,
          author,
          review,
          image_path: imagePath,
          genre_id: genreId,
          writer_id: writerId,
        },
        { where: { id } },
      );
      return {
        id,
        title,
        author,
        review,
        image_path: imagePath,
        genre_id: genreId,
        writer_id: writerId,
      };
    } else {
      return new Promise((resolve, reject) => {
        this.db.run(
          "UPDATE books SET title = ?, author = ?, review = ?, image_path = ?, genre_id = ?, writer_id = ? WHERE id = ?",
          [title, author, review, imagePath, genreId, writerId, id],
          (err) => {
            if (err) reject(err);
            else
              resolve({
                id,
                title,
                author,
                review,
                image_path: imagePath,
                genre_id: genreId,
                writer_id: writerId,
              });
          },
        );
      });
    }
  }

  async deleteBook(id) {
    if (this.useSequelize) {
      await this.Book.destroy({ where: { id } });
    } else {
      return new Promise((resolve, reject) => {
        this.db.run("DELETE FROM books WHERE id = ?", [id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }

  close() {
    if (this.useSequelize) {
      return this.Book.sequelize.close();
    } else {
      return new Promise((resolve, reject) => {
        this.db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }
}

module.exports = { initializeDatabase, DatabaseAdapter };
