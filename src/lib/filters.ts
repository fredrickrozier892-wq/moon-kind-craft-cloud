import type {
  FilterGroup,
  FilterNode,
  FilterOp,
  Primitive,
  Row,
  SortSpec,
  TableDoc,
} from "./types";
import { nid } from "./utils";

function toNum(v: Primitive): number {
  if (typeof v === "number") return v;
  if (v == null || v === "") return NaN;
  return Number(String(v).replace(/\s/g, "").replace(",", "."));
}

function toStr(v: Primitive | undefined): string {
  return v == null ? "" : String(v);
}

export function evalCond(
  value: Primitive,
  op: FilterOp,
  rhs: Primitive | undefined,
): boolean {
  const s = toStr(value);
  switch (op) {
    case "eq":
      return s.toLowerCase() === toStr(rhs).toLowerCase();
    case "neq":
      return s.toLowerCase() !== toStr(rhs).toLowerCase();
    case "contains":
      return s.toLowerCase().includes(toStr(rhs).toLowerCase());
    case "not_contains":
      return !s.toLowerCase().includes(toStr(rhs).toLowerCase());
    case "gt":
      return toNum(value) > toNum(rhs ?? 0);
    case "gte":
      return toNum(value) >= toNum(rhs ?? 0);
    case "lt":
      return toNum(value) < toNum(rhs ?? 0);
    case "lte":
      return toNum(value) <= toNum(rhs ?? 0);
    case "empty":
      return value == null || s === "";
    case "not_empty":
      return value != null && s !== "";
  }
}

export function evalFilter(node: FilterNode, row: Row): boolean {
  if (node.kind === "cond") {
    const v = row.cells[node.columnId]?.value ?? null;
    return evalCond(v, node.op, node.value);
  }
  if (!node.children.length) return true;
  const parts = node.children.map((c) => evalFilter(c, row));
  const base =
    node.combinator === "and" ? parts.every(Boolean) : parts.some(Boolean);
  return node.not ? !base : base;
}

export function emptyFilterGroup(): FilterGroup {
  return { id: nid("fg"), kind: "group", combinator: "and", children: [] };
}

export function filterIsActive(group: FilterGroup): boolean {
  return group.children.length > 0;
}

export function applyView(
  table: TableDoc,
  search: string,
): Row[] {
  const q = search.trim().toLowerCase();
  let rows = table.rows;
  if (filterIsActive(table.filters)) {
    rows = rows.filter((r) => evalFilter(table.filters, r));
  }
  if (q) {
    rows = rows.filter((r) =>
      Object.values(r.cells).some((c) =>
        String(c?.display ?? c?.value ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }
  if (table.sorts.length) {
    const sorts: SortSpec[] = table.sorts;
    rows = [...rows].sort((a, b) => {
      for (const s of sorts) {
        const av = a.cells[s.columnId]?.value;
        const bv = b.cells[s.columnId]?.value;
        const an = toNum(av ?? null);
        const bn = toNum(bv ?? null);
        let cmp = 0;
        if (!Number.isNaN(an) && !Number.isNaN(bn)) cmp = an - bn;
        else
          cmp = toStr(av ?? null).localeCompare(toStr(bv ?? null), "ru", {
            numeric: true,
            sensitivity: "base",
          });
        if (cmp !== 0) return s.dir === "asc" ? cmp : -cmp;
      }
      return 0;
    });
  }
  return rows;
}

export const FILTER_OPS: { op: FilterOp; label: string }[] = [
  { op: "eq", label: "равно" },
  { op: "neq", label: "не равно" },
  { op: "contains", label: "содержит" },
  { op: "not_contains", label: "не содержит" },
  { op: "gt", label: "больше" },
  { op: "gte", label: "≥" },
  { op: "lt", label: "меньше" },
  { op: "lte", label: "≤" },
  { op: "empty", label: "пусто" },
  { op: "not_empty", label: "не пусто" },
];
