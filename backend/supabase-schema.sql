-- Lukupäiväkirja - Supabase Database Schema
-- Aja tämä SQL-skripti Supabase SQL Editorissa

-- Luo genres-taulu (kategoriat)
CREATE TABLE IF NOT EXISTS genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Luo books-taulu
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  review TEXT,
  image_path VARCHAR(500),
  genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lisää indeksit suorituskyvyn parantamiseksi
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_genre_id ON books(genre_id);

-- Lisää oletuskategoriat
INSERT INTO genres (name) VALUES 
  ('Fiktio'),
  ('Tietokirja'),
  ('Fantasia'),
  ('Tiede'),
  ('Historia'),
  ('Biografia'),
  ('Romantiikka'),
  ('Jännitys'),
  ('Scifi'),
  ('Muu')
ON CONFLICT (name) DO NOTHING;

-- Kommentteja tauluihin
COMMENT ON TABLE genres IS 'Kirjojen kategoriat (1:N-suhde kirjoihin)';
COMMENT ON COLUMN genres.id IS 'Kategorian yksilöllinen tunniste';
COMMENT ON COLUMN genres.name IS 'Kategorian nimi';

COMMENT ON TABLE books IS 'Lukupäiväkirjan kirjat';
COMMENT ON COLUMN books.id IS 'Kirjan yksilöllinen tunniste';
COMMENT ON COLUMN books.title IS 'Kirjan nimi';
COMMENT ON COLUMN books.author IS 'Kirjailijan nimi';
COMMENT ON COLUMN books.review IS 'Käyttäjän kirjoittama arvostelu';
COMMENT ON COLUMN books.image_path IS 'Polku kirjan kansikuvaan';
COMMENT ON COLUMN books.genre_id IS 'Viittaus kategorian ID:hen (1:N-suhde)';
COMMENT ON COLUMN books.created_at IS 'Kirjan lisäysaika';

-- Näytä taulujen rakenteet
SELECT 
  'genres' as table_name,
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'genres'
ORDER BY ordinal_position

UNION ALL

SELECT 
  'books' as table_name,
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'books'
ORDER BY ordinal_position;
