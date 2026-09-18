import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { INTEGRATION_META, type WebhookEvent } from "@/lib/types";
import { formatRelative } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/app/integrations/")({
  component: IntegrationsPage,
});

const EVENTS: { id: WebhookEvent; label: string }[] = [
  { id: "row_created", label: "Строка создана" },
  { id: "row_updated", label: "Строка обновлена" },
  { id: "enrichment_completed", label: "Обогащение завершено" },
  { id: "signal_detected", label: "Сигнал" },
  { id: "ai_completed", label: "AI завершён" },
];

function IntegrationsPage() {
  const ws = useWorkspace((s) => s.workspace);
  const toggle = useWorkspace((s) => s.toggleIntegration);
  const exportTo = useWorkspace((s) => s.exportToIntegration);
  const addWebhook = useWorkspace((s) => s.addWebhook);
  const testWebhook = useWorkspace((s) => s.testWebhook);
  const deleteWebhook = useWorkspace((s) => s.deleteWebhook);
  const toggleWebhook = useWorkspace((s) => s.toggleWebhook);
  const [url, setUrl] = useState("https://example.com/webhook");
  const rows = ws?.tables[0]?.rows.length ?? 0;

  if (!ws) return null;

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Интеграции</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        amoCRM, Bitrix24, 1С, Telegram, VK, почта и webhooks. Пока mock-коннекторы.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {ws.integrations
          .filter((i) => i.provider !== "webhook")
          .map((i) => (
            <div key={i.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{INTEGRATION_META[i.provider].label}</div>
                  <div className="text-xs text-muted-foreground">
                    {INTEGRATION_META[i.provider].hint}
                  </div>
                </div>
                <Badge variant={i.connected ? "success" : "outline"}>
                  {i.connected ? "подключено" : "выкл"}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => toggle(i.id)}>
                  {i.connected ? "Отключить" : "Подключить"}
                </Button>
                <Button
                  size="sm"
                  disabled={!i.connected && i.provider !== "email"}
                  onClick={() => {
                    const n = rows || 12;
                    exportTo(i.id, n);
                    toast.success(`✓ ${n} контактов экспортировано в ${i.name}`);
                  }}
                >
                  Отправить
                </Button>
              </div>
              {i.lastExportAt ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  {i.lastCount} шт · {formatRelative(i.lastExportAt)}
                </p>
              ) : null}
            </div>
          ))}
      </div>

      <h2 className="mt-10 text-sm font-semibold">Webhooks</h2>
      <div className="mt-2 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <Label>URL</Label>
            <Input className="mt-1" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <Button
            className="sm:self-end"
            onClick={() => {
              addWebhook(
                url,
                EVENTS.map((e) => e.id),
              );
              toast.success("Webhook добавлен");
            }}
          >
            Добавить
          </Button>
        </div>
        <ul className="mt-4 space-y-3">
          {ws.webhooks.map((w) => (
            <li key={w.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <code className="truncate text-xs">{w.url}</code>
                <Switch
                  checked={w.enabled}
                  onCheckedChange={() => toggleWebhook(w.id)}
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {w.events.join(" · ")}
              </p>
              <div className="mt-2 flex gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={async () => {
                    const res = await testWebhook(w.id);
                    toast[res.ok ? "success" : "error"](
                      res.ok ? "Тестовая отправка прошла" : "Ошибка отправки",
                    );
                  }}
                >
                  Тест
                </Button>
                <Button size="xs" variant="ghost" onClick={() => deleteWebhook(w.id)}>
                  Удалить
                </Button>
                {w.lastTestAt ? (
                  <span className="text-[11px] text-muted-foreground">
                    {w.lastStatus} · {formatRelative(w.lastTestAt)}
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
