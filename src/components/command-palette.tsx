import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useWorkspace } from "@/lib/workspace-store";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tables = useWorkspace((s) => s.workspace?.tables ?? []);
  const createTable = useWorkspace((s) => s.createTable);
  const addRow = useWorkspace((s) => s.addRow);
  const undo = useWorkspace((s) => s.undo);
  const redo = useWorkspace((s) => s.redo);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const tableMatch = pathname.match(/^\/app\/tables\/([^/]+)/);
  const tableId = tableMatch?.[1];

  function go(to: string, params?: Record<string, string>) {
    onOpenChange(false);
    if (params) void navigate({ to, params });
    else void navigate({ to });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Команды" className="overflow-hidden p-0 sm:max-w-lg">
        <Command
          className="bg-transparent"
          shouldFilter
          label="Командная палитра"
        >
          <Command.Input
            value={q}
            onValueChange={setQ}
            placeholder="Перейти, создать, отменить…"
            className="h-11 w-full border-b border-border bg-transparent px-4 text-sm outline-none"
          />
          <Command.List className="max-h-72 overflow-auto p-1.5">
            <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
              Ничего не найдено
            </Command.Empty>
            <Command.Group heading="Навигация" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
              <Item onSelect={() => go("/app")}>Обзор</Item>
              <Item onSelect={() => go("/app/tables")}>Таблицы</Item>
              <Item onSelect={() => go("/app/agents")}>Агенты</Item>
              <Item onSelect={() => go("/app/audiences")}>Аудитории</Item>
              <Item onSelect={() => go("/app/signals")}>Сигналы</Item>
              <Item onSelect={() => go("/app/integrations")}>Интеграции</Item>
              <Item onSelect={() => go("/app/billing")}>Тарифы</Item>
              <Item onSelect={() => go("/app/settings")}>Настройки</Item>
            </Command.Group>
            {tables.length ? (
              <Command.Group heading="Таблицы" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                {tables.map((t) => (
                  <Item
                    key={t.id}
                    onSelect={() => go("/app/tables/$tableId", { tableId: t.id })}
                  >
                    {t.name}
                  </Item>
                ))}
              </Command.Group>
            ) : null}
            <Command.Group heading="Действия" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-muted-foreground">
              <Item
                onSelect={() => {
                  const id = createTable({ name: "Новая таблица", templateId: "lead-gen" });
                  go("/app/tables/$tableId", { tableId: id });
                }}
              >
                Создать таблицу
              </Item>
              {tableId ? (
                <Item
                  onSelect={() => {
                    addRow(tableId);
                    onOpenChange(false);
                  }}
                >
                  Добавить строку
                </Item>
              ) : null}
              <Item
                onSelect={() => {
                  undo();
                  onOpenChange(false);
                }}
              >
                Отменить
              </Item>
              <Item
                onSelect={() => {
                  redo();
                  onOpenChange(false);
                }}
              >
                Повторить
              </Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function Item({
  children,
  onSelect,
}: {
  children: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={children}
      onSelect={onSelect}
      className="flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm text-foreground data-[selected=true]:bg-muted"
    >
      {children}
    </Command.Item>
  );
}
