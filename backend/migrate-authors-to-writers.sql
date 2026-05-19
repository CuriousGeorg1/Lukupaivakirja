-- Migration script: Convert existing author strings to writers table
-- Run this AFTER creating the writers table

-- Step 1: Create writers table if not exists (should already exist from schema)
CREATE TABLE IF NOT EXISTS writers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- Step 2: Add writer_id column to books if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'books' AND column_name = 'writer_id'
  ) THEN
    ALTER TABLE books ADD COLUMN writer_id INTEGER REFERENCES writers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Step 3: Insert unique authors from books into writers table
INSERT INTO writers (name)
SELECT DISTINCT author 
FROM books 
WHERE author IS NOT NULL 
  AND author != ''
  AND NOT EXISTS (SELECT 1 FROM writers WHERE writers.name = books.author)
ORDER BY author;

-- Step 4: Update books to reference writers
UPDATE books
SET writer_id = writers.id
FROM writers
WHERE books.author = writers.name
  AND books.writer_id IS NULL;

-- Step 5: Verify migration
SELECT 
  'Books with writer_id' as status,
  COUNT(*) as count
FROM books 
WHERE writer_id IS NOT NULL

UNION ALL

SELECT 
  'Books without writer_id' as status,
  COUNT(*) as count
FROM books 
WHERE writer_id IS NULL

UNION ALL

SELECT 
  'Total writers' as status,
  COUNT(*) as count
FROM writers;

-- Note: The 'author' column is kept for backward compatibility
-- You can drop it later with: ALTER TABLE books DROP COLUMN author;
