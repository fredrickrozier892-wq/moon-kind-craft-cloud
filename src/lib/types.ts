export const COLUMN_TYPES = [
  "text",
  "number",
  "email",
  "phone",
  "url",
  "company",
  "person",
  "date",
  "boolean",
  "formula",
  "enrichment",
  "ai",
  "score",
] as const;

export type ColumnType = (typeof COLUMN_TYPES)[number];

export type CellStatus = "idle" | "loading" | "success" | "error" | "empty";

export type Primitive = string | number | boolean | null;

export type CellValue = {
  value: Primitive;
  display?: string;
  status?: CellStatus;
  provider?: string;
  credits?: number;
  error?: string;
  explanation?: string;
};

export type EnrichmentIntent =
  | "email"
  | "phone"
  | "website"
  | "company"
  | "person"
  | "revenue"
  | "employees"
  | "custom";

export type EnrichmentConfig = {
  intent: EnrichmentIntent;
  providers: string[];
  inputColumnId: string;
};

export type AiConfig = {
  prompt: string;
  model?: string;
};

export type ScoreRule = {
  id: string;
  label: string;
  columnId: string;
  op: "gt" | "gte" | "lt" | "eq" | "neq" | "contains" | "not_empty" | "empty";
  value?: Primitive;
  points: number;
};

export type ScoreConfig = {
  rules: ScoreRule[];
};

export type Column = {
  id: string;
  name: string;
  type: ColumnType;
  width: number;
  frozen?: boolean;
  hidden?: boolean;
  formula?: string;
  enrichment?: EnrichmentConfig;
  ai?: AiConfig;
  score?: ScoreConfig;
};

export type Row = {
  id: string;
  cells: Record<string, CellValue>;
  createdAt: string;
};

export type FilterOp =
  | "eq"
  | "neq"
  | "contains"
  | "not_contains"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "empty"
  | "not_empty";

export type FilterCond = {
  id: string;
  kind: "cond";
  columnId: string;
  op: FilterOp;
  value?: Primitive;
};

export type FilterGroup = {
  id: string;
  kind: "group";
  combinator: "and" | "or";
  not?: boolean;
  children: FilterNode[];
};

export type FilterNode = FilterCond | FilterGroup;

export type SortSpec = {
  columnId: string;
  dir: "asc" | "desc";
};

export type TableDoc = {
  id: string;
  name: string;
  description: string;
  favorite: boolean;
  template?: string;
  columns: Column[];
  rows: Row[];
  filters: FilterGroup;
  sorts: SortSpec[];
  createdAt: string;
  updatedAt: string;
};

export type AgentTask = {
  id: string;
  title: string;
};

export type Agent = {
  id: string;
  name: string;
  goal: string;
  input: string;
  tasks: AgentTask[];
  output: "json" | "text";
  lastRunAt?: string;
  lastResult?: string;
  status: "idle" | "running" | "done" | "error";
};

export type Audience = {
  id: string;
  name: string;
  tableId: string;
  filters: FilterGroup;
  createdAt: string;
};

export type SignalKind =
  | "job"
  | "executive"
  | "company_change"
  | "registration"
  | "okved"
  | "tender"
  | "mention";

export type Signal = {
  id: string;
  kind: SignalKind;
  company: string;
  title: string;
  detail: string;
  tableId?: string;
  rowId?: string;
  createdAt: string;
  read: boolean;
};

export type IntegrationProvider =
  | "amocrm"
  | "bitrix24"
  | "1c"
  | "telegram"
  | "vk"
  | "email"
  | "webhook";

export type Integration = {
  id: string;
  provider: IntegrationProvider;
  name: string;
  connected: boolean;
  lastExportAt?: string;
  lastCount?: number;
};

export type WebhookEvent =
  | "row_created"
  | "row_updated"
  | "enrichment_completed"
  | "signal_detected"
  | "ai_completed";

export type Webhook = {
  id: string;
  url: string;
  events: WebhookEvent[];
  enabled: boolean;
  lastTestAt?: string;
  lastStatus?: "ok" | "error";
};

export type BillingPlan = "free" | "launch" | "growth" | "enterprise";

export type Credits = {
  data: number;
  ai: number;
  actions: number;
};

export type CreditTx = {
  id: string;
  bucket: keyof Credits;
  amount: number;
  reason: string;
  createdAt: string;
};

export type Activity = {
  id: string;
  text: string;
  createdAt: string;
};

export type MemberRole = "owner" | "admin" | "editor" | "viewer";

export type WorkspaceMember = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: "active" | "invited";
  invitedAt: string;
};

export type OnboardingGoalId =
  | "find-leads"
  | "enrich"
  | "research"
  | "audiences"
  | "automate";

export type WorkspaceDoc = {
  id: string;
  name: string;
  plan: BillingPlan;
  credits: Credits;
  onboardingComplete: boolean;
  onboardingGoal?: string;
  tables: TableDoc[];
  agents: Agent[];
  audiences: Audience[];
  signals: Signal[];
  integrations: Integration[];
  webhooks: Webhook[];
  activity: Activity[];
  creditLog: CreditTx[];
  members: WorkspaceMember[];
};

