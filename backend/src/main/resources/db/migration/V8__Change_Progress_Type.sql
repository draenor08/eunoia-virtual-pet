-- Change progress column from integer to text to support descriptive progress updates
ALTER TABLE users 
  ALTER COLUMN progress TYPE TEXT 
  USING progress::text;
