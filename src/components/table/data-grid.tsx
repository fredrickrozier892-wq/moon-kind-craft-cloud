import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { applyView } from "@/lib/filters";
import type { CellValue, Column, Primitive, TableDoc } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-store";

const ROW_H = 36;
const IDX_W = 52;
const CHK_W = 36;

function display(cell: CellValue | undefined): string {
  if (!cell) return "";
  if (cell.display != null && cell.display !== "") return cell.display;
  if (cell.value == null) return "";
  return String(cell.value);
}

function scoreTone(n: number): string {
  if (n >= 70) return "text-success";
  if (n >= 40) return "text-warning";
  return "text-muted-foreground";
}

function CellView({ column, cell }: { column: Column; cell: CellValue | undefined }) {
  if (cell?.status === "loading") {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <Loader2 className="size-3 animate-spin" />
        Ищем…
      </span>
    );
  }
  if (cell?.status === "error") {
    return (
      <span className="truncate text-destructive" title={cell.error}>
        {cell.error || "Ошибка"}
      </span>
    );
  }
  const text = display(cell);
  if (!text) return <span className="text-muted-foreground/50">—</span>;

  if (column.type === "url") {
    const href = text.startsWith("http") ? text : `https://${text}`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="truncate text-primary hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {text.replace(/^https?:\/\//, "")}
      </a>
    );
  }
  if (column.type === "email") {
    return (
      <a
        href={`mailto:${text}`}
        className="truncate hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {text}
      </a>
    );
  }
  if (column.type === "boolean") {
    return cell?.value ? <Check className="size-3.5 text-success" /> : null;
  }
  if (column.type === "number" || column.type === "score") {
    const n = Number(cell?.value);
    return (
      <span className={cn("tabular", column.type === "score" && scoreTone(n))}>
        {Number.isFinite(n) ? n.toLocaleString("ru-RU") : text}
      </span>
    );
  }
  if (column.type === "company") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-[4px] bg-secondary text-[10px] font-semibold">
          {text.slice(0, 1)}
        </span>
        <span className="truncate font-medium">{text}</span>
      </span>
    );
  }
  if (column.type === "enrichment" || column.type === "ai") {
    return (
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="truncate">{text}</span>
        {cell?.provider ? (
          <span className="shrink-0 rounded bg-muted px-1 text-[10px] text-muted-foreground">
            {cell.provider}
          </span>
        ) : null}
      </span>
    );
  }
  return <span className="truncate">{text}</span>;
}

