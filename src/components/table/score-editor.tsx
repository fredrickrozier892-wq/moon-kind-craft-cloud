import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ScoreConfig, ScoreRule, TableDoc } from "@/lib/types";
import { SCORE_OPS } from "@/lib/types";
import { nid } from "@/lib/utils";

export function defaultScoreConfig(table: TableDoc): ScoreConfig {
  const emp = table.columns.find((c) => /сотруд/i.test(c.name));
  const email = table.columns.find((c) => c.type === "email");
  const site = table.columns.find((c) => c.type === "url");
  const rules: ScoreRule[] = [];
  if (emp) {
    rules.push({
      id: nid("sr"),
      label: "Штат > 500",
      columnId: emp.id,
      op: "gt",
      value: 500,
      points: 20,
    });
  }
  if (email) {
    rules.push({
      id: nid("sr"),
      label: "Email найден",
      columnId: email.id,
      op: "not_empty",
      points: 10,
    });
  }
  if (site) {
    rules.push({
      id: nid("sr"),
      label: "Сайт найден",
      columnId: site.id,
      op: "not_empty",
      points: 10,
    });
  }
  if (!rules.length && table.columns[0]) {
    rules.push({
      id: nid("sr"),
      label: "Не пусто",
      columnId: table.columns[0].id,
      op: "not_empty",
      points: 10,
    });
  }
  return { rules };
}

export function ScoreEditor({
  table,
  value,
  onChange,
}: {
  table: TableDoc;
  value: ScoreConfig;
  onChange: (v: ScoreConfig) => void;
}) {
  function patch(i: number, next: Partial<ScoreRule>) {
    const rules = value.rules.map((r, idx) => (idx === i ? { ...r, ...next } : r));
    onChange({ rules });
  }

  const needsValue = (op: ScoreRule["op"]) =>
    !["empty", "not_empty"].includes(op);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        Баллы суммируются, если условие выполняется.
      </p>
      {value.rules.map((r, i) => (
        <div key={r.id} className="rounded-md border border-border p-2">
          <Input
            className="mb-1.5 h-7"
            value={r.label}
            onChange={(e) => patch(i, { label: e.target.value })}
            placeholder="Подпись правила"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <select
              className="h-8 min-w-0 flex-1 rounded-md border border-input bg-card px-2 text-xs"
              value={r.columnId}
              onChange={(e) => patch(i, { columnId: e.target.value })}
            >
              {table.columns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="h-8 rounded-md border border-input bg-card px-2 text-xs"
              value={r.op}
              onChange={(e) =>
                patch(i, { op: e.target.value as ScoreRule["op"] })
              }
            >
              {SCORE_OPS.map((o) => (
                <option key={o.op} value={o.op}>
                  {o.label}
                </option>
              ))}
            </select>
            {needsValue(r.op) ? (
              <Input
                className="h-8 w-20"
                value={r.value == null ? "" : String(r.value)}
                onChange={(e) => {
                  const raw = e.target.value;
                  const n = Number(raw.replace(",", "."));
                  patch(i, { value: raw !== "" && Number.isFinite(n) && raw.trim() !== "" && /^-?\d/.test(raw) ? n : raw });
                }}
              />
            ) : null}
            <Input
              className="h-8 w-16"
              type="number"
              value={r.points}
              onChange={(e) => patch(i, { points: Number(e.target.value) || 0 })}
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Удалить правило"
              onClick={() =>
                onChange({ rules: value.rules.filter((_, idx) => idx !== i) })
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() =>
          onChange({
            rules: [
              ...value.rules,
              {
                id: nid("sr"),
                label: "Правило",
                columnId: table.columns[0]?.id ?? "",
                op: "not_empty",
                points: 10,
              },
            ],
          })
        }
      >
        <Plus className="size-3.5" />
        Правило
      </Button>
    </div>
  );
}
