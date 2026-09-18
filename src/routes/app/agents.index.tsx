import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Play, Plus, Table2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRelative } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/app/agents/")({ component: AgentsPage });

function AgentsPage() {
  const ws = useWorkspace((s) => s.workspace);
  const runAgent = useWorkspace((s) => s.runAgent);
  const createAgent = useWorkspace((s) => s.createAgent);
  const deleteAgent = useWorkspace((s) => s.deleteAgent);
  const ingest = useWorkspace((s) => s.ingestAgentResult);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Lead Researcher");
  const [goal, setGoal] = useState("Найти потенциальных клиентов.");
  const [company, setCompany] = useState("Яндекс");
  const [runningId, setRunningId] = useState<string | null>(null);

  if (!ws) return null;
  const tableId = ws.tables[0]?.id;

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Агенты</h1>
          <p className="text-sm text-muted-foreground">
            Исследователи, которые проходят по строке и возвращают JSON.
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-3.5" />
          Агент
        </Button>
      </div>
      <ul className="mt-6 space-y-3">
        {ws.agents.map((a) => (
          <li key={a.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">{a.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{a.goal}</p>
                <p className="mt-2 text-xs text-muted-foreground">Вход: {a.input}</p>
                <ol className="mt-2 list-decimal pl-4 text-sm">
                  {a.tasks.map((t) => (
                    <li key={t.id}>{t.title}</li>
                  ))}
                </ol>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  disabled={runningId === a.id || a.status === "running"}
                  onClick={async () => {
                    setRunningId(a.id);
                    await runAgent(a.id, company);
                    setRunningId(null);
                    toast.success(`Агент «${a.name}» завершил прогон`);
                  }}
                >
                  <Play className="size-3.5" />
                  Запуск
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteAgent(a.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Input
                className="h-8 w-40"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Компания"
              />
              {a.lastRunAt ? (
                <span className="text-xs text-muted-foreground">
                  {formatRelative(a.lastRunAt)}
                </span>
              ) : null}
            </div>
            {a.lastResult ? (
              <>
                <pre className="mt-3 overflow-auto rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed">
                  {a.lastResult}
                </pre>
                {tableId ? (
                  <Button
                    size="xs"
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      ingest(tableId, company, a.lastResult ?? "");
                      toast.success("Записано в таблицу");
                      void navigate({
                        to: "/app/tables/$tableId",
                        params: { tableId },
                      });
                    }}
                  >
                    <Table2 className="size-3.5" />
                    В таблицу
                  </Button>
                ) : null}
              </>
            ) : null}
          </li>
        ))}
      </ul>
      {ws.agents.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Агентов нет. Создайте Lead Researcher.</p>
      ) : null}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Новый агент">
          <div className="flex flex-col gap-3">
            <div>
              <Label>Имя</Label>
              <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Цель</Label>
              <Textarea className="mt-1" value={goal} onChange={(e) => setGoal(e.target.value)} />
            </div>
            <Button
              onClick={() => {
                createAgent({
                  name,
                  goal,
                  input: "Company",
                  tasks: [
                    { id: "1", title: "Найти сайт" },
                    { id: "2", title: "Определить отрасль" },
                    { id: "3", title: "Найти размер компании" },
                    { id: "4", title: "Определить ICP fit" },
                    { id: "5", title: "Дать объяснение" },
                  ],
                  output: "json",
                });
                setOpen(false);
              }}
            >
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
