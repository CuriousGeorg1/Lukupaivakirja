// Check for books with incorrect image paths
require("dotenv").config();
const { initializeDatabase, DatabaseAdapter } = require("./db");

async function checkImagePaths() {
  try {
    const { db, Book, Genre } = await initializeDatabase();
    const dbAdapter = new DatabaseAdapter(db, Book, Genre);

    console.log("Fetching all books...\n");
    const books = await dbAdapter.getAllBooks();

    console.log(`Total books: ${books.length}\n`);

    books.forEach((book) => {
      console.log(`Book ID: ${book.id}`);
      console.log(`Title: ${book.title}`);
      console.log(`Image Path: ${book.image_path || "(none)"}`);

      // Check if image_path looks wrong
      if (book.image_path && !book.image_path.startsWith("/uploads/")) {
        console.log("WARNING: Incorrect image path detected!");
      }
      console.log("---");
    });

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkImagePaths();
