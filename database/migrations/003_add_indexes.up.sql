CREATE INDEX IF NOT EXISTS idx_boards_workspace_id ON boards(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
