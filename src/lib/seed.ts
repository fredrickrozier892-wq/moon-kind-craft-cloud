import { emptyFilterGroup } from "./filters";
import { recalcRow } from "./formulas";
import { makeSignal } from "./services/mock/signals";
import { REGISTRY } from "./services/mock/providers";
import { col, TABLE_TEMPLATES } from "./templates";
import type {
  CellValue,
  Column,
  Credits,
  Row,
  TableDoc,
  WorkspaceDoc,
  WorkspaceMember,
} from "./types";
import { nid } from "./utils";

function nowIso(daysAgo = 0): string {
  return new Date(Date.now() - daysAgo * 86400_000).toISOString();
}

function cell(value: string | number | boolean | null): CellValue {
  if (value == null || value === "") {
    return { value: null, status: "empty" };
  }
  return { value, display: String(value), status: "success" };
}

function makeRow(
  columns: Column[],
  values: Record<string, string | number | boolean | null>,
): Row {
  const cells: Record<string, CellValue> = {};
  for (const c of columns) {
    const v = values[c.name];
    cells[c.id] = v === undefined ? { value: null, status: "empty" } : cell(v);
  }
  const row: Row = { id: nid("row"), cells, createdAt: nowIso() };
  return recalcRow(row, columns);
}

function ownerMember(): WorkspaceMember {
  return {
    id: nid("mb"),
    name: "Владелец",
    email: "",
    role: "owner",
    status: "active",
    invitedAt: nowIso(12),
  };
}

export function hydrateWorkspace(raw: WorkspaceDoc): WorkspaceDoc {
  return {
    ...raw,
    members: raw.members?.length ? raw.members : [ownerMember()],
    onboardingComplete: raw.onboardingComplete ?? true,
    tables: raw.tables ?? [],
    agents: raw.agents ?? [],
    audiences: raw.audiences ?? [],
    signals: raw.signals ?? [],
    integrations: raw.integrations ?? [],
    webhooks: raw.webhooks ?? [],
    activity: raw.activity ?? [],
    creditLog: raw.creditLog ?? [],
    credits: raw.credits ?? { data: 0, ai: 0, actions: 0 },
  };
}

