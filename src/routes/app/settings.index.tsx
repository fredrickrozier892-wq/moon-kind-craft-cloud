import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { MEMBER_ROLE_META, type MemberRole } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/app/settings/")({ component: SettingsPage });

function SettingsPage() {
  const user = useCurrentUser();
  const ws = useWorkspace((s) => s.workspace);
  const rename = useWorkspace((s) => s.renameWorkspace);
  const resetOnboarding = useWorkspace((s) => s.resetOnboarding);
  const inviteMember = useWorkspace((s) => s.inviteMember);
  const removeMember = useWorkspace((s) => s.removeMember);
  const setMemberRole = useWorkspace((s) => s.setMemberRole);
  const [name, setName] = useState(ws?.name ?? "");
  const [email, setEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [role, setRole] = useState<MemberRole>("editor");

  if (!ws) return null;

  return (
    <div className="mx-auto max-w-xl p-4 md:p-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Настройки</h1>
      <section className="mt-6 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Пространство</h2>
        <div className="mt-3">
          <Label htmlFor="ws">Название</Label>
          <Input
            id="ws"
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => {
              rename(name.trim() || ws.name);
              toast.success("Сохранено");
            }}
          >
            Сохранить
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              resetOnboarding();
              toast.message("Мастер запуска открыт");
            }}
          >
            Мастер запуска
          </Button>
        </div>
      </section>
      <section className="mt-4 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Команда</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Участники видят одно пространство. Приглашение пока mock — без писем.
        </p>
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border">
          {ws.members.map((m) => (
            <li key={m.id} className="flex items-center gap-2 px-3 py-2 text-sm">
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{m.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {m.email || "—"} · {m.status === "invited" ? "приглашён" : "активен"}
                </div>
              </div>
              {m.role === "owner" ? (
                <span className="text-xs text-muted-foreground">Владелец</span>
              ) : (
                <>
                  <select
                    className="h-7 rounded-md border border-input bg-card px-1.5 text-xs"
                    value={m.role}
                    onChange={(e) => setMemberRole(m.id, e.target.value as MemberRole)}
                  >
                    {(Object.keys(MEMBER_ROLE_META) as MemberRole[])
                      .filter((r) => r !== "owner")
                      .map((r) => (
                        <option key={r} value={r}>
                          {MEMBER_ROLE_META[r].label}
                        </option>
                      ))}
                  </select>
                  <Button size="xs" variant="ghost" onClick={() => removeMember(m.id)}>
                    Убрать
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Input
            placeholder="Имя"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />
          <Input
            placeholder="email@компания.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-2 flex gap-2">
          <select
            className="h-8 rounded-md border border-input bg-card px-2 text-xs"
            value={role}
            onChange={(e) => setRole(e.target.value as MemberRole)}
          >
            {(Object.keys(MEMBER_ROLE_META) as MemberRole[])
              .filter((r) => r !== "owner")
              .map((r) => (
                <option key={r} value={r}>
                  {MEMBER_ROLE_META[r].label}
                </option>
              ))}
          </select>
          <Button
            size="sm"
            disabled={!email.trim()}
            onClick={() => {
              inviteMember({ name: inviteName, email, role });
              setEmail("");
              setInviteName("");
              toast.success("Приглашение создано");
            }}
          >
            Пригласить
          </Button>
        </div>
      </section>
      <section className="mt-4 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Профиль</h2>
        <p className="mt-2 text-sm">{user?.displayName ?? "Пользователь"}</p>
        <p className="text-xs text-muted-foreground">{user?.primaryEmail ?? "—"}</p>
      </section>
      <section className="mt-4 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Клавиши</h2>
        <dl className="mt-2 space-y-1 text-sm">
          <Row k="⌘K" v="Командная палитра" />
          <Row k="⌘Z / ⌘⇧Z" v="Отменить / повторить" />
          <Row k="/" v="Фокус на поиск" />
          <Row k="n" v="Новая строка" />
          <Row k="c" v="Новая колонка" />
          <Row k="⌘Enter" v="Запуск обогащения" />
          <Row k="Delete" v="Удалить выбранные строки" />
          <Row k="Esc" v="Снять выделение" />
          <Row k="двойной клик" v="Редактировать ячейку" />
        </dl>
      </section>
      <section className="mt-4 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Провайдеры</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Сейчас работает mock-слой: DaData, СПАРК, Контур.Фокус, HeadHunter. Интерфейс
          провайдера можно заменить на реальный API без переписывания таблицы.
        </p>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{v}</dt>
      <dd className="shrink-0 font-mono text-xs">{k}</dd>
    </div>
  );
}
