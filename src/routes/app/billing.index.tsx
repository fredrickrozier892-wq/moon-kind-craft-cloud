import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLAN_META, type BillingPlan } from "@/lib/types";
import { formatCredits, formatRelative } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/app/billing/")({ component: BillingPage });

const ORDER: BillingPlan[] = ["free", "launch", "growth", "enterprise"];

function BillingPage() {
  const ws = useWorkspace((s) => s.workspace);
  const setPlan = useWorkspace((s) => s.setPlan);
  const addCredits = useWorkspace((s) => s.addCredits);
  if (!ws) return null;

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Тарифы и кредиты</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Платежи пока в mock-режиме. Позже — ЮKassa, CloudPayments и СБП.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {(
          [
            ["Data", ws.credits.data, "data"],
            ["AI", ws.credits.ai, "ai"],
            ["Actions", ws.credits.actions, "actions"],
          ] as const
        ).map(([label, n, bucket]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 font-display text-2xl tabular">{formatCredits(n)}</div>
            <Button
              size="xs"
              variant="outline"
              className="mt-3"
              onClick={() => {
                addCredits(bucket, 1000);
                toast.success(`+1 000 ${label}`);
              }}
            >
              Пополнить +1 000
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-2 md:grid-cols-4">
        {ORDER.map((id) => {
          const p = PLAN_META[id];
          const on = ws.plan === id;
          return (
            <div
              key={id}
              className={`rounded-xl border bg-card p-4 ${on ? "border-primary" : "border-border"}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{p.label}</div>
                {on ? <Badge variant="pine">текущий</Badge> : null}
              </div>
              <div className="mt-2 font-display text-xl">{p.price}</div>
              <p className="mt-1 text-xs text-muted-foreground">{p.hint}</p>
              <Button
                size="sm"
                variant={on ? "secondary" : "outline"}
                className="mt-4 w-full"
                disabled={on}
                onClick={() => {
                  setPlan(id);
                  toast.success(`Тариф: ${p.label}`);
                }}
              >
                {on ? "Выбран" : "Выбрать"}
              </Button>
            </div>
          );
        })}
      </div>
      <h2 className="mt-8 text-sm font-semibold">История кредитов</h2>
      <ul className="mt-2 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {ws.creditLog.slice(0, 12).map((t) => (
          <li key={t.id} className="flex items-center justify-between px-4 py-2 text-sm">
            <span>
              {t.reason}
              <span className="ml-2 text-xs text-muted-foreground">{t.bucket}</span>
            </span>
            <span className="tabular">
              {t.amount > 0 ? "+" : ""}
              {t.amount} · {formatRelative(t.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
