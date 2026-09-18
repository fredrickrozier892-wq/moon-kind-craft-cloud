import { useState } from "react";
import { ScoreEditor, defaultScoreConfig } from "@/components/table/score-editor";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROVIDERS, providersFor } from "@/lib/services/mock/providers";
import type {
  Column,
  ColumnType,
  EnrichmentIntent,
  ScoreConfig,
  TableDoc,
} from "@/lib/types";
import { COLUMN_TYPE_META, FORMULA_FNS, INTENT_META } from "@/lib/types";
import { nid } from "@/lib/utils";

const BASIC: ColumnType[] = [
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
];

export function AddColumnDialog({
  open,
  onOpenChange,
  table,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  table: TableDoc;
  onCreate: (column: Column) => void;
}) {
  const [step, setStep] = useState<"type" | "setup">("type");
  const [type, setType] = useState<ColumnType>("text");
  const [name, setName] = useState("");
  const [formula, setFormula] = useState('=IF({Сотрудники} > 500, "Enterprise", "SMB")');
  const [prompt, setPrompt] = useState(
    "Оцени компанию по шкале 1-100.\n\nУчитывай:\n- размер;\n- отрасль;\n- наличие отдела продаж;\n- соответствие ICP.",
  );
  const [intent, setIntent] = useState<EnrichmentIntent>("website");
  const [inputCol, setInputCol] = useState(table.columns[0]?.id ?? "");
  const [providerIds, setProviderIds] = useState<string[]>(["dadata", "spark"]);
  const [score, setScore] = useState<ScoreConfig>(() => defaultScoreConfig(table));

  function reset() {
    setStep("type");
    setType("text");
    setName("");
    setScore(defaultScoreConfig(table));
  }

  function submit() {
    const id = nid("col");
    const label =
      name.trim() ||
      (type === "enrichment"
        ? INTENT_META[intent].label
        : type === "ai"
          ? "AI"
          : COLUMN_TYPE_META[type].label);
    const column: Column = {
      id,
      name: label,
      type,
      width: type === "company" ? 220 : 160,
    };
    if (type === "formula") column.formula = formula;
    if (type === "ai") column.ai = { prompt };
    if (type === "enrichment") {
      column.enrichment = {
        intent,
        providers: providerIds,
        inputColumnId: inputCol || table.columns[0]?.id || "",
      };
    }
    if (type === "score") column.score = score;
    onCreate(column);
    onOpenChange(false);
    reset();
  }

  const available = providersFor(intent);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent
        title={step === "type" ? "Новая колонка" : COLUMN_TYPE_META[type].label}
        className={type === "score" && step === "setup" ? "max-h-[min(90dvh,720px)] overflow-y-auto" : undefined}
      >
        {step === "type" ? (
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {BASIC.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t);
                  setStep("setup");
                  if (!name) setName(COLUMN_TYPE_META[t].label);
                  if (t === "score") setScore(defaultScoreConfig(table));
                }}
                className="rounded-lg border border-border bg-card px-3 py-2.5 text-left hover:bg-muted"
              >
                <div className="text-sm font-medium">{COLUMN_TYPE_META[t].label}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {COLUMN_TYPE_META[t].hint}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <Label>Название</Label>
              <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {type === "formula" && (
              <div>
                <Label>Формула</Label>
                <Input
                  className="mt-1 font-mono text-xs"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {FORMULA_FNS.map((fn) => (
                    <button
                      key={fn.name}
                      type="button"
                      className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] hover:bg-muted"
                      onClick={() => setFormula(`=${fn.sample}`)}
                    >
                      {fn.name}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Ссылки на колонки: {"{Колонка}"}
                </p>
              </div>
            )}
            {type === "ai" && (
              <div>
                <Label>Промпт</Label>
                <Textarea
                  className="mt-1"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Подстановки: {"{{Компания}}"}, {"{{Сотрудники}}"}
                </p>
              </div>
            )}
            {type === "score" && (
              <ScoreEditor table={table} value={score} onChange={setScore} />
            )}
            {type === "enrichment" && (
              <>
                <div>
                  <Label>Что найти</Label>
                  <div className="mt-1 grid grid-cols-2 gap-1">
                    {(Object.keys(INTENT_META) as EnrichmentIntent[]).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          setIntent(k);
                          setProviderIds(
                            providersFor(k)
                              .slice(0, 2)
                              .map((p) => p.id),
                          );
                        }}
                        className={`rounded-md border px-2 py-1.5 text-left text-xs ${
                          intent === k
                            ? "border-primary bg-accent text-accent-foreground"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {INTENT_META[k].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Исходная колонка</Label>
                  <select
                    className="mt-1 h-9 w-full rounded-md border border-input bg-card px-2 text-sm"
                    value={inputCol}
                    onChange={(e) => setInputCol(e.target.value)}
                  >
                    {table.columns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Провайдеры · waterfall</Label>
                  <div className="mt-1 flex flex-col gap-1">
                    {available.map((p, i) => {
                      const on = providerIds.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className="flex items-center justify-between rounded-md border border-border px-2 py-1.5 text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() =>
                                setProviderIds((ids) =>
                                  on ? ids.filter((x) => x !== p.id) : [...ids, p.id],
                                )
                              }
                            />
                            <span>
                              {i + 1}. {p.name}
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground tabular">
                            {p.cost} кр.
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Цепочка:{" "}
                    {providerIds
                      .map((id) => PROVIDERS.find((p) => p.id === id)?.name)
                      .filter(Boolean)
                      .join(" → ") || "не выбрано"}
                  </p>
                </div>
              </>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setStep("type")}>
                Назад
              </Button>
              <Button onClick={submit}>Добавить</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
