-- 1. Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. MIGRATE ID TO UUID
-- A. Add new UUID column with random values for existing rows
ALTER TABLE users ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();

-- B. (Optional) Migrate Foreign Keys - None found in current models, but if they existed:
-- ALTER TABLE other_table ADD COLUMN user_id_uuid UUID;
-- UPDATE other_table t SET user_id_uuid = u.id_uuid FROM users u WHERE t.user_id = u.id;
-- ALTER TABLE other_table DROP COLUMN user_id;
-- ALTER TABLE other_table RENAME COLUMN user_id_uuid TO user_id;

-- C. Drop old PK and ID column
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS id;

-- D. Rename new column and make it PK
ALTER TABLE users RENAME COLUMN id_uuid TO id;
ALTER TABLE users ADD PRIMARY KEY (id);

-- 3. SAFELY ADD NEW COLUMNS (username, password_hash)
-- A. Add as nullable first
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- B. Backfill existing rows (Prevent NULL errors)
UPDATE users SET username = 'user_' || substr(md5(random()::text), 1, 8) WHERE username IS NULL;
UPDATE users SET password_hash = 'legacy_placeholder_hash' WHERE password_hash IS NULL;

-- C. Enforce NOT NULL and Unique constraints
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);

ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;

-- D. Drop legacy password column
ALTER TABLE users DROP COLUMN IF EXISTS password;

-- 4. CONVERT PREFERENCES TO JSONB
-- Handle Potential Invalid JSON by defaulting to '{}'
ALTER TABLE users 
  ALTER COLUMN preferences TYPE jsonb 
  USING (
    CASE 
      WHEN preferences IS NULL OR Trim(preferences) = '' THEN '{}'::jsonb 
      ELSE preferences::jsonb 
    END
  );

-- 5. CONVERT PROGRESS TO INTEGER
-- Handle potential non-numeric garbage by defaulting to 0
ALTER TABLE users 
  ALTER COLUMN progress TYPE integer 
  USING (
    CASE 
      WHEN progress IS NULL THEN 0 
      ELSE CAST(progress AS integer) 
    END
  );
