import { create } from "zustand";
import { parseCsv } from "./csv";
import { emptyFilterGroup } from "./filters";
import { recalcRow } from "./formulas";
import { loadWorkspace, saveWorkspace } from "./persist";
import { createEmptyWorkspace, createTableFromTemplate, hydrateWorkspace } from "./seed";
import { completeAiCell } from "./services/ai";
import { interpolatePrompt, mockAiComplete, mockAgentRun } from "./services/mock/ai";
import { runWaterfall } from "./services/mock/providers";
import { makeSignal } from "./services/mock/signals";
import type {
  Audience,
  CellValue,
  Column,
  ColumnType,
  Credits,
  EnrichmentConfig,
  FilterGroup,
  MemberRole,
  Primitive,
  Row,
  SignalKind,
  SortSpec,
  TableDoc,
  WebhookEvent,
  WorkspaceDoc,
  WorkspaceMember,
} from "./types";
import { nid } from "./utils";

const MAX_HISTORY = 40;
const SAVE_MS = 700;

function touch(table: TableDoc): TableDoc {
  return { ...table, updatedAt: new Date().toISOString() };
}

function mapTable(ws: WorkspaceDoc, tableId: string, fn: (t: TableDoc) => TableDoc): WorkspaceDoc {
  return {
    ...ws,
    tables: ws.tables.map((t) => (t.id === tableId ? touch(fn(t)) : t)),
  };
}

function activity(ws: WorkspaceDoc, text: string): WorkspaceDoc {
  return {
    ...ws,
    activity: [
      { id: nid("ac"), text, createdAt: new Date().toISOString() },
      ...ws.activity,
    ].slice(0, 40),
  };
}

function spend(ws: WorkspaceDoc, bucket: keyof Credits, amount: number, reason: string): WorkspaceDoc {
  const next = Math.max(0, ws.credits[bucket] - amount);
  return {
    ...ws,
    credits: { ...ws.credits, [bucket]: next },
    creditLog: [
      {
        id: nid("tx"),
        bucket,
        amount: -amount,
        reason,
        createdAt: new Date().toISOString(),
      },
      ...ws.creditLog,
    ].slice(0, 80),
  };
}

function emptyCell(): CellValue {
  return { value: null, status: "empty" };
}

function valueCell(value: Primitive): CellValue {
  if (value == null || value === "") return emptyCell();
  return { value, display: String(value), status: "success" };
}

function recalcTable(table: TableDoc): TableDoc {
  return { ...table, rows: table.rows.map((r) => recalcRow(r, table.columns)) };
}

