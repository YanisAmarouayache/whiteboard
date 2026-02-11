CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID,
  name TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  state JSONB NOT NULL DEFAULT '{"widgets":[]}'::jsonb,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
