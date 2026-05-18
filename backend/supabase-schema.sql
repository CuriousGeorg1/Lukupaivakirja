-- Lukupäiväkirja - Supabase Database Schema
-- Aja tämä SQL-skripti Supabase SQL Editorissa

-- Luo books-taulu
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  review TEXT,
  image_path VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lisää indeksit suorituskyvyn parantamiseksi
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);

-- Kommentteja tauluun
COMMENT ON TABLE books IS 'Lukupäiväkirjan kirjat';
COMMENT ON COLUMN books.id IS 'Kirjan yksilöllinen tunniste';
COMMENT ON COLUMN books.title IS 'Kirjan nimi';
COMMENT ON COLUMN books.author IS 'Kirjailijan nimi';
COMMENT ON COLUMN books.review IS 'Käyttäjän kirjoittama arvostelu';
COMMENT ON COLUMN books.image_path IS 'Polku kirjan kansikuvaan';
COMMENT ON COLUMN books.created_at IS 'Kirjan lisäysaika';

-- Näytä taulun rakenne
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'books'
ORDER BY ordinal_position;
