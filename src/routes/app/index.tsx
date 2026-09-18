import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus, Radio, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCredits, formatNumber, formatRelative } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/app/")({ component: Dashboard });

function Dashboard() {
  const ws = useWorkspace((s) => s.workspace);
  const loading = useWorkspace((s) => s.loading);
  if (loading || !ws) {
    return (
      <div className="grid gap-4 p-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }
  const rows = ws.tables.reduce((n, t) => n + t.rows.length, 0);
  const enrichCols = ws.tables.reduce(
    (n, t) => n + t.columns.filter((c) => c.type === "enrichment").length,
    0,
  );
  const aiRuns = ws.creditLog.filter((t) => t.bucket === "ai").length;
  const main = ws.tables[0];

  const stats = [
    { label: "Таблицы", value: formatNumber(ws.tables.length) },
    { label: "Строки", value: formatNumber(rows) },
    { label: "Обогащения", value: formatNumber(enrichCols * rows) },
    { label: "AI-прогоны", value: formatNumber(aiRuns) },
    { label: "Кредиты", value: formatCredits(ws.credits.data + ws.credits.ai) },
  ];

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Обзор</h1>
          <p className="mt-1 text-sm text-muted-foreground">{ws.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/signals">
              <Radio className="size-3.5" />
              Сигналы
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/app/tables">
              <Plus className="size-3.5" />
              Таблица
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card px-3 py-3">
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-display text-2xl tabular tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        <section className="rounded-xl border border-border bg-card p-4 md:col-span-3">
          <h2 className="text-sm font-semibold">Недавнее</h2>
          <ul className="mt-3 divide-y divide-border">
            {ws.activity.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                <span>{a.text}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelative(a.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-border bg-card p-4 md:col-span-2">
          <h2 className="text-sm font-semibold">Быстрые действия</h2>
          <div className="mt-3 flex flex-col gap-1.5">
            {main ? (
              <Button variant="secondary" className="justify-start" asChild>
                <Link to="/app/tables/$tableId" params={{ tableId: main.id }}>
                  <Table2 className="size-4" />
                  Открыть «{main.name}»
                  <ArrowUpRight className="ml-auto size-3.5" />
                </Link>
              </Button>
            ) : null}
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/app/tables">Новая таблица из шаблона</Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/app/integrations">Отправить в amoCRM</Link>
            </Button>
            <p className="mt-2 text-[11px] text-muted-foreground">
              ⌘K — палитра команд. В таблице: / поиск, n строка, c колонка.
            </p>
          </div>
          <h2 className="mt-6 text-sm font-semibold">Использование</h2>
          <dl className="mt-2 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Data</dt>
              <dd className="tabular">{formatCredits(ws.credits.data)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">AI</dt>
              <dd className="tabular">{formatCredits(ws.credits.ai)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Actions</dt>
              <dd className="tabular">{formatCredits(ws.credits.actions)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
