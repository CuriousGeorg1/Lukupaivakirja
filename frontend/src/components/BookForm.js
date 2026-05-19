import React, { useState, useEffect } from "react";
import "./BookForm.css";

function BookForm({
  onSubmit,
  editingBook,
  onCancel,
  genres,
  writers,
  onAddWriter,
}) {
  const [title, setTitle] = useState("");
  const [writerId, setWriterId] = useState("");
  const [newWriterName, setNewWriterName] = useState("");
  const [showAddWriter, setShowAddWriter] = useState(false);
  const [review, setReview] = useState("");
  const [genreId, setGenreId] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title || "");
      setWriterId(editingBook.writer_id || "");
      setReview(editingBook.review || "");
      setGenreId(editingBook.genre_id || "");
      setImagePreview(editingBook.image_path || null);
      setImage(null);
      setShowAddWriter(false);
      setNewWriterName("");
    } else {
      resetForm();
    }
  }, [editingBook]);

  const resetForm = () => {
    setTitle("");
    setWriterId("");
    setNewWriterName("");
    setShowAddWriter(false);
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

    if (!title.trim()) {
      alert("Täytä kirjan nimi");
      return;
    }

    // Handle adding a new writer if needed
    let finalWriterId = writerId;
    if (showAddWriter && newWriterName.trim()) {
      const newWriter = await onAddWriter(newWriterName.trim());
      if (newWriter) {
        finalWriterId = newWriter.id;
        setShowAddWriter(false);
        setNewWriterName("");
      } else {
        alert("Virhe kirjailijan lisäämisessä");
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("review", review.trim());
    if (genreId) {
      formData.append("genre_id", genreId);
    }
    if (finalWriterId) {
      formData.append("writer_id", finalWriterId);
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
          <label htmlFor="writer">Kirjailija</label>
          {!showAddWriter ? (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <select
                id="writer"
                value={writerId}
                onChange={(e) => setWriterId(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">-- Valitse kirjailija --</option>
                {writers &&
                  writers.map((writer) => (
                    <option key={writer.id} value={writer.id}>
                      {writer.name}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddWriter(true)}
              >
                + Uusi
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={newWriterName}
                onChange={(e) => setNewWriterName(e.target.value)}
                placeholder="Kirjailijan nimi"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddWriter(false);
                  setNewWriterName("");
                }}
              >
                Peruuta
              </button>
            </div>
          )}
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
            {genres &&
              genres.map((genre) => (
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
