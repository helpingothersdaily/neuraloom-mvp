-- Cloudflare D1 migration (SQLite): components -> nests
-- Variant: branch_components has column `componentId`
-- Target:
--   components        -> nests
--   branch_components -> branch_nests
--   componentId       -> nestId
--   FK name intent: fk_branch_nests_nest_id (SQLite does not preserve FK names reliably)

PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

-- 1) Rename main table
ALTER TABLE components RENAME TO nests;

-- 2) Rename bridge table to a temporary name
ALTER TABLE branch_components RENAME TO branch_nests_old;

-- 3) Recreate bridge table with new naming
-- Adjust extra columns/types if your schema has more fields.
CREATE TABLE branch_nests (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL,
  nestId TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  CONSTRAINT fk_branch_nests_nest_id
    FOREIGN KEY (nestId) REFERENCES nests(id) ON DELETE CASCADE
);

-- 4) Copy existing data
INSERT INTO branch_nests (id, branch_id, nestId, created_at, updated_at)
SELECT id, branch_id, componentId, created_at, updated_at
FROM branch_nests_old;

-- 5) Drop old table
DROP TABLE branch_nests_old;

COMMIT;
PRAGMA foreign_keys=ON;

-- Optional checks
-- SELECT name FROM sqlite_master WHERE type='table' AND name IN ('nests','branch_nests');
-- PRAGMA table_info('branch_nests');
