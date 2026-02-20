-- Cloudflare D1 rollback (SQLite): nests -> components
-- Variant: branch_nests has column `nestId`
-- Reverts:
--   nests         -> components
--   branch_nests  -> branch_components
--   nestId        -> componentId

PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

-- 1) Rename main table back
ALTER TABLE nests RENAME TO components;

-- 2) Rename bridge table to temp
ALTER TABLE branch_nests RENAME TO branch_components_old;

-- 3) Recreate bridge table with old naming
-- Adjust extra columns/types if your schema differs.
CREATE TABLE branch_components (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL,
  componentId TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  CONSTRAINT fk_branch_components_component_id
    FOREIGN KEY (componentId) REFERENCES components(id) ON DELETE CASCADE
);

-- 4) Copy data back
INSERT INTO branch_components (id, branch_id, componentId, created_at, updated_at)
SELECT id, branch_id, nestId, created_at, updated_at
FROM branch_components_old;

-- 5) Drop temp
DROP TABLE branch_components_old;

COMMIT;
PRAGMA foreign_keys=ON;

-- Optional checks
-- SELECT name FROM sqlite_master WHERE type='table' AND name IN ('components','branch_components');
-- PRAGMA table_info('branch_components');
