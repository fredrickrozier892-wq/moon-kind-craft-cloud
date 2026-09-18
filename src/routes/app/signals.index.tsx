import { createFileRoute, Link } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SIGNAL_KIND_META } from "@/lib/types";
import { formatRelative } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/app/signals/")({ component: SignalsPage });

function SignalsPage() {
  const ws = useWorkspace((s) => s.workspace);
  const mark = useWorkspace((s) => s.markSignalRead);
  const addSignal = useWorkspace((s) => s.addSignal);
  if (!ws) return null;
  const unread = ws.signals.filter((s) => !s.read).length;

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Сигналы</h1>
          <p className="text-sm text-muted-foreground">
            {unread ? `${unread} непрочитанных` : "Все просмотрены"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addSignal("VK", "job", ws.tables[0]?.id)}
        >
          Проверить источники
        </Button>
      </div>
      {ws.signals.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
          <Radio className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Пока тихо. Источники подключены в mock-режиме.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {ws.signals.map((s) => (
            <li
              key={s.id}
              className={`rounded-xl border border-border bg-card p-4 ${s.read ? "opacity-70" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{s.company}</span>
                    <Badge variant="outline">{SIGNAL_KIND_META[s.kind].label}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatRelative(s.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{s.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
                </div>
                <div className="flex flex-col gap-1">
                  {!s.read ? (
                    <Button size="xs" variant="ghost" onClick={() => mark(s.id)}>
                      Прочитано
                    </Button>
                  ) : null}
                  {s.tableId ? (
                    <Button size="xs" variant="outline" asChild>
                      <Link to="/app/tables/$tableId" params={{ tableId: s.tableId }}>
                        К таблице
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
