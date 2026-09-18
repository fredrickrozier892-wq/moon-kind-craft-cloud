import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  Download,
  Filter,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AddColumnDialog } from "@/components/table/add-column-dialog";
import { DataGrid } from "@/components/table/data-grid";
import { FilterBuilder } from "@/components/table/filter-builder";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toCsv } from "@/lib/csv";
import { applyView, emptyFilterGroup, filterIsActive } from "@/lib/filters";
import type { TableDoc } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-store";

function typingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function TableWorkspace({ table }: { table: TableDoc }) {
  const search = useWorkspace((s) => s.search);
  const setSearch = useWorkspace((s) => s.setSearch);
  const selected = useWorkspace((s) => s.selectedRowIds);
  const setSelected = useWorkspace((s) => s.setSelected);
  const addColumn = useWorkspace((s) => s.addColumn);
  const addRow = useWorkspace((s) => s.addRow);
  const runEnrichment = useWorkspace((s) => s.runEnrichment);
  const runAiColumn = useWorkspace((s) => s.runAiColumn);
  const setFilters = useWorkspace((s) => s.setFilters);
  const importCsv = useWorkspace((s) => s.importCsv);
  const renameTable = useWorkspace((s) => s.renameTable);
  const toggleFavorite = useWorkspace((s) => s.toggleFavorite);
  const deleteRows = useWorkspace((s) => s.deleteRows);
  const duplicateRows = useWorkspace((s) => s.duplicateRows);
  const updateColumn = useWorkspace((s) => s.updateColumn);
  const exportToIntegration = useWorkspace((s) => s.exportToIntegration);
  const integrations = useWorkspace((s) => s.workspace?.integrations ?? []);
  const credits = useWorkspace((s) => s.workspace?.credits);

  const [addOpen, setAddOpen] = useState(false);
  const [rename, setRename] = useState(table.name);
  const [confirmRun, setConfirmRun] = useState<"enrich" | "ai" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRename(table.name);
  }, [table.name]);

  const visible = useMemo(() => applyView(table, search), [table, search]);
  const enrichCols = table.columns.filter((c) => c.type === "enrichment");
  const enrichCol = enrichCols[0];
  const aiCol = table.columns.find((c) => c.type === "ai");
  const targets = selected.length ? selected : visible.map((r) => r.id);
  const enrichCost = targets.length * 2;
  const aiCost = targets.length * 4;
  const amo = integrations.find((i) => i.provider === "amocrm");

  const fill = useMemo(
    () =>
      enrichCols.map((c) => {
        const total = table.rows.length;
        const found = table.rows.filter((r) => {
          const cell = r.cells[c.id];
          return cell?.status === "success" && cell.value != null && cell.value !== "";
        }).length;
        const spent = table.rows.reduce((s, r) => s + (r.cells[c.id]?.credits ?? 0), 0);
        return { id: c.id, name: c.name, total, found, spent };
      }),
    [enrichCols, table.rows],
  );

  function downloadCsv() {
    const headers = table.columns.map((c) => c.name);
    const lines = visible.map((r) =>
      table.columns.map((c) => String(r.cells[c.id]?.display ?? r.cells[c.id]?.value ?? "")),
    );
    const blob = new Blob([toCsv(headers, lines)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${table.name}.csv`;
    a.click();
  }

  async function handleRun(kind: "enrich" | "ai") {
    setConfirmRun(null);
    if (kind === "enrich" && enrichCol) {
      toast.message("Обогащение запущено", {
        description: `${targets.length} строк · ~${enrichCost} кр.`,
      });
      await runEnrichment(table.id, enrichCol.id, selected.length ? selected : undefined);
      toast.success("Обогащение завершено");
    }
    if (kind === "ai" && aiCol) {
      toast.message("AI-колонка", { description: `${targets.length} строк · ${aiCost} кр.` });
      await runAiColumn(table.id, aiCol.id, selected.length ? selected : undefined);
      toast.success("AI обработал строки");
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (typingTarget(e.target)) {
        if (e.key === "Escape") (e.target as HTMLElement).blur();
        return;
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "n" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        addRow(table.id);
      }
      if (e.key === "c" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setAddOpen(true);
      }
      if (e.key === "Escape") setSelected([]);
      if ((e.key === "Delete" || e.key === "Backspace") && selected.length) {
        e.preventDefault();
        deleteRows(table.id, selected);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (enrichCol) setConfirmRun("enrich");
        else if (aiCol) setConfirmRun("ai");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addRow, aiCol, deleteRows, enrichCol, selected, setSelected, table.id]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card px-3 py-2 md:px-4">
        <Link
          to="/app/tables"
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          aria-label="К таблицам"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(table.id)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="В избранное"
        >
          <Star
            className="size-4"
            fill={table.favorite ? "currentColor" : "none"}
          />
        </button>
        <input
          value={rename}
          onChange={(e) => setRename(e.target.value)}
          onBlur={() => rename.trim() && renameTable(table.id, rename.trim())}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold tracking-tight outline-none md:flex-none md:text-base"
        />
        <span className="hidden text-xs text-muted-foreground md:inline tabular">
          {formatNumber(visible.length)} строк
        </span>
        {fill[0] ? (
          <span className="hidden text-xs text-muted-foreground lg:inline tabular">
            {fill[0].name}: {fill[0].found}/{fill[0].total}
            {fill[0].total ? ` · ${Math.round((fill[0].found / fill[0].total) * 100)}%` : ""}
            {fill[0].spent ? ` · ${fill[0].spent} кр.` : ""}
          </span>
        ) : null}
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск"
              className="h-8 w-36 pl-7 md:w-48"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={filterIsActive(table.filters) ? "secondary" : "outline"}
                size="sm"
              >
                <Filter className="size-3.5" />
                Фильтр
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[min(420px,calc(100vw-24px))]">
              <p className="mb-2 text-sm font-medium">Условия</p>
              <FilterBuilder
                table={table}
                value={table.filters}
                onChange={(g) => setFilters(table.id, g)}
              />
              {filterIsActive(table.filters) ? (
                <Button
                  variant="ghost"
                  size="xs"
                  className="mt-2"
                  onClick={() => setFilters(table.id, emptyFilterGroup())}
                >
                  Сбросить
                </Button>
              ) : null}
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="size-3.5" />
            Колонка
          </Button>
          <Button size="sm" onClick={() => setConfirmRun(enrichCol ? "enrich" : aiCol ? "ai" : "enrich")}>
            <Play className="size-3.5" />
            {enrichCol ? "Обогатить" : "Запустить"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Ещё">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => addRow(table.id)}>
                Добавить строку
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileRef.current?.click()}>
                <Upload className="size-3.5" />
                Импорт CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadCsv}>
                <Download className="size-3.5" />
                Экспорт CSV
              </DropdownMenuItem>
              {aiCol ? (
                <DropdownMenuItem onClick={() => setConfirmRun("ai")}>
                  <Sparkles className="size-3.5" />
                  Запустить AI
                </DropdownMenuItem>
              ) : null}
              {enrichCols.length > 1
                ? enrichCols.map((c) => (
                    <DropdownMenuItem
                      key={c.id}
                      onClick={() => {
                        void (async () => {
                          toast.message(`Обогащение «${c.name}»`);
                          await runEnrichment(
                            table.id,
                            c.id,
                            selected.length ? selected : undefined,
                          );
                          toast.success("Готово");
                        })();
                      }}
                    >
                      Обогатить: {c.name}
                    </DropdownMenuItem>
                  ))
                : null}
              {table.columns.some((c) => c.hidden) ? (
                <DropdownMenuItem
                  onClick={() => {
                    for (const c of table.columns) {
                      if (c.hidden) updateColumn(table.id, c.id, { hidden: false });
                    }
                  }}
                >
                  Показать скрытые колонки
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              {amo ? (
                <DropdownMenuItem
                  onClick={() => {
                    const n = selected.length || visible.length;
                    exportToIntegration(amo.id, n);
                    toast.success(`✓ ${n} контактов экспортировано в amoCRM`);
                  }}
                >
                  Отправить в amoCRM
                </DropdownMenuItem>
              ) : null}
              {selected.length > 0 ? (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteRows(table.id, selected)}
                >
                  Удалить выбранные
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              const res = importCsv(table.id, text);
              toast.success(`Импортировано ${res.rows} строк`);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      {selected.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-accent px-3 py-1.5 text-[12px]">
          <span className="tabular font-medium">{selected.length} выбрано</span>
          {enrichCol ? (
            <Button size="xs" variant="outline" onClick={() => setConfirmRun("enrich")}>
              Обогатить
            </Button>
          ) : null}
          {aiCol ? (
            <Button size="xs" variant="outline" onClick={() => setConfirmRun("ai")}>
              AI
            </Button>
          ) : null}
          <Button
            size="xs"
            variant="outline"
            onClick={() => duplicateRows(table.id, selected)}
          >
            Дублировать
          </Button>
          {amo ? (
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                exportToIntegration(amo.id, selected.length);
                toast.success(`✓ ${selected.length} в amoCRM`);
              }}
            >
              В CRM
            </Button>
          ) : null}
          <Button
            size="xs"
            variant="ghost"
            className="text-destructive"
            onClick={() => deleteRows(table.id, selected)}
          >
            Удалить
          </Button>
          <Button size="xs" variant="ghost" onClick={() => setSelected([])}>
            Снять
          </Button>
        </div>
      ) : null}
      <DataGrid table={table} onAddColumn={() => setAddOpen(true)} />
      <AddColumnDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        table={table}
        onCreate={(c) => addColumn(table.id, c)}
      />
      <Dialog open={!!confirmRun} onOpenChange={(v) => !v && setConfirmRun(null)}>
        <DialogContent title={confirmRun === "ai" ? "Запустить AI" : "Запустить обогащение"}>
          <p className="text-sm text-muted-foreground">
            {targets.length} строк. Оценка:{" "}
            <span className="font-medium text-foreground tabular">
              {confirmRun === "ai" ? aiCost : enrichCost} кредитов
            </span>
            . Сейчас доступно Data {credits?.data ?? 0} / AI {credits?.ai ?? 0}.
          </p>
          {!enrichCol && confirmRun === "enrich" ? (
            <p className="text-sm text-muted-foreground">
              Нет колонки обогащения — добавьте её через «Колонка».
            </p>
          ) : null}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmRun(null)}>
              Отмена
            </Button>
            <Button
              disabled={confirmRun === "enrich" && !enrichCol}
              onClick={() => confirmRun && handleRun(confirmRun)}
            >
              Запустить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
