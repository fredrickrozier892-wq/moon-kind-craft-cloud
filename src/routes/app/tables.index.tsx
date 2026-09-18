import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Star, Table2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { TABLE_TEMPLATES } from "@/lib/templates";
import { formatNumber, formatRelative } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/app/tables/")({ component: TablesPage });

function TablesPage() {
  const ws = useWorkspace((s) => s.workspace);
  const loading = useWorkspace((s) => s.loading);
  const createTable = useWorkspace((s) => s.createTable);
  const deleteTable = useWorkspace((s) => s.deleteTable);
  const toggleFavorite = useWorkspace((s) => s.toggleFavorite);
  const importCsv = useWorkspace((s) => s.importCsv);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Новая таблица");
  const [template, setTemplate] = useState("lead-gen");
  const [tab, setTab] = useState<"all" | "fav">("all");
  const fileRef = useRef<HTMLInputElement>(null);

  if (loading || !ws) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  const list = tab === "fav" ? ws.tables.filter((t) => t.favorite) : ws.tables;

  function make(empty?: boolean) {
    const id = createTable({ name: name.trim() || "Таблица", templateId: empty ? undefined : template, empty });
    setOpen(false);
    void navigate({ to: "/app/tables/$tableId", params: { tableId: id } });
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Таблицы</h1>
          <p className="text-sm text-muted-foreground">{ws.tables.length} в пространстве</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="size-3.5" />
            CSV
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="size-3.5" />
            Создать
          </Button>
        </div>
      </div>
      <div className="mt-4 flex gap-1 rounded-lg bg-muted p-1 w-fit">
        <button
          type="button"
          className={`rounded-md px-3 py-1 text-xs font-medium ${tab === "all" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
          onClick={() => setTab("all")}
        >
          Все
        </button>
        <button
          type="button"
          className={`rounded-md px-3 py-1 text-xs font-medium ${tab === "fav" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
          onClick={() => setTab("fav")}
        >
          Избранные
        </button>
      </div>
      {list.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
          <Table2 className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Пока пусто. Создайте таблицу или возьмите шаблон.</p>
          <Button className="mt-4" onClick={() => setOpen(true)}>
            Создать таблицу
          </Button>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {list.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-3 py-3">
              <button type="button" onClick={() => toggleFavorite(t.id)} className="text-muted-foreground">
                <Star className="size-4" fill={t.favorite ? "currentColor" : "none"} />
              </button>
              <Link
                to="/app/tables/$tableId"
                params={{ tableId: t.id }}
                className="min-w-0 flex-1"
              >
                <div className="truncate text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatNumber(t.rows.length)} строк · {t.columns.length} колонок ·{" "}
                  {formatRelative(t.updatedAt)}
                </div>
              </Link>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  if (confirm("Удалить таблицу?")) deleteTable(t.id);
                }}
              >
                Удалить
              </Button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-sm font-semibold">Шаблоны</h2>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {TABLE_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              const id = createTable({ name: t.name, templateId: t.id });
              void navigate({ to: "/app/tables/$tableId", params: { tableId: id } });
            }}
            className="rounded-xl border border-border bg-card p-4 text-left hover:bg-muted/50"
          >
            <div className="text-sm font-medium">{t.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{t.description}</div>
          </button>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const id = createTable({ name: file.name.replace(/\.csv$/i, ""), empty: true });
          const text = await file.text();
          const res = importCsv(id, text);
          toast.success(`Импортировано ${res.rows} строк`);
          void navigate({ to: "/app/tables/$tableId", params: { tableId: id } });
          e.target.value = "";
        }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Новая таблица">
          <div className="flex flex-col gap-3">
            <div>
              <Label>Название</Label>
              <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Шаблон</Label>
              <select
                className="mt-1 h-9 w-full rounded-md border border-input bg-card px-2 text-sm"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                {TABLE_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => make(true)}>
                Пустая
              </Button>
              <Button onClick={() => make()}>Создать</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
