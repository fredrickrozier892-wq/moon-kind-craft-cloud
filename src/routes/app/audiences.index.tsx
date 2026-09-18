import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FilterBuilder } from "@/components/table/filter-builder";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { applyView, emptyFilterGroup } from "@/lib/filters";
import type { FilterGroup } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/app/audiences/")({ component: AudiencesPage });

function AudiencesPage() {
  const ws = useWorkspace((s) => s.workspace);
  const createAudience = useWorkspace((s) => s.createAudience);
  const deleteAudience = useWorkspace((s) => s.deleteAudience);
  const applyAudience = useWorkspace((s) => s.applyAudience);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Enterprise SaaS");
  const [tableId, setTableId] = useState(ws?.tables[0]?.id ?? "");
  const table = ws?.tables.find((t) => t.id === tableId) ?? ws?.tables[0];
  const [filters, setFilters] = useState<FilterGroup>(emptyFilterGroup());

  const counts = useMemo(() => {
    if (!ws) return {};
    const map: Record<string, number> = {};
    for (const a of ws.audiences) {
      const t = ws.tables.find((x) => x.id === a.tableId);
      if (!t) {
        map[a.id] = 0;
        continue;
      }
      map[a.id] = applyView({ ...t, filters: a.filters }, "").length;
    }
    return map;
  }, [ws]);

  if (!ws) return null;

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Аудитории</h1>
          <p className="text-sm text-muted-foreground">
            Динамические выборки. Меняется таблица — меняется состав.
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} disabled={!table}>
          <Plus className="size-3.5" />
          Аудитория
        </Button>
      </div>
      {ws.audiences.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
          <Users className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Соберите первую аудиторию из фильтра таблицы.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {ws.audiences.map((a) => {
            const t = ws.tables.find((x) => x.id === a.tableId);
            return (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t?.name ?? "таблица удалена"} · {formatNumber(counts[a.id] ?? 0)} компаний
                  </div>
                </div>
                {t ? (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      const id = applyAudience(a.id);
                      toast.success(`Фильтр «${a.name}» применён`);
                      if (id) {
                        void navigate({ to: "/app/tables/$tableId", params: { tableId: id } });
                      }
                    }}
                  >
                    Применить
                  </Button>
                ) : null}
                {t ? (
                  <Button variant="outline" size="xs" asChild>
                    <Link to="/app/tables/$tableId" params={{ tableId: t.id }}>
                      Открыть
                    </Link>
                  </Button>
                ) : null}
                <Button variant="ghost" size="xs" onClick={() => deleteAudience(a.id)}>
                  Удалить
                </Button>
              </li>
            );
          })}
        </ul>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Новая аудитория">
          {table ? (
            <div className="flex flex-col gap-3">
              <div>
                <Label>Название</Label>
                <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              {ws.tables.length > 1 ? (
                <div>
                  <Label>Таблица</Label>
                  <select
                    className="mt-1 h-9 w-full rounded-md border border-input bg-card px-2 text-sm"
                    value={table.id}
                    onChange={(e) => {
                      setTableId(e.target.value);
                      setFilters(emptyFilterGroup());
                    }}
                  >
                    {ws.tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              <FilterBuilder table={table} value={filters} onChange={setFilters} />
              <Button
                onClick={() => {
                  createAudience({ name, tableId: table.id, filters });
                  setOpen(false);
                  setFilters(emptyFilterGroup());
                }}
              >
                Создать
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
