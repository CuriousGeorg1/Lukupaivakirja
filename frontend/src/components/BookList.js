import React from "react";
import "./BookList.css";

function BookList({ books, onDelete, onEdit, apiUrl }) {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <p>📖 Ei vielä kirjoja. Lisää ensimmäinen kirjasi!</p>
      </div>
    );
  }

  return (
    <div className="book-list">
      <h2>Kirjani ({books.length})</h2>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            {book.image_path && (
              <div className="book-image">
                <img
                  src={`${apiUrl}${book.image_path}`}
                  alt={book.title}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="book-content">
              <h3>{book.title}</h3>
              <p className="book-author">
                ✍️ {book.writer_name || book.author || "Tuntematon"}
              </p>
              {book.genre_name && (
                <p className="book-genre">📂 {book.genre_name}</p>
              )}
              {book.review && <p className="book-review">{book.review}</p>}
              <p className="book-date">
                📅 {new Date(book.created_at).toLocaleDateString("fi-FI")}
              </p>
            </div>
            <div className="book-actions">
              <button
                onClick={() => onEdit(book)}
                className="btn-edit"
                title="Muokkaa"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(book.id)}
                className="btn-delete"
                title="Poista"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookList;