type Store = {
  workspace: WorkspaceDoc | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  search: string;
  selectedRowIds: string[];
  past: WorkspaceDoc[];
  future: WorkspaceDoc[];
  bootstrap: () => Promise<void>;
  persistSoon: () => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  setSearch: (q: string) => void;
  setSelected: (ids: string[]) => void;
  patch: (fn: (ws: WorkspaceDoc) => WorkspaceDoc, history?: boolean) => void;
  createTable: (opts: { name: string; templateId?: string; empty?: boolean }) => string;
  renameTable: (id: string, name: string) => void;
  deleteTable: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addColumn: (tableId: string, column: Column) => void;
  updateColumn: (tableId: string, columnId: string, patch: Partial<Column>) => void;
  deleteColumn: (tableId: string, columnId: string) => void;
  resizeColumn: (tableId: string, columnId: string, width: number) => void;
  reorderColumn: (tableId: string, fromId: string, toId: string) => void;
  addRow: (tableId: string) => void;
  updateCell: (tableId: string, rowId: string, columnId: string, value: Primitive) => void;
  deleteRows: (tableId: string, rowIds: string[]) => void;
  duplicateRows: (tableId: string, rowIds: string[]) => void;
  importCsv: (tableId: string, text: string) => { rows: number };
  setFilters: (tableId: string, filters: FilterGroup) => void;
  setSort: (tableId: string, sort: SortSpec | null) => void;
  runEnrichment: (tableId: string, columnId: string, rowIds?: string[]) => Promise<void>;
  runAiColumn: (tableId: string, columnId: string, rowIds?: string[]) => Promise<void>;
  createAudience: (input: { name: string; tableId: string; filters: FilterGroup }) => void;
  deleteAudience: (id: string) => void;
  applyAudience: (id: string) => string | undefined;
  toggleIntegration: (id: string) => void;
  exportToIntegration: (id: string, count: number) => void;
  addWebhook: (url: string, events: WebhookEvent[]) => void;
  testWebhook: (id: string) => Promise<{ ok: boolean }>;
  deleteWebhook: (id: string) => void;
  toggleWebhook: (id: string) => void;
  runAgent: (id: string, company: string) => Promise<void>;
  createAgent: (agent: Omit<WorkspaceDoc["agents"][number], "id" | "status">) => void;
  deleteAgent: (id: string) => void;
  ingestAgentResult: (tableId: string, company: string, json: string) => void;
  markSignalRead: (id: string) => void;
  addSignal: (company: string, kind: SignalKind, tableId?: string) => void;
  completeOnboarding: (goal: string, tableId?: string) => void;
  resetOnboarding: () => void;
  setPlan: (plan: WorkspaceDoc["plan"]) => void;
  renameWorkspace: (name: string) => void;
  addCredits: (bucket: keyof Credits, amount: number) => void;
  inviteMember: (input: { name: string; email: string; role: MemberRole }) => void;
  removeMember: (id: string) => void;
  setMemberRole: (id: string, role: MemberRole) => void;
};

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export const useWorkspace = create<Store>((set, get) => ({
  workspace: null,
  loading: true,
  error: null,
  saving: false,
  search: "",
  selectedRowIds: [],
  past: [],
  future: [],

  persistSoon: () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      const ws = get().workspace;
      if (!ws) return;
      set({ saving: true });
      try {
        await saveWorkspace({ data: { workspace: ws } });
      } catch {
        /* keep working offline in the session */
      } finally {
        set({ saving: false });
      }
    }, SAVE_MS);
  },

  pushHistory: () => {
    const ws = get().workspace;
    if (!ws) return;
    set({
      past: [...get().past, structuredClone(ws)].slice(-MAX_HISTORY),
      future: [],
    });
  },

  undo: () => {
    const { past, workspace, future } = get();
    const prev = past[past.length - 1];
    if (!prev || !workspace) return;
    set({
      workspace: prev,
      past: past.slice(0, -1),
      future: [...future, workspace],
    });
    get().persistSoon();
  },

  redo: () => {
    const { future, workspace, past } = get();
    const next = future[future.length - 1];
    if (!next || !workspace) return;
    set({
      workspace: next,
      future: future.slice(0, -1),
      past: [...past, workspace],
    });
    get().persistSoon();
  },

  bootstrap: async () => {
    set({ loading: true, error: null });
    try {
      const existing = await loadWorkspace();
      const workspace = hydrateWorkspace(existing ?? createEmptyWorkspace());
      set({ workspace, loading: false });
      if (!existing) get().persistSoon();
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Не удалось загрузить пространство",
        workspace: createEmptyWorkspace(),
      });
    }
  },

  setSearch: (q) => set({ search: q }),
  setSelected: (ids) => set({ selectedRowIds: ids }),

  patch: (fn, history = true) => {
    const ws = get().workspace;
    if (!ws) return;
    if (history) get().pushHistory();
    set({ workspace: fn(ws) });
    get().persistSoon();
  },

  createTable: ({ name, templateId, empty }) => {
    const id = nid("tbl");
    get().patch((ws) => {
      const table = templateId
        ? createTableFromTemplate(templateId, name)
        : {
            id,
            name,
            description: "",
            favorite: false,
            columns: empty
              ? [
                  {
                    id: nid("col"),
                    name: "Компания",
                    type: "company" as ColumnType,
                    width: 220,
                    frozen: true,
                  },
                ]
              : createTableFromTemplate("lead-gen", name).columns,
            rows: [],
            filters: emptyFilterGroup(),
            sorts: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
      const created = { ...table, id: table.id || id, name };
      return activity({ ...ws, tables: [created, ...ws.tables] }, `Создана таблица «${name}»`);
    });
    const tables = get().workspace?.tables ?? [];
    return tables[0]?.id ?? id;
  },

  renameTable: (id, name) =>
    get().patch((ws) => mapTable(ws, id, (t) => ({ ...t, name }))),

  deleteTable: (id) =>
    get().patch((ws) =>
      activity(
        { ...ws, tables: ws.tables.filter((t) => t.id !== id) },
        "Таблица удалена",
      ),
    ),

  toggleFavorite: (id) =>
    get().patch((ws) => mapTable(ws, id, (t) => ({ ...t, favorite: !t.favorite })), false),

  addColumn: (tableId, column) =>
    get().patch((ws) =>
      mapTable(ws, tableId, (t) =>
        recalcTable({
          ...t,
          columns: [...t.columns, column],
          rows: t.rows.map((r) => ({
            ...r,
            cells: { ...r.cells, [column.id]: emptyCell() },
          })),
        }),
      ),
    ),

  updateColumn: (tableId, columnId, patch) =>
    get().patch((ws) =>
      mapTable(ws, tableId, (t) =>
        recalcTable({
          ...t,
          columns: t.columns.map((c) => (c.id === columnId ? { ...c, ...patch } : c)),
        }),
      ),
    ),

  deleteColumn: (tableId, columnId) =>
    get().patch((ws) =>
      mapTable(ws, tableId, (t) => ({
        ...t,
        columns: t.columns.filter((c) => c.id !== columnId),
        rows: t.rows.map((r) => {
          const cells = { ...r.cells };
          delete cells[columnId];
          return { ...r, cells };
        }),
      })),
    ),

  resizeColumn: (tableId, columnId, width) =>
    get().patch(
      (ws) =>
        mapTable(ws, tableId, (t) => ({
          ...t,
          columns: t.columns.map((c) =>
            c.id === columnId ? { ...c, width: Math.max(72, Math.min(480, width)) } : c,
          ),
        })),
      false,
    ),

  reorderColumn: (tableId, fromId, toId) => {
    if (fromId === toId) return;
    get().patch((ws) =>
      mapTable(ws, tableId, (t) => {
        const from = t.columns.findIndex((c) => c.id === fromId);
        const to = t.columns.findIndex((c) => c.id === toId);
        if (from < 0 || to < 0) return t;
        const columns = [...t.columns];
        const [item] = columns.splice(from, 1);
        if (!item) return t;
        columns.splice(to, 0, item);
        return { ...t, columns };
      }),
    );
  },

  addRow: (tableId) =>
    get().patch((ws) =>
      mapTable(ws, tableId, (t) => {
        const row: Row = {
          id: nid("row"),
          createdAt: new Date().toISOString(),
          cells: Object.fromEntries(t.columns.map((c) => [c.id, emptyCell()])),
        };
        return { ...t, rows: [...t.rows, recalcRow(row, t.columns)] };
      }),
    ),

  updateCell: (tableId, rowId, columnId, value) =>
    get().patch((ws) =>
      mapTable(ws, tableId, (t) => ({
        ...t,
        rows: t.rows.map((r) =>
          r.id === rowId
            ? recalcRow(
                { ...r, cells: { ...r.cells, [columnId]: valueCell(value) } },
                t.columns,
              )
            : r,
        ),
      })),
    ),

  deleteRows: (tableId, rowIds) => {
    const setIds = new Set(rowIds);
    get().patch((ws) =>
      mapTable(ws, tableId, (t) => ({
        ...t,
        rows: t.rows.filter((r) => !setIds.has(r.id)),
      })),
    );
    set({ selectedRowIds: [] });
  },

  duplicateRows: (tableId, rowIds) => {
    const setIds = new Set(rowIds);
    get().patch((ws) =>
      mapTable(ws, tableId, (t) => {
        const copies: Row[] = t.rows
          .filter((r) => setIds.has(r.id))
          .map((r) => ({
            id: nid("row"),
            createdAt: new Date().toISOString(),
            cells: structuredClone(r.cells),
          }));
        return { ...t, rows: [...t.rows, ...copies] };
      }),
    );
  },

  importCsv: (tableId, text) => {
    const grid = parseCsv(text);
    const headers = grid[0] ?? [];
    const body = grid.slice(1);
    get().patch((ws) =>
      mapTable(ws, tableId, (t) => {
        let columns = [...t.columns];
        const index: number[] = headers.map((h) => {
          const existing = columns.find(
            (c) => c.name.toLowerCase() === h.trim().toLowerCase(),
          );
          if (existing) return columns.indexOf(existing);
          const c: Column = {
            id: nid("col"),
            name: h.trim() || "Колонка",
            type: "text",
            width: 160,
          };
          columns = [...columns, c];
          return columns.length - 1;
        });
        const rows: Row[] = body.map((line) => {
          const cells: Record<string, CellValue> = {};
          for (const c of columns) cells[c.id] = emptyCell();
          line.forEach((v, i) => {
            const col = columns[index[i] ?? -1];
            if (!col) return;
            const num = Number(v.replace(/\s/g, "").replace(",", "."));
            cells[col.id] = valueCell(
              col.type === "number" && v && Number.isFinite(num) ? num : v,
            );
          });
          return recalcRow(
            { id: nid("row"), cells, createdAt: new Date().toISOString() },
            columns,
          );
        });
        return { ...t, columns, rows: [...t.rows, ...rows] };
      }),
    );
    return { rows: body.length };
  },

  setFilters: (tableId, filters) =>
    get().patch((ws) => mapTable(ws, tableId, (t) => ({ ...t, filters })), false),

  setSort: (tableId, sort) =>
    get().patch(
      (ws) =>
        mapTable(ws, tableId, (t) => ({
          ...t,
          sorts: sort ? [sort] : [],
        })),
      false,
    ),

  runEnrichment: async (tableId, columnId, rowIds) => {
    const ws = get().workspace;
    const table = ws?.tables.find((t) => t.id === tableId);
    const column = table?.columns.find((c) => c.id === columnId);
    if (!ws || !table || !column?.enrichment) return;
    const cfg: EnrichmentConfig = column.enrichment;
    const targets = table.rows.filter((r) => !rowIds || rowIds.includes(r.id));
    get().pushHistory();
    get().patch((cur) => {
      let next = mapTable(cur, tableId, (t) => ({
        ...t,
        rows: t.rows.map((r) =>
          targets.some((x) => x.id === r.id)
            ? {
                ...r,
                cells: {
                  ...r.cells,
                  [columnId]: { value: r.cells[columnId]?.value ?? null, status: "loading" },
                },
              }
            : r,
        ),
      }));
      next = activity(next, `Запущено обогащение «${column.name}» · ${targets.length} строк`);
      return next;
    }, false);

    let spent = 0;
    let found = 0;
    for (const row of targets) {
      const q = String(row.cells[cfg.inputColumnId]?.value ?? "");
      const res = await runWaterfall(cfg.providers, {
        intent: cfg.intent,
        query: q,
        company: q,
      });
      spent += res.cost;
      if (res.ok) found += 1;
      get().patch((cur) => {
        let next = mapTable(cur, tableId, (t) => ({
          ...t,
          rows: t.rows.map((r) =>
            r.id === row.id
              ? recalcRow(
                  {
                    ...r,
                    cells: {
                      ...r.cells,
                      [columnId]: {
                        value: res.value,
                        display: res.display ?? (res.value == null ? "" : String(res.value)),
                        status: res.ok ? "success" : "error",
                        provider: res.provider,
                        credits: res.cost,
                        error: res.error,
                      },
                    },
                  },
                  t.columns,
                )
              : r,
          ),
        }));
        if (res.cost) next = spend(next, "data", res.cost, `${column.name}: ${q || "строка"}`);
        return next;
      }, false);
    }
    get().patch(
      (cur) =>
        activity(cur, `Обогащение «${column.name}»: ${found}/${targets.length}, −${spent} кр.`),
      false,
    );
  },

  runAiColumn: async (tableId, columnId, rowIds) => {
    const ws = get().workspace;
    const table = ws?.tables.find((t) => t.id === tableId);
    const column = table?.columns.find((c) => c.id === columnId);
    if (!ws || !table || !column?.ai) return;
    const targets = table.rows.filter((r) => !rowIds || rowIds.includes(r.id));
    get().pushHistory();
    get().patch(
      (cur) =>
        mapTable(cur, tableId, (t) => ({
          ...t,
          rows: t.rows.map((r) =>
            targets.some((x) => x.id === r.id)
              ? {
                  ...r,
                  cells: {
                    ...r.cells,
                    [columnId]: { value: r.cells[columnId]?.value ?? null, status: "loading" },
                  },
                }
              : r,
          ),
        })),
      false,
    );

    for (const row of targets) {
      const prompt = column.ai.prompt;
      const context = interpolatePrompt(
        table.columns.map((c) => `${c.name}: {{${c.name}}}`).join("\n"),
        row,
        table.columns,
      );
      let value: Primitive;
      let display: string;
      let explanation: string | undefined;
      try {
        const res = await completeAiCell({ data: { prompt, context } });
        if (res.ok) {
          const text = res.text;
          const num = text.match(/\b(\d{1,3})\b/);
          value = num ? Number(num[1]) : text;
          display = text;
          explanation = text;
        } else {
          const mock = mockAiComplete(prompt, row, table.columns);
          value = mock.value;
          display = mock.display;
          explanation = mock.explanation;
        }
      } catch {
        const mock = mockAiComplete(prompt, row, table.columns);
        value = mock.value;
        display = mock.display;
        explanation = mock.explanation;
      }
      get().patch((cur) => {
        let next = mapTable(cur, tableId, (t) => ({
          ...t,
          rows: t.rows.map((r) =>
            r.id === row.id
              ? recalcRow(
                  {
                    ...r,
                    cells: {
                      ...r.cells,
                      [columnId]: {
                        value,
                        display: String(display),
                        status: "success",
                        explanation,
                        credits: 4,
                      },
                    },
                  },
                  t.columns,
                )
              : r,
          ),
        }));
        next = spend(next, "ai", 4, `AI · ${column.name}`);
        return next;
      }, false);
    }
  },

  createAudience: (input) =>
    get().patch((ws) => {
      const aud: Audience = { ...input, id: nid("aud"), createdAt: new Date().toISOString() };
      return activity({ ...ws, audiences: [aud, ...ws.audiences] }, `Аудитория «${input.name}»`);
    }),

  deleteAudience: (id) =>
    get().patch((ws) => ({ ...ws, audiences: ws.audiences.filter((a) => a.id !== id) })),

  applyAudience: (id) => {
    const a = get().workspace?.audiences.find((x) => x.id === id);
    if (!a) return undefined;
    get().setFilters(a.tableId, a.filters);
    return a.tableId;
  },

  toggleIntegration: (id) =>
    get().patch((ws) => ({
      ...ws,
      integrations: ws.integrations.map((i) =>
        i.id === id ? { ...i, connected: !i.connected } : i,
      ),
    })),

  exportToIntegration: (id, count) =>
    get().patch((ws) => {
      let next: WorkspaceDoc = {
        ...ws,
        integrations: ws.integrations.map((i) =>
          i.id === id
            ? { ...i, lastExportAt: new Date().toISOString(), lastCount: count }
            : i,
        ),
      };
      next = spend(next, "actions", Math.max(1, Math.round(count / 10)), "Экспорт в CRM");
      const name = ws.integrations.find((i) => i.id === id)?.name ?? "CRM";
      return activity(next, `✓ ${count} контактов отправлено в ${name}`);
    }),

  addWebhook: (url, events) =>
    get().patch((ws) => ({
      ...ws,
      webhooks: [
        { id: nid("wh"), url, events, enabled: true },
        ...ws.webhooks,
      ],
    })),

  testWebhook: async (id) => {
    await new Promise((r) => setTimeout(r, 400));
    const ok = true;
    get().patch((ws) => ({
      ...ws,
      webhooks: ws.webhooks.map((w) =>
        w.id === id
          ? { ...w, lastTestAt: new Date().toISOString(), lastStatus: ok ? "ok" : "error" }
          : w,
      ),
    }));
    return { ok };
  },

  deleteWebhook: (id) =>
    get().patch((ws) => ({ ...ws, webhooks: ws.webhooks.filter((w) => w.id !== id) })),

  toggleWebhook: (id) =>
    get().patch((ws) => ({
      ...ws,
      webhooks: ws.webhooks.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)),
    })),

  runAgent: async (id, company) => {
    get().patch(
      (ws) => ({
        ...ws,
        agents: ws.agents.map((a) => (a.id === id ? { ...a, status: "running" } : a)),
      }),
      false,
    );
    await new Promise((r) => setTimeout(r, 900));
    const agent = get().workspace?.agents.find((a) => a.id === id);
    if (!agent) return;
    const result = mockAgentRun(
      agent.goal,
      agent.tasks.map((t) => t.title),
      company,
    );
    get().patch((ws) => {
      let next: WorkspaceDoc = {
        ...ws,
        agents: ws.agents.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "done",
                lastRunAt: new Date().toISOString(),
                lastResult: result,
              }
            : a,
        ),
      };
      next = spend(next, "ai", 12, `Агент «${agent.name}»`);
      return activity(next, `Агент «${agent.name}» обработал ${company}`);
    });
  },

  createAgent: (agent) =>
    get().patch((ws) => ({
      ...ws,
      agents: [{ ...agent, id: nid("ag"), status: "idle" }, ...ws.agents],
    })),

  deleteAgent: (id) =>
    get().patch((ws) => ({ ...ws, agents: ws.agents.filter((a) => a.id !== id) })),

  ingestAgentResult: (tableId, company, json) =>
    get().patch((ws) =>
      mapTable(ws, tableId, (t) => {
        let columns = t.columns;
        let note = columns.find((c) => c.name === "Исследование");
        if (!note) {
          note = { id: nid("col"), name: "Исследование", type: "text", width: 280 };
          columns = [...columns, note];
        }
        const companyCol = columns.find((c) => c.type === "company") ?? columns[0];
        const row: Row = {
          id: nid("row"),
          createdAt: new Date().toISOString(),
          cells: Object.fromEntries(columns.map((c) => [c.id, emptyCell()])),
        };
        if (companyCol) row.cells[companyCol.id] = valueCell(company);
        row.cells[note.id] = valueCell(json);
        return recalcTable({ ...t, columns, rows: [...t.rows, row] });
      }),
    ),

  markSignalRead: (id) =>
    get().patch(
      (ws) => ({
        ...ws,
        signals: ws.signals.map((s) => (s.id === id ? { ...s, read: true } : s)),
      }),
      false,
    ),

  addSignal: (company, kind, tableId) =>
    get().patch((ws) => ({
      ...ws,
      signals: [makeSignal(company, kind, 0, tableId), ...ws.signals],
    })),

  completeOnboarding: (goal, tableId) =>
    get().patch((ws) => ({
      ...ws,
      onboardingComplete: true,
      onboardingGoal: goal,
      tables: tableId
        ? ws.tables
        : ws.tables.length
          ? ws.tables
          : [createTableFromTemplate("lead-gen", "Моя первая таблица"), ...ws.tables],
    })),

  resetOnboarding: () =>
    get().patch((ws) => ({ ...ws, onboardingComplete: false }), false),

  setPlan: (plan) => get().patch((ws) => ({ ...ws, plan })),

  renameWorkspace: (name) => get().patch((ws) => ({ ...ws, name })),

  addCredits: (bucket, amount) =>
    get().patch((ws) => ({
      ...ws,
      credits: { ...ws.credits, [bucket]: ws.credits[bucket] + amount },
      creditLog: [
        {
          id: nid("tx"),
          bucket,
          amount,
          reason: "Пополнение",
          createdAt: new Date().toISOString(),
        },
        ...ws.creditLog,
      ],
    })),

  inviteMember: ({ name, email, role }) =>
    get().patch((ws) => {
      const member: WorkspaceMember = {
        id: nid("mb"),
        name: name.trim() || email.split("@")[0] || "Участник",
        email: email.trim(),
        role,
        status: "invited",
        invitedAt: new Date().toISOString(),
      };
      return activity(
        { ...ws, members: [...ws.members, member] },
        `Приглашён ${member.email || member.name}`,
      );
    }),

  removeMember: (id) =>
    get().patch((ws) => ({
      ...ws,
      members: ws.members.filter((m) => m.id !== id || m.role === "owner"),
    })),

  setMemberRole: (id, role) =>
    get().patch((ws) => ({
      ...ws,
      members: ws.members.map((m) =>
        m.id === id && m.role !== "owner" ? { ...m, role } : m,
      ),
    })),
}));

export function useTable(tableId: string | undefined): TableDoc | undefined {
  return useWorkspace((s) => s.workspace?.tables.find((t) => t.id === tableId));
}
