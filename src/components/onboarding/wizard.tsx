import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { TABLE_TEMPLATES } from "@/lib/templates";
import { ONBOARDING_GOALS, type OnboardingGoalId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-store";

export function OnboardingWizard() {
  const navigate = useNavigate();
  const complete = useWorkspace((s) => s.completeOnboarding);
  const createTable = useWorkspace((s) => s.createTable);
  const importCsv = useWorkspace((s) => s.importCsv);
  const tables = useWorkspace((s) => s.workspace?.tables ?? []);
  const [goal, setGoal] = useState<OnboardingGoalId>("find-leads");
  const [step, setStep] = useState<1 | 2>(1);
  const fileRef = useRef<HTMLInputElement>(null);

  function finish(tableId?: string) {
    complete(goal, tableId);
    const id = tableId ?? tables[0]?.id;
    if (id) {
      void navigate({ to: "/app/tables/$tableId", params: { tableId: id } });
    } else {
      void navigate({ to: "/app" });
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-12 items-center px-4">
        <Wordmark />
      </header>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-16 pt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Шаг {step} из 2
        </p>
        {step === 1 ? (
          <>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              Что хотите сделать?
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              От этого зависит стартовый шаблон. Потом можно сменить.
            </p>
            <ul className="mt-6 space-y-1.5">
              {ONBOARDING_GOALS.map((g) => (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => setGoal(g.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition-colors",
                      goal === g.id
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:bg-muted/60",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 size-3.5 shrink-0 rounded-full border",
                        goal === g.id
                          ? "border-primary bg-primary"
                          : "border-input bg-card",
                      )}
                    />
                    <span>
                      <span className="block text-sm font-medium">{g.label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {g.hint}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setStep(2)}>Дальше</Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              Первая таблица
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Импорт, шаблон или пустая сетка. Демо-список российских компаний уже
              подготовлен.
            </p>
            <div className="mt-6 grid gap-2">
              <Button
                variant="outline"
                className="h-auto justify-start py-3"
                onClick={() => fileRef.current?.click()}
              >
                <span className="text-left">
                  <span className="block text-sm font-medium">Импорт CSV</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    Колонки подхватятся из заголовков файла
                  </span>
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto justify-start py-3"
                onClick={() => {
                  const id = createTable({
                    name: "Моя первая таблица",
                    empty: true,
                  });
                  finish(id);
                }}
              >
                <span className="text-left">
                  <span className="block text-sm font-medium">Пустая таблица</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    Одна колонка «Компания» — остальное добавите сами
                  </span>
                </span>
              </Button>
              {TABLE_TEMPLATES.slice(0, 4).map((t) => (
                <Button
                  key={t.id}
                  variant="outline"
                  className="h-auto justify-start py-3"
                  onClick={() => {
                    const id = createTable({ name: t.name, templateId: t.id });
                    finish(id);
                  }}
                >
                  <span className="text-left">
                    <span className="block text-sm font-medium">{t.name}</span>
                    <span className="block text-xs font-normal text-muted-foreground">
                      {t.description}
                    </span>
                  </span>
                </Button>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Назад
              </Button>
              <Button onClick={() => finish(tables[0]?.id)}>
                Открыть демо-таблицу
              </Button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const id = createTable({
                  name: file.name.replace(/\.csv$/i, ""),
                  empty: true,
                });
                const text = await file.text();
                importCsv(id, text);
                finish(id);
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}
