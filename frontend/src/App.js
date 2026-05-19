import React, { useState, useEffect } from "react";
import "./App.css";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

// API URL with fallback and validation
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// Validate API URL on load
if (!process.env.REACT_APP_API_URL) {
  console.warn(
    "REACT_APP_API_URL environment variable is not set! Using fallback:",
    API_URL,
  );
}
console.log("🔗 API URL configured:", API_URL);

// Helper function for better error handling
const handleApiError = async (response, endpoint) => {
  const url = `${API_URL}${endpoint}`;

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = `${errorMessage} - ${errorData.error}`;
      }
    } catch (e) {
      // Response wasn't JSON
    }

    console.error(`[ERROR] ${endpoint} failed:`, {
      url,
      status: response.status,
      statusText: response.statusText,
      message: errorMessage,
    });

    throw new Error(errorMessage);
  }
};

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
    const endpoint = "/api/genres";
    try {
      console.log(`[FRONTEND] Sending request: GET ${endpoint} to ${API_URL}`);
      const response = await fetch(`${API_URL}${endpoint}`);
      await handleApiError(response, endpoint);
      const data = await response.json();
      console.log(`[FRONTEND] Received response: GET ${endpoint}`, data);
      setGenres(data);
    } catch (err) {
      const errorMsg = `Virhe kategorioiden haussa: ${err.message}`;
      console.error(`[ERROR] ${endpoint}:`, err);
      if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
        console.error("Network error - unable to reach backend at:", API_URL);
        console.error(
          "Check: 1) Backend is running, 2) REACT_APP_API_URL is correct, 3) CORS settings",
        );
      }
      setError(errorMsg);
    }
  };

  const fetchWriters = async () => {
    const endpoint = "/api/writers";
    try {
      console.log(`[FRONTEND] Sending request: GET ${endpoint} to ${API_URL}`);
      const response = await fetch(`${API_URL}${endpoint}`);
      await handleApiError(response, endpoint);
      const data = await response.json();
      console.log(`[FRONTEND] Received response: GET ${endpoint}`, data);
      setWriters(data);
    } catch (err) {
      const errorMsg = `Virhe kirjailijoiden haussa: ${err.message}`;
      console.error(`[ERROR] ${endpoint}:`, err);
      if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
        console.error("Network error - unable to reach backend at:", API_URL);
        console.error(
          "Check: 1) Backend is running, 2) REACT_APP_API_URL is correct, 3) CORS settings",
        );
      }
      setError(errorMsg);
    }
  };

  const handleAddWriter = async (name) => {
    const endpoint = "/api/writers";
    try {
      console.log(`[FRONTEND] Sending request: POST ${endpoint}`, { name });
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      await handleApiError(response, endpoint);
      const data = await response.json();
      console.log(`[FRONTEND] Received response: POST ${endpoint}`, data);

      await fetchWriters();
      return data;
    } catch (err) {
      const errorMsg = `Virhe kirjailijan lisäämisessä: ${err.message}`;
      console.error(`[ERROR] POST ${endpoint}:`, err);
      setError(errorMsg);
      return null;
    }
  };

  const fetchBooks = async () => {
    const endpoint = "/api/books";
    try {
      setLoading(true);
      console.log(`[FRONTEND] Sending request: GET ${endpoint} to ${API_URL}`);
      const response = await fetch(`${API_URL}${endpoint}`);
      await handleApiError(response, endpoint);
      const data = await response.json();
      console.log(`[FRONTEND] Received response: GET ${endpoint}`, data);
      setBooks(data);
      setError(null);
    } catch (err) {
      const errorMsg = `Virhe kirjojen haussa: ${err.message}`;
      console.error(`[ERROR] ${endpoint}:`, err);
      if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
        console.error("Network error - unable to reach backend at:", API_URL);
        console.error(
          "Check: 1) Backend is running, 2) REACT_APP_API_URL is correct, 3) CORS settings",
        );
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (formData) => {
    const endpoint = "/api/books";
    try {
      console.log(`[FRONTEND] Sending request: POST ${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      await handleApiError(response, endpoint);
      const data = await response.json();
      console.log(`[FRONTEND] Received response: POST ${endpoint}`, data);

      await fetchBooks();
      return true;
    } catch (err) {
      const errorMsg = `Virhe kirjan lisäämisessä: ${err.message}`;
      console.error(`[ERROR] POST ${endpoint}:`, err);
      setError(errorMsg);
      return false;
    }
  };

  const handleUpdateBook = async (id, formData) => {
    const endpoint = `/api/books/${id}`;
    try {
      console.log(`[FRONTEND] Sending request: PUT ${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        body: formData,
      });

      await handleApiError(response, endpoint);
      const data = await response.json();
      console.log(`[FRONTEND] Received response: PUT ${endpoint}`, data);

      await fetchBooks();
      setEditingBook(null);
      return true;
    } catch (err) {
      const errorMsg = `Virhe kirjan päivittämisessä: ${err.message}`;
      console.error(`[ERROR] PUT ${endpoint}:`, err);
      setError(errorMsg);
      return false;
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Haluatko varmasti poistaa tämän kirjan?")) return;

    const endpoint = `/api/books/${id}`;
    try {
      console.log(`[FRONTEND] Sending request: DELETE ${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
      });

      await handleApiError(response, endpoint);
      const data = await response.json();
      console.log(`[FRONTEND] Received response: DELETE ${endpoint}`, data);

      await fetchBooks();
    } catch (err) {
      const errorMsg = `Virhe kirjan poistamisessa: ${err.message}`;
      console.error(`[ERROR] DELETE ${endpoint}:`, err);
      setError(errorMsg);
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
