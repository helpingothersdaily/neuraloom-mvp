-- Migration: Components -> Nests
-- Date: 2026-02-19
--
-- Targets from checklist:
--   tables: components -> nests, branch_components -> branch_nests
--   columns: component_id -> nest_id, componentId -> nestId
--   foreign key: fk_branch_components_component_id -> fk_branch_nests_nest_id
--
-- NOTE:
-- 1) Pick the section that matches your database engine.
-- 2) Run in a maintenance window or transaction-capable migration tool.
-- 3) If your schema differs, adjust names before execution.


/* ==========================================================
   PostgreSQL
   ========================================================== */

BEGIN;

-- 1) Rename tables
ALTER TABLE IF EXISTS components RENAME TO nests;
ALTER TABLE IF EXISTS branch_components RENAME TO branch_nests;

-- 2) Rename columns (snake_case and camelCase if present)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'branch_nests' AND column_name = 'component_id'
  ) THEN
    EXECUTE 'ALTER TABLE public.branch_nests RENAME COLUMN component_id TO nest_id';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'branch_nests' AND column_name = 'componentId'
  ) THEN
    EXECUTE 'ALTER TABLE public.branch_nests RENAME COLUMN "componentId" TO "nestId"';
  END IF;
END
$$;

-- 3) Rename FK constraint if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public'
      AND t.relname = 'branch_nests'
      AND c.conname = 'fk_branch_components_component_id'
  ) THEN
    EXECUTE 'ALTER TABLE public.branch_nests RENAME CONSTRAINT fk_branch_components_component_id TO fk_branch_nests_nest_id';
  END IF;
END
$$;

COMMIT;


/* ==========================================================
   MySQL 8+
   ========================================================== */

-- 1) Rename tables
RENAME TABLE components TO nests;
RENAME TABLE branch_components TO branch_nests;

-- 2) Rename columns
-- If `component_id` exists:
-- ALTER TABLE branch_nests RENAME COLUMN component_id TO nest_id;
-- If `componentId` exists:
-- ALTER TABLE branch_nests RENAME COLUMN componentId TO nestId;

-- 3) Rename FK (drop + re-add because MySQL does not support direct FK rename)
-- Replace data types/table names if your schema differs.
-- ALTER TABLE branch_nests DROP FOREIGN KEY fk_branch_components_component_id;
-- ALTER TABLE branch_nests
--   ADD CONSTRAINT fk_branch_nests_nest_id
--   FOREIGN KEY (nest_id) REFERENCES nests(id);


/* ==========================================================
   SQLite (manual strategy)
   ========================================================== */

-- SQLite has limited ALTER support for constraints.
-- Recommended approach:
-- 1) ALTER TABLE components RENAME TO nests;
-- 2) ALTER TABLE branch_components RENAME TO branch_nests;
-- 3) Recreate branch_nests with desired column names/constraints,
--    copy data from old table, drop old table, rename new table.
--
-- Example outline:
-- PRAGMA foreign_keys=OFF;
-- BEGIN TRANSACTION;
--
-- ALTER TABLE components RENAME TO nests;
-- ALTER TABLE branch_components RENAME TO branch_nests_old;
--
-- CREATE TABLE branch_nests (
--   id TEXT PRIMARY KEY,
--   branch_id TEXT NOT NULL,
--   nest_id TEXT NOT NULL,
--   FOREIGN KEY(nest_id) REFERENCES nests(id)
-- );
--
-- INSERT INTO branch_nests (id, branch_id, nest_id)
-- SELECT id, branch_id, component_id FROM branch_nests_old;
--
-- DROP TABLE branch_nests_old;
-- COMMIT;
-- PRAGMA foreign_keys=ON;


/* ==========================================================
   Post-migration checks (engine-agnostic intent)
   ========================================================== */

-- Verify tables
-- SELECT * FROM nests LIMIT 1;
-- SELECT * FROM branch_nests LIMIT 1;

-- Verify columns in bridge table
-- (Use your DB's information schema / pragma command)

-- Verify FK name (if your engine supports named constraints)
-- Expect: fk_branch_nests_nest_id
