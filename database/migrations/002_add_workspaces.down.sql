ALTER TABLE boards DROP CONSTRAINT IF EXISTS fk_boards_workspace;
DROP TABLE IF EXISTS workspace_members;
DROP TABLE IF EXISTS workspaces;
