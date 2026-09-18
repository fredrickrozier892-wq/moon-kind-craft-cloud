import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FILTER_OPS } from "@/lib/filters";
import type { FilterCond, FilterGroup, FilterOp, TableDoc } from "@/lib/types";
import { nid } from "@/lib/utils";

export function FilterBuilder({
  table,
  value,
  onChange,
}: {
  table: TableDoc;
  value: FilterGroup;
  onChange: (g: FilterGroup) => void;
}) {
  function updateChild(i: number, child: FilterCond) {
    const children = [...value.children];
    children[i] = child;
    onChange({ ...value, children });
  }
  function remove(i: number) {
    onChange({ ...value, children: value.children.filter((_, idx) => idx !== i) });
  }
  function add() {
    const cond: FilterCond = {
      id: nid("fc"),
      kind: "cond",
      columnId: table.columns[0]?.id ?? "",
      op: "not_empty",
    };
    onChange({ ...value, children: [...value.children, cond] });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Соединять</span>
        <button
          type="button"
          className={`rounded-md px-2 py-0.5 text-xs ${
            value.combinator === "and" ? "bg-secondary font-medium" : "hover:bg-muted"
          }`}
          onClick={() => onChange({ ...value, combinator: "and" })}
        >
          AND
        </button>
        <button
          type="button"
          className={`rounded-md px-2 py-0.5 text-xs ${
            value.combinator === "or" ? "bg-secondary font-medium" : "hover:bg-muted"
          }`}
          onClick={() => onChange({ ...value, combinator: "or" })}
        >
          OR
        </button>
        <button
          type="button"
          className={`rounded-md px-2 py-0.5 text-xs ${
            value.not ? "bg-secondary font-medium" : "hover:bg-muted"
          }`}
          onClick={() => onChange({ ...value, not: !value.not })}
        >
          NOT
        </button>
      </div>
      {value.children.length === 0 ? (
        <p className="text-xs text-muted-foreground">Нет условий — показаны все строки.</p>
      ) : null}
      {value.children.map((child, i) => {
        if (child.kind !== "cond") return null;
        const needsValue = !["empty", "not_empty"].includes(child.op);
        return (
          <div key={child.id} className="flex flex-wrap items-center gap-1.5">
            <select
              className="h-8 rounded-md border border-input bg-card px-2 text-xs"
              value={child.columnId}
              onChange={(e) => updateChild(i, { ...child, columnId: e.target.value })}
            >
              {table.columns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="h-8 rounded-md border border-input bg-card px-2 text-xs"
              value={child.op}
              onChange={(e) =>
                updateChild(i, { ...child, op: e.target.value as FilterOp })
              }
            >
              {FILTER_OPS.map((o) => (
                <option key={o.op} value={o.op}>
                  {o.label}
                </option>
              ))}
            </select>
            {needsValue ? (
              <Input
                className="h-8 w-28"
                value={child.value == null ? "" : String(child.value)}
                onChange={(e) => updateChild(i, { ...child, value: e.target.value })}
              />
            ) : null}
            <Button variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Удалить">
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        );
      })}
      <Button variant="outline" size="sm" onClick={add} className="self-start">
        <Plus className="size-3.5" />
        Условие
      </Button>
    </div>
  );
}
