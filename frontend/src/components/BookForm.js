import React, { useState, useEffect } from "react";
import "./BookForm.css";

function BookForm({ onSubmit, editingBook, onCancel, genres }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [review, setReview] = useState("");
  const [genreId, setGenreId] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title || "");
      setAuthor(editingBook.author || "");
      setReview(editingBook.review || "");
      setGenreId(editingBook.genre_id || "");
      setImagePreview(editingBook.image_path || null);
      setImage(null);
    } else {
      resetForm();
    }
  }, [editingBook]);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setReview("");
    setGenreId("");
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      alert("Täytä vähintään kirjan nimi ja kirjailija");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("author", author.trim());
    formData.append("review", review.trim());
    if (genreId) {
      formData.append("genre_id", genreId);
    }
    if (image) {
      formData.append("image", image);
    }

    let success;
    if (editingBook) {
      success = await onSubmit(editingBook.id, formData);
    } else {
      success = await onSubmit(formData);
    }

    setSubmitting(false);

    if (success) {
      resetForm();
      if (onCancel) onCancel();
    }
  };

  const handleCancelClick = () => {
    resetForm();
    if (onCancel) onCancel();
  };

  return (
    <div className="book-form-container">
      <h2>{editingBook ? "✏️ Muokkaa kirjaa" : "➕ Lisää uusi kirja"}</h2>
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Kirjan nimi *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Esim. Tuntematon sotilas"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Kirjailija *</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Esim. Väinö Linna"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="review">Arvio</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Kirjoita lyhyt arvio kirjasta..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre">Kategoria</label>
          <select
            id="genre"
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
          >
            <option value="">-- Valitse kategoria --</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Kuva</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="image-preview">
              <img
                src={
                  imagePreview.startsWith("/")
                    ? `http://localhost:3001${imagePreview}`
                    : imagePreview
                }
                alt="Esikatselu"
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Tallennetaan..."
              : editingBook
                ? "Päivitä kirja"
                : "Lisää kirja"}
          </button>
          {editingBook && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelClick}
            >
              Peruuta
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default BookForm;
