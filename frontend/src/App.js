import React, { useState, useEffect } from "react";
import "./App.css";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchGenres();
    fetchWriters();
  }, []);

  const fetchGenres = async () => {
    try {
      console.log("[FRONTEND] Sending request: GET /api/genres");
      const response = await fetch(`${API_URL}/api/genres`);
      if (!response.ok) throw new Error("Virhe kategorioiden haussa");
      const data = await response.json();
      console.log("[FRONTEND] Received response: GET /api/genres", data);
      setGenres(data);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  const fetchWriters = async () => {
    try {
      console.log("[FRONTEND] Sending request: GET /api/writers");
      const response = await fetch(`${API_URL}/api/writers`);
      if (!response.ok) throw new Error("Virhe kirjailijoiden haussa");
      const data = await response.json();
      console.log("[FRONTEND] Received response: GET /api/writers", data);
      setWriters(data);
    } catch (err) {
      console.error("Error fetching writers:", err);
    }
  };

  const handleAddWriter = async (name) => {
    try {
      console.log("[FRONTEND] Sending request: POST /api/writers", { name });
      const response = await fetch(`${API_URL}/api/writers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Virhe kirjailijan lisäämisessä");
      const data = await response.json();
      console.log("[FRONTEND] Received response: POST /api/writers", data);

      await fetchWriters();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      console.log("[FRONTEND] Sending request: GET /api/books");
      const response = await fetch(`${API_URL}/api/books`);
      if (!response.ok) throw new Error("Virhe kirjojen haussa");
      const data = await response.json();
      console.log("[FRONTEND] Received response: GET /api/books", data);
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
      console.log("[FRONTEND] Sending request: POST /api/books", formData);
      const response = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Virhe kirjan lisäämisessä");
      const data = await response.json();
      console.log("[FRONTEND] Received response: POST /api/books", data);

      await fetchBooks();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleUpdateBook = async (id, formData) => {
    try {
      console.log(`[FRONTEND] Sending request: PUT /api/books/${id}`, formData);
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Virhe kirjan päivittämisessä");
      const data = await response.json();
      console.log(`[FRONTEND] Received response: PUT /api/books/${id}`, data);

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
      console.log(`[FRONTEND] Sending request: DELETE /api/books/${id}`);
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Virhe kirjan poistamisessa");
      const data = await response.json();
      console.log(
        `[FRONTEND] Received response: DELETE /api/books/${id}`,
        data,
      );

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
          writers={writers}
          onAddWriter={handleAddWriter}
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
