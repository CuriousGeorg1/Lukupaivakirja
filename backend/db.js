const sqlite3 = require("sqlite3").verbose();
const { Sequelize } = require("sequelize");

// Detect environment
const isProduction = process.env.NODE_ENV === "production";
const useAzureSQL = process.env.AZURE_SQL_CONNECTION_STRING;
const usePostgreSQL = process.env.POSTGRESQL_CONNECTION_STRING;

let db;
let sequelize;

async function initializeDatabase() {
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
        logging: false,
      });
    }

    try {
      await sequelize.authenticate();
      console.log("Database connection established successfully");

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
            allowNull: false,
          },
          review: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          image_path: {
            type: Sequelize.STRING,
            allowNull: true,
          },
        },
        {
          tableName: "books",
          timestamps: true,
          createdAt: "created_at",
          updatedAt: false,
        },
      );

      // Sync database (create tables if they don't exist, but don't alter existing ones)
      await sequelize.sync({ alter: false });
      console.log("Database tables synchronized");

      return { sequelize, Book };
    } catch (error) {
      console.error("Unable to connect to database:", error);
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
            .then(() => resolve({ db, sequelize: null, Book: null }))
            .catch(reject);
        }
      });
    });
  }
}

function initializeSQLite() {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        review TEXT,
        image_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
          reject(err);
        } else {
          console.log("Books table ready");
          resolve();
        }
      },
    );
  });
}

// Database operations abstraction
class DatabaseAdapter {
  constructor(db, Book) {
    this.db = db;
    this.Book = Book;
    this.useSequelize = !!Book;
  }

  async getAllBooks() {
    if (this.useSequelize) {
      const books = await this.Book.findAll({
        order: [["created_at", "DESC"]],
        raw: true,
      });
      return books;
    } else {
      return new Promise((resolve, reject) => {
        this.db.all(
          "SELECT * FROM books ORDER BY created_at DESC",
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
      const book = await this.Book.findByPk(id, { raw: true });
      return book;
    } else {
      return new Promise((resolve, reject) => {
        this.db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }
  }

  async createBook(title, author, review, imagePath) {
    if (this.useSequelize) {
      const book = await this.Book.create({
        title,
        author,
        review,
        image_path: imagePath,
      });
      return book.get({ plain: true });
    } else {
      return new Promise((resolve, reject) => {
        this.db.run(
          "INSERT INTO books (title, author, review, image_path) VALUES (?, ?, ?, ?)",
          [title, author, review, imagePath],
          function (err) {
            if (err) reject(err);
            else
              resolve({
                id: this.lastID,
                title,
                author,
                review,
                image_path: imagePath,
              });
          },
        );
      });
    }
  }

  async updateBook(id, title, author, review, imagePath) {
    if (this.useSequelize) {
      await this.Book.update(
        { title, author, review, image_path: imagePath },
        { where: { id } },
      );
      return { id, title, author, review, image_path: imagePath };
    } else {
      return new Promise((resolve, reject) => {
        this.db.run(
          "UPDATE books SET title = ?, author = ?, review = ?, image_path = ? WHERE id = ?",
          [title, author, review, imagePath, id],
          (err) => {
            if (err) reject(err);
            else resolve({ id, title, author, review, image_path: imagePath });
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
