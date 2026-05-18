import React, { useState, useEffect } from "react";
import "./App.css";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${API_URL}/api/genres`);
      if (!response.ok) throw new Error("Virhe kategorioiden haussa");
      const data = await response.json();
      setGenres(data);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/books`);
      if (!response.ok) throw new Error("Virhe kirjojen haussa");
      const data = await response.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Virhe kirjan lisäämisessä");

      await fetchBooks();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleUpdateBook = async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Virhe kirjan päivittämisessä");

      await fetchBooks();
      setEditingBook(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Haluatko varmasti poistaa tämän kirjan?")) return;

    try {
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Virhe kirjan poistamisessa");

      await fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>📚 Lukupäiväkirja</h1>
          <p>Tallenna lukemasi kirjat ja arviot</p>
        </header>

        {error && <div className="error-message">⚠️ {error}</div>}

        <BookForm
          onSubmit={editingBook ? handleUpdateBook : handleAddBook}
          editingBook={editingBook}
          onCancel={handleCancelEdit}
          genres={genres}
        />

        {loading ? (
          <div className="loading">Ladataan kirjoja...</div>
        ) : (
          <BookList
            books={books}
            onDelete={handleDeleteBook}
            onEdit={handleEdit}
            apiUrl={API_URL}
          />
        )}
      </div>
    </div>
  );
}

export default App;
