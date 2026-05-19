// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { initializeDatabase, DatabaseAdapter } = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

let dbAdapter;

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// API Routes

// Genre endpoints
app.get("/api/genres", async (req, res) => {
  console.log("[BACKEND] Received request: GET /api/genres");
  try {
    const genres = await dbAdapter.getAllGenres();
    console.log("[BACKEND] Sending response: GET /api/genres", genres);
    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/genres", async (req, res) => {
  console.log("[BACKEND] Received request: POST /api/genres", req.body);
  const { name } = req.body;

  if (!name || !name.trim()) {
    console.log("[BACKEND] Sending response: POST /api/genres (400 error)");
    res.status(400).json({ error: "Genre name is required" });
    return;
  }

  try {
    const genre = await dbAdapter.createGenre(name.trim());
    console.log("[BACKEND] Sending response: POST /api/genres", genre);
    res.status(201).json(genre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Writer endpoints
app.get("/api/writers", async (req, res) => {
  console.log("[BACKEND] Received request: GET /api/writers");
  try {
    const writers = await dbAdapter.getAllWriters();
    console.log("[BACKEND] Sending response: GET /api/writers", writers);
    res.json(writers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/writers", async (req, res) => {
  console.log("[BACKEND] Received request: POST /api/writers", req.body);
  const { name } = req.body;

  if (!name || !name.trim()) {
    console.log("[BACKEND] Sending response: POST /api/writers (400 error)");
    res.status(400).json({ error: "Writer name is required" });
    return;
  }

  try {
    const writer = await dbAdapter.createWriter(name.trim());
    console.log("[BACKEND] Sending response: POST /api/writers", writer);
    res.status(201).json(writer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all books
app.get("/api/books", async (req, res) => {
  console.log("[BACKEND] Received request: GET /api/books");
  try {
    const books = await dbAdapter.getAllBooks();
    console.log("[BACKEND] Sending response: GET /api/books", books);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single book
app.get("/api/books/:id", async (req, res) => {
  console.log(`[BACKEND] Received request: GET /api/books/${req.params.id}`);
  try {
    const book = await dbAdapter.getBookById(req.params.id);
    if (!book) {
      console.log(
        `[BACKEND] Sending response: GET /api/books/${req.params.id} (404 not found)`,
      );
      res.status(404).json({ error: "Book not found" });
      return;
    }
    console.log(
      `[BACKEND] Sending response: GET /api/books/${req.params.id}`,
      book,
    );
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new book
app.post("/api/books", upload.single("image"), async (req, res) => {
  console.log("[BACKEND] Received request: POST /api/books", req.body);
  const { title, author, review, genre_id, writer_id } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.log("[BACKEND] Sending response: POST /api/books (400 error)");
    res.status(400).json({ error: "Title is required" });
    return;
  }

  try {
    const genreId = genre_id ? parseInt(genre_id) : null;
    const writerId = writer_id ? parseInt(writer_id) : null;
    const book = await dbAdapter.createBook(
      title,
      author || null,
      review,
      imagePath,
      genreId,
      writerId,
    );
    console.log("[BACKEND] Sending response: POST /api/books", book);
    res.status(201).json(book);
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: err.message });
  }
});

// Update book
app.put("/api/books/:id", upload.single("image"), async (req, res) => {
  console.log(
    `[BACKEND] Received request: PUT /api/books/${req.params.id}`,
    req.body,
  );
  const { title, author, review, genre_id, writer_id } = req.body;
  const bookId = req.params.id;

  try {
    const existingBook = await dbAdapter.getBookById(bookId);
    if (!existingBook) {
      console.log(
        `[BACKEND] Sending response: PUT /api/books/${bookId} (404 not found)`,
      );
      res.status(404).json({ error: "Book not found" });
      return;
    }

    const oldImagePath = existingBook.image_path;
    const newImagePath = req.file
      ? `/uploads/${req.file.filename}`
      : oldImagePath;

    const genreId = genre_id ? parseInt(genre_id) : existingBook.genre_id;
    const writerId = writer_id ? parseInt(writer_id) : existingBook.writer_id;

    const updatedBook = await dbAdapter.updateBook(
      bookId,
      title,
      author || null,
      review,
      newImagePath,
      genreId,
      writerId,
    );

    // Delete old image if a new one was uploaded
    if (req.file && oldImagePath) {
      const oldFilePath = path.join(__dirname, oldImagePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    console.log(
      `[BACKEND] Sending response: PUT /api/books/${bookId}`,
      updatedBook,
    );
    res.json(updatedBook);
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: err.message });
  }
});

// Delete book
app.delete("/api/books/:id", async (req, res) => {
  console.log(`[BACKEND] Received request: DELETE /api/books/${req.params.id}`);
  const bookId = req.params.id;

  try {
    const book = await dbAdapter.getBookById(bookId);
    if (!book) {
      console.log(
        `[BACKEND] Sending response: DELETE /api/books/${bookId} (404 not found)`,
      );
      res.status(404).json({ error: "Book not found" });
      return;
    }

    await dbAdapter.deleteBook(bookId);

    // Delete image file if exists
    if (book.image_path) {
      const filePath = path.join(__dirname, book.image_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    console.log(`[BACKEND] Sending response: DELETE /api/books/${bookId}`, {
      message: "Book deleted successfully",
    });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function startServer() {
  try {
    const { db, Book, Genre, Writer } = await initializeDatabase();
    dbAdapter = new DatabaseAdapter(db, Book, Genre, Writer);
    console.log("Database initialized successfully");

    // Start server after database is ready
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

// Start the application
startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  if (dbAdapter) {
    try {
      await dbAdapter.close();
      console.log("Database connection closed");
    } catch (err) {
      console.error("Error closing database:", err.message);
    }
  }
  process.exit(0);
});