export function DataGrid({
  table,
  onAddColumn,
}: {
  table: TableDoc;
  onAddColumn?: () => void;
}) {
  const search = useWorkspace((s) => s.search);
  const selected = useWorkspace((s) => s.selectedRowIds);
  const setSelected = useWorkspace((s) => s.setSelected);
  const updateCell = useWorkspace((s) => s.updateCell);
  const addRow = useWorkspace((s) => s.addRow);
  const deleteRows = useWorkspace((s) => s.deleteRows);
  const deleteColumn = useWorkspace((s) => s.deleteColumn);
  const resizeColumn = useWorkspace((s) => s.resizeColumn);
  const setSort = useWorkspace((s) => s.setSort);
  const updateColumn = useWorkspace((s) => s.updateColumn);
  const duplicateRows = useWorkspace((s) => s.duplicateRows);
  const reorderColumn = useWorkspace((s) => s.reorderColumn);

  const rows = useMemo(() => applyView(table, search), [table, search]);
  const columns = table.columns.filter((c) => !c.hidden);

  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_H,
    overscan: 12,
  });

  const [editing, setEditing] = useState<{ rowId: string; colId: string } | null>(null);
  const [draft, setDraft] = useState("");
  const [menu, setMenu] = useState<{ x: number; y: number; rowId: string } | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const drag = useRef<{ id: string; startX: number; startW: number } | null>(null);
  const colDrag = useRef<string | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag.current) return;
      const w = drag.current.startW + (e.clientX - drag.current.startX);
      resizeColumn(table.id, drag.current.id, w);
    };
    const onUp = () => {
      drag.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [resizeColumn, table.id]);

  const frozen = columns.filter((c) => c.frozen);
  const rest = columns.filter((c) => !c.frozen);
  const ordered = [...frozen, ...rest];

  const leftOf = (index: number) => {
    let x = CHK_W + IDX_W;
    for (let i = 0; i < index; i++) {
      if (ordered[i]?.frozen) x += ordered[i]!.width;
    }
    return x;
  };

  const totalW =
    CHK_W + IDX_W + ordered.reduce((s, c) => s + c.width, 0) + 44;

  function commit() {
    if (!editing) return;
    const col = columns.find((c) => c.id === editing.colId);
    let value: Primitive = draft;
    if (col?.type === "number" || col?.type === "score") {
      const n = Number(draft.replace(/\s/g, "").replace(",", "."));
      value = draft === "" ? null : Number.isFinite(n) ? n : draft;
    } else if (col?.type === "boolean") {
      value = draft === "true" || draft === "1" || draft.toLowerCase() === "да";
    }
    updateCell(table.id, editing.rowId, editing.colId, value);
    setEditing(null);
  }

  function toggleRow(id: string, additive: boolean) {
    if (!additive) {
      setSelected(selected.includes(id) && selected.length === 1 ? [] : [id]);
      return;
    }
    setSelected(
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id],
    );
  }

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div ref={parentRef} className="min-h-0 flex-1 overflow-auto bg-card">
        <div style={{ width: totalW, minWidth: "100%" }}>
          <div
            className="sticky top-0 z-20 flex border-b border-border bg-muted/80 backdrop-blur-sm"
            style={{ height: ROW_H }}
          >
            <div
              className="sticky left-0 z-30 flex items-center justify-center border-r border-border bg-muted"
              style={{ width: CHK_W }}
            >
              <Checkbox
                checked={allSelected}
                onCheckedChange={() =>
                  setSelected(allSelected ? [] : rows.map((r) => r.id))
                }
              />
            </div>
            <div
              className="sticky z-30 flex items-center justify-center border-r border-border bg-muted text-[11px] font-medium text-muted-foreground"
              style={{ width: IDX_W, left: CHK_W }}
            >
              #
            </div>
            {ordered.map((col, i) => {
              const sorted = table.sorts[0]?.columnId === col.id;
              const sticky = col.frozen;
              return (
                <div
                  key={col.id}
                  className={cn(
                    "group relative flex shrink-0 items-center gap-1 border-r border-border px-2 text-[12px] font-medium",
                    sticky && "sticky z-30 bg-muted",
                  )}
                  style={{
                    width: col.width,
                    left: sticky ? leftOf(i) : undefined,
                  }}
                  draggable
                  onDragStart={() => {
                    colDrag.current = col.id;
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (colDrag.current) reorderColumn(table.id, colDrag.current, col.id);
                    colDrag.current = null;
                  }}
                >
                  {renaming === col.id ? (
                    <input
                      autoFocus
                      className="h-6 min-w-0 flex-1 rounded-sm border border-ring bg-card px-1 text-[12px] outline-none"
                      value={renameDraft}
                      onChange={(e) => setRenameDraft(e.target.value)}
                      onBlur={() => {
                        if (renameDraft.trim()) {
                          updateColumn(table.id, col.id, { name: renameDraft.trim() });
                        }
                        setRenaming(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        if (e.key === "Escape") setRenaming(null);
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-1 text-left"
                      onClick={() =>
                        setSort(
                          table.id,
                          sorted && table.sorts[0]?.dir === "asc"
                            ? { columnId: col.id, dir: "desc" }
                            : { columnId: col.id, dir: "asc" },
                        )
                      }
                    >
                      <span className="truncate">{col.name}</span>
                      {sorted ? (
                        table.sorts[0]?.dir === "asc" ? (
                          <ArrowUp className="size-3 shrink-0" />
                        ) : (
                          <ArrowDown className="size-3 shrink-0" />
                        )
                      ) : null}
                    </button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="rounded p-0.5 opacity-0 hover:bg-secondary group-hover:opacity-100"
                        aria-label="Колонка"
                      >
                        <MoreHorizontal className="size-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setRenaming(col.id);
                          setRenameDraft(col.name);
                        }}
                      >
                        Переименовать
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setSort(table.id, { columnId: col.id, dir: "asc" })
                        }
                      >
                        Сортировать A→Я
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setSort(table.id, { columnId: col.id, dir: "desc" })
                        }
                      >
                        Сортировать Я→A
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateColumn(table.id, col.id, { frozen: !col.frozen })
                        }
                      >
                        {col.frozen ? "Открепить" : "Закрепить"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateColumn(table.id, col.id, { hidden: true })
                        }
                      >
                        Скрыть
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteColumn(table.id, col.id)}
                      >
                        Удалить колонку
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div
                    className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-primary/30"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      drag.current = {
                        id: col.id,
                        startX: e.clientX,
                        startW: col.width,
                      };
                    }}
                  />
                </div>
              );
            })}
            <button
              type="button"
              className="flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={onAddColumn}
              aria-label="Добавить колонку"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          {rows.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              Нет строк. Добавьте компанию или снимите фильтр.
            </div>
          ) : (
            <div
              style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((v) => {
                const row = rows[v.index]!;
                const on = selected.includes(row.id);
                return (
                  <div
                    key={row.id}
                    className={cn(
                      "absolute left-0 flex border-b border-border",
                      on ? "bg-accent/60" : "bg-card hover:bg-muted/40",
                    )}
                    style={{
                      height: ROW_H,
                      transform: `translateY(${v.start}px)`,
                      width: totalW,
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setMenu({ x: e.clientX, y: e.clientY, rowId: row.id });
                      if (!selected.includes(row.id)) setSelected([row.id]);
                    }}
                  >
                    <div
                      className={cn(
                        "sticky left-0 z-10 flex items-center justify-center border-r border-border",
                        on ? "bg-accent" : "bg-card",
                      )}
                      style={{ width: CHK_W }}
                    >
                      <Checkbox
                        checked={on}
                        onCheckedChange={() => toggleRow(row.id, true)}
                      />
                    </div>
                    <div
                      className={cn(
                        "sticky z-10 flex items-center justify-center border-r border-border text-[11px] tabular text-muted-foreground",
                        on ? "bg-accent" : "bg-card",
                      )}
                      style={{ width: IDX_W, left: CHK_W }}
                    >
                      {v.index + 1}
                    </div>
                    {ordered.map((col, i) => {
                      const isEdit =
                        editing?.rowId === row.id && editing.colId === col.id;
                      const readOnly =
                        col.type === "formula" ||
                        col.type === "score" ||
                        col.type === "enrichment" ||
                        col.type === "ai";
                      return (
                        <div
                          key={col.id}
                          className={cn(
                            "flex shrink-0 items-center border-r border-border px-2 text-[13px]",
                            col.frozen && "sticky z-10",
                            col.frozen && (on ? "bg-accent" : "bg-card"),
                          )}
                          style={{
                            width: col.width,
                            left: col.frozen ? leftOf(i) : undefined,
                          }}
                          onClick={(e) => {
                            if (e.metaKey || e.ctrlKey) toggleRow(row.id, true);
                            else if (!selected.includes(row.id)) setSelected([row.id]);
                          }}
                          onDoubleClick={() => {
                            if (readOnly) return;
                            setEditing({ rowId: row.id, colId: col.id });
                            setDraft(display(row.cells[col.id]));
                          }}
                        >
                          {isEdit ? (
                            <input
                              autoFocus
                              className="h-7 w-full rounded-sm border border-ring bg-card px-1 text-[13px] outline-none"
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              onBlur={commit}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") commit();
                                if (e.key === "Escape") setEditing(null);
                              }}
                            />
                          ) : (
                            <div className="min-w-0 flex-1">
                              <CellView column={col} cell={row.cells[col.id]} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex h-9 shrink-0 items-center gap-3 border-t border-border bg-card px-3 text-[12px] text-muted-foreground">
        <button
          type="button"
          className="inline-flex items-center gap-1 hover:text-foreground"
          onClick={() => addRow(table.id)}
        >
          <Plus className="size-3.5" />
          Строка
        </button>
        <span className="tabular">
          {rows.length.toLocaleString("ru-RU")} из {table.rows.length.toLocaleString("ru-RU")}
        </span>
        {selected.length > 0 ? (
          <span className="tabular">{selected.length} выбрано</span>
        ) : null}
      </div>
      {menu ? (
        <RowMenu
          x={menu.x}
          y={menu.y}
          onClose={() => setMenu(null)}
          onDelete={() => {
            deleteRows(table.id, selected.length ? selected : [menu.rowId]);
            setMenu(null);
          }}
          onDuplicate={() => {
            duplicateRows(table.id, selected.length ? selected : [menu.rowId]);
            setMenu(null);
          }}
        />
      ) : null}
    </div>
  );
}

function RowMenu({
  x,
  y,
  onClose,
  onDelete,
  onDuplicate,
}: {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [onClose]);
  return (
    <div
      className="fixed z-50 min-w-40 rounded-lg border border-border bg-card p-1 shadow-soft"
      style={{ left: x, top: y }}
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
        onClick={onDuplicate}
      >
        <Copy className="size-3.5" />
        Дублировать
      </button>
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-muted"
        onClick={onDelete}
      >
        <Trash2 className="size-3.5" />
        Удалить
      </button>
    </div>
  );
}
