-- Workspace-scoped product data. One row per authenticated user.
-- The JSON document holds tables, columns, rows, agents, audiences,
-- signals, integrations, credits and activity so the spreadsheet engine
-- can persist without an EAV schema. Isolated strictly by user_id.
create table if not exists workspaces (
  user_id    text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
