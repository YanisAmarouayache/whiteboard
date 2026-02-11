INSERT INTO users (id, email, name, password_hash)
VALUES ('11111111-1111-1111-1111-111111111111', 'demo@example.com', 'Demo User', '$2a$10$demo')
ON CONFLICT (email) DO NOTHING;

INSERT INTO workspaces (id, name, owner_id)
VALUES ('22222222-2222-2222-2222-222222222222', 'Demo Workspace', '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

INSERT INTO workspace_members (workspace_id, user_id, role)
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'owner')
ON CONFLICT DO NOTHING;

INSERT INTO boards (id, workspace_id, name, version, state, created_by)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'Demo Board',
  1,
  '{"widgets":[{"id":"w1","type":"text","x":100,"y":120,"width":200,"height":120,"config":{"text":"Hello"}}]}'::jsonb,
  '11111111-1111-1111-1111-111111111111'
)
ON CONFLICT DO NOTHING;
