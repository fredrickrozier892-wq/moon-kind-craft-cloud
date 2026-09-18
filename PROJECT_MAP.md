# Project Map

## Current stage

Phase 1–7 MVP + onboarding, scoring editor, command palette, bulk actions, members.

## Implemented

- Landing and login (Google, X, email/password)
- Workspace shell: dashboard, tables, agents, audiences, signals, integrations, billing, settings
- Spreadsheet: edit, select, columns, sort, filter (AND/OR/NOT), search, resize, freeze, hide, reorder, CSV, undo/redo, virtualization
- Column types: text, number, email, phone, url, company, person, date, boolean, formula, enrichment, AI, score
- Mock providers with waterfall (DaData, SPARK, Kontur, HH)
- AI column via xAI with mock fallback
- Credits, audiences (apply as table filter), signals, CRM mock export, webhooks
- Templates and seed table of Russian B2B companies
- Onboarding wizard (goal → CSV / empty / template / demo)
- ICP scoring rules editor
- Command palette (⌘K)
- Keyboard shortcuts in the table
- Bulk row actions (enrich, AI, duplicate, CRM, delete)
- Enrichment fill rate in the table toolbar
- Workspace members (invite mock)
- Agent result write-back into a table
- One-shot undo for an enrichment/AI job

## In progress

- Real provider adapters (DaData live keys)

## Next

- Nested filter groups (groups inside groups)
- Real amoCRM / Bitrix24 OAuth
- Shared live presence

## Backlog

- Formula autocomplete as you type
- Column drag handle affordance
- Billing via YooKassa
- Column-level enrichment waterfall analytics chart

## Known bugs

- None recorded

## Technical debt

- Workspace persisted as a single JSONB document per user
- Enrichment runs sequentially on the client

## Architecture decisions

- Auth ON, data scoped by `user_id`
- Provider interface lives in `src/lib/services/mock/` so RealProvider can replace MockProvider
- Spreadsheet engine is client Zustand + debounce persist
- Onboarding is a workspace flag; existing saved workspaces skip it unless reset in Settings

## Important files

- `src/lib/workspace-store.ts` — product state
- `src/lib/services/mock/providers.ts` — enrichment
- `src/components/table/data-grid.tsx` — grid
- `src/components/onboarding/wizard.tsx` — first-run
- `src/components/command-palette.tsx` — ⌘K
- `src/lib/formulas.ts` — IF/CONCAT/SUM/…
- `src/lib/persist.ts` — load/save workspace
