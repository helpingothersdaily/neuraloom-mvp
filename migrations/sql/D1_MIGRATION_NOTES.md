# Cloudflare D1 migration notes

Use one of these files based on your current bridge-column naming:

- `2026-02-19_components_to_nests_d1_snake.sql` if the bridge table uses `component_id`
- `2026-02-19_components_to_nests_d1_camel.sql` if the bridge table uses `componentId`

## Run with Wrangler

```bash
wrangler d1 execute <DB_NAME> --file=migrations/sql/2026-02-19_components_to_nests_d1_snake.sql
```

or

```bash
wrangler d1 execute <DB_NAME> --file=migrations/sql/2026-02-19_components_to_nests_d1_camel.sql
```

## Quick inspect before running

```sql
PRAGMA table_info('branch_components');
```

Pick the migration that matches the column list.

## Rollback files

- `2026-02-19_nests_to_components_d1_snake_rollback.sql` (if current column is `nest_id`)
- `2026-02-19_nests_to_components_d1_camel_rollback.sql` (if current column is `nestId`)

Run the matching rollback with:

```bash
wrangler d1 execute <DB_NAME> --file=migrations/sql/2026-02-19_nests_to_components_d1_snake_rollback.sql
```

or

```bash
wrangler d1 execute <DB_NAME> --file=migrations/sql/2026-02-19_nests_to_components_d1_camel_rollback.sql
```