export const COLUMN_TYPE_META: Record<
  ColumnType,
  { label: string; hint: string }
> = {
  text: { label: "Текст", hint: "Строка произвольного текста" },
  number: { label: "Число", hint: "Числовое значение" },
  email: { label: "Email", hint: "Электронная почта" },
  phone: { label: "Телефон", hint: "Номер телефона" },
  url: { label: "URL", hint: "Сайт или ссылка" },
  company: { label: "Компания", hint: "Название компании" },
  person: { label: "Человек", hint: "Контакт или сотрудник" },
  date: { label: "Дата", hint: "Календарная дата" },
  boolean: { label: "Флаг", hint: "Да / нет" },
  formula: { label: "Формула", hint: "IF, CONCAT, SUM и другие" },
  enrichment: { label: "Обогащение", hint: "Данные из провайдеров" },
  ai: { label: "AI", hint: "Промпт по данным строки" },
  score: { label: "Скоринг", hint: "ICP-оценка по правилам" },
};

export const INTENT_META: Record<
  EnrichmentIntent,
  { label: string; hint: string }
> = {
  email: { label: "Email", hint: "Рабочая почта компании" },
  phone: { label: "Телефон", hint: "Контактный номер" },
  website: { label: "Сайт", hint: "Официальный сайт" },
  company: { label: "Карточка компании", hint: "ИНН, отрасль, адрес" },
  person: { label: "Контакт", hint: "ЛПР или сотрудник" },
  revenue: { label: "Выручка", hint: "Финансовые показатели" },
  employees: { label: "Сотрудники", hint: "Численность штата" },
  custom: { label: "Свой запрос", hint: "Произвольное исследование" },
};

export const SIGNAL_KIND_META: Record<SignalKind, { label: string }> = {
  job: { label: "Новая вакансия" },
  executive: { label: "Изменение руководителя" },
  company_change: { label: "Изменение компании" },
  registration: { label: "Регистрация компании" },
  okved: { label: "Изменение ОКВЭД" },
  tender: { label: "Новый тендер" },
  mention: { label: "Упоминание" },
};

export const INTEGRATION_META: Record<
  IntegrationProvider,
  { label: string; hint: string }
> = {
  amocrm: { label: "amoCRM", hint: "Сделки и контакты" },
  bitrix24: { label: "Bitrix24", hint: "CRM и задачи" },
  "1c": { label: "1С", hint: "Контрагенты" },
  telegram: { label: "Telegram", hint: "Уведомления в чат" },
  vk: { label: "VK", hint: "Сообщения и реклама" },
  email: { label: "Email", hint: "Исходящая почта" },
  webhook: { label: "Webhooks", hint: "HTTP-события" },
};

export const PLAN_META: Record<
  BillingPlan,
  { label: string; price: string; hint: string }
> = {
  free: { label: "Free", price: "0 ₽", hint: "Для знакомства с продуктом" },
  launch: { label: "Launch", price: "9 900 ₽", hint: "Команда до 5 человек" },
  growth: { label: "Growth", price: "29 900 ₽", hint: "Отдел продаж и аналитика" },
  enterprise: { label: "Enterprise", price: "По запросу", hint: "Свои провайдеры и SLA" },
};

export const MEMBER_ROLE_META: Record<MemberRole, { label: string }> = {
  owner: { label: "Владелец" },
  admin: { label: "Админ" },
  editor: { label: "Редактор" },
  viewer: { label: "Наблюдатель" },
};

export const ONBOARDING_GOALS: {
  id: OnboardingGoalId;
  label: string;
  hint: string;
}[] = [
  { id: "find-leads", label: "Найти лиды", hint: "Список компаний и контакты" },
  { id: "enrich", label: "Обогатить компании", hint: "ИНН, сайт, email, штат" },
  { id: "research", label: "Исследовать prospects", hint: "AI-оценка и ICP" },
  { id: "audiences", label: "Собрать аудитории", hint: "Динамические сегменты" },
  { id: "automate", label: "Автоматизировать продажи", hint: "Сигналы и CRM" },
];

export const FORMULA_FNS = [
  { name: "IF", sample: "IF({Сотрудники} > 500, \"Enterprise\", \"SMB\")" },
  { name: "CONCAT", sample: "CONCAT({Компания}, \" — \", {Отрасль})" },
  { name: "SUM", sample: "SUM({Сотрудники}, 0)" },
  { name: "AVERAGE", sample: "AVERAGE({Сотрудники})" },
  { name: "ROUND", sample: "ROUND({Выручка, млрд}, 1)" },
  { name: "LEN", sample: "LEN({Компания})" },
  { name: "LOWER", sample: "LOWER({Email})" },
  { name: "UPPER", sample: "UPPER({Компания})" },
] as const;

export const SCORE_OPS: { op: ScoreRule["op"]; label: string }[] = [
  { op: "gt", label: ">" },
  { op: "gte", label: "≥" },
  { op: "lt", label: "<" },
  { op: "eq", label: "=" },
  { op: "neq", label: "≠" },
  { op: "contains", label: "содержит" },
  { op: "not_empty", label: "не пусто" },
  { op: "empty", label: "пусто" },
];