export function createEmptyWorkspace(): WorkspaceDoc {
  const companyCol = col("Компания", "company", 220, { frozen: true });
  const innCol = col("ИНН", "text", 128);
  const siteCol = col("Сайт", "url", 180);
  const emailCol = col("Email", "email", 210);
  const phoneCol = col("Телефон", "enrichment", 150, {
    enrichment: {
      intent: "phone",
      providers: ["dadata", "spark"],
      inputColumnId: companyCol.id,
    },
  });
  const industryCol = col("Отрасль", "text", 170);
  const empCol = col("Сотрудники", "number", 128);
  const revCol = col("Выручка, млрд", "number", 140);
  const segmentCol = col("Сегмент", "formula", 140, {
    formula: `=IF({Сотрудники} > 500, "Enterprise", "SMB")`,
  });
  const scoreCol = col("ICP Score", "score", 120, {
    score: {
      rules: [
        { id: nid("sr"), label: "Штат > 500", columnId: empCol.id, op: "gt", value: 500, points: 20 },
        { id: nid("sr"), label: "Выручка > 20", columnId: revCol.id, op: "gt", value: 20, points: 20 },
        {
          id: nid("sr"),
          label: "SaaS / интернет / финтех",
          columnId: industryCol.id,
          op: "contains",
          value: "SaaS",
          points: 15,
        },
        { id: nid("sr"), label: "Email найден", columnId: emailCol.id, op: "not_empty", points: 10 },
        { id: nid("sr"), label: "Сайт найден", columnId: siteCol.id, op: "not_empty", points: 10 },
        { id: nid("sr"), label: "Телефон найден", columnId: phoneCol.id, op: "not_empty", points: 10 },
      ],
    },
  });
  const aiCol = col("AI Fit", "ai", 110, {
    ai: {
      prompt:
        "Оцени компанию по шкале 1-100. Учитывай размер, отрасль, наличие отдела продаж и соответствие ICP B2B SaaS.",
    },
  });

  const columns: Column[] = [
    companyCol,
    innCol,
    siteCol,
    emailCol,
    phoneCol,
    industryCol,
    empCol,
    revCol,
    segmentCol,
    scoreCol,
    aiCol,
  ];

  const rows = REGISTRY.map((r) =>
    makeRow(columns, {
      Компания: r.name,
      ИНН: r.inn,
      Сайт: r.website,
      Email: r.email,
      Отрасль: r.industry,
      Сотрудники: r.employees,
      "Выручка, млрд": r.revenue,
    }),
  );

  const tableId = nid("tbl");
  const table: TableDoc = {
    id: tableId,
    name: "Компании — ICP 2026",
    description: "Основной список для квалификации российского B2B",
    favorite: true,
    template: "lead-gen",
    columns,
    rows,
    filters: emptyFilterGroup(),
    sorts: [{ columnId: scoreCol.id, dir: "desc" }],
    createdAt: nowIso(12),
    updatedAt: nowIso(),
  };

  const credits: Credits = { data: 8420, ai: 2130, actions: 1000 };

  return {
    id: nid("ws"),
    name: "Рабочее пространство",
    plan: "launch",
    credits,
    onboardingComplete: false,
    tables: [table],
    agents: [
      {
        id: nid("ag"),
        name: "Lead Researcher",
        goal: "Найти потенциальных клиентов и собрать карточку",
        input: "Company",
        tasks: [
          { id: nid("tk"), title: "Найти сайт" },
          { id: nid("tk"), title: "Определить отрасль" },
          { id: nid("tk"), title: "Найти размер компании" },
          { id: nid("tk"), title: "Определить ICP fit" },
          { id: nid("tk"), title: "Дать объяснение" },
        ],
        output: "json",
        status: "idle",
      },
    ],
    audiences: [
      {
        id: nid("aud"),
        name: "Enterprise SaaS",
        tableId,
        filters: {
          id: nid("fg"),
          kind: "group",
          combinator: "and",
          children: [
            {
              id: nid("fc"),
              kind: "cond",
              columnId: empCol.id,
              op: "gt",
              value: 500,
            },
            {
              id: nid("fc"),
              kind: "cond",
              columnId: scoreCol.id,
              op: "gte",
              value: 40,
            },
            {
              id: nid("fc"),
              kind: "cond",
              columnId: emailCol.id,
              op: "not_empty",
            },
          ],
        },
        createdAt: nowIso(3),
      },
    ],
    signals: [
      makeSignal("VK", "job", 2, tableId, rows[1]?.id),
      makeSignal("Яндекс", "tender", 5, tableId, rows[0]?.id),
      makeSignal("Ozon", "executive", 9, tableId),
      makeSignal("СКБ Контур", "okved", 14, tableId),
      makeSignal("Т-Банк", "mention", 20, tableId),
      makeSignal("Positive Technologies", "job", 28, tableId),
    ],
    integrations: [
      { id: nid("int"), provider: "amocrm", name: "amoCRM", connected: false },
      { id: nid("int"), provider: "bitrix24", name: "Bitrix24", connected: false },
      { id: nid("int"), provider: "1c", name: "1С", connected: false },
      { id: nid("int"), provider: "telegram", name: "Telegram", connected: false },
      { id: nid("int"), provider: "vk", name: "VK", connected: false },
      { id: nid("int"), provider: "email", name: "Email", connected: true },
      { id: nid("int"), provider: "webhook", name: "Webhooks", connected: true },
    ],
    webhooks: [
      {
        id: nid("wh"),
        url: "https://example.com/webhook",
        events: ["enrichment_completed", "signal_detected"],
        enabled: true,
      },
    ],
    activity: [
      { id: nid("ac"), text: "Создана таблица «Компании — ICP 2026»", createdAt: nowIso(12) },
      { id: nid("ac"), text: "Импортировано 24 компании", createdAt: nowIso(12) },
      { id: nid("ac"), text: "Добавлена формула сегмента Enterprise / SMB", createdAt: nowIso(4) },
      { id: nid("ac"), text: "Собрана аудитория Enterprise SaaS", createdAt: nowIso(3) },
      { id: nid("ac"), text: "Сигнал: VK — новая вакансия Sales Manager", createdAt: nowIso(0) },
    ],
    creditLog: [
      {
        id: nid("tx"),
        bucket: "data",
        amount: -24,
        reason: "Обогащение карточек компаний",
        createdAt: nowIso(6),
      },
    ],
    members: [ownerMember()],
  };
}

export function createTableFromTemplate(
  templateId: string,
  name?: string,
): TableDoc {
  const t = TABLE_TEMPLATES.find((x) => x.id === templateId) ?? TABLE_TEMPLATES[0]!;
  const columns = t.columns();
  return {
    id: nid("tbl"),
    name: name ?? t.name,
    description: t.description,
    favorite: false,
    template: t.id,
    columns,
    rows: [],
    filters: emptyFilterGroup(),
    sorts: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}
