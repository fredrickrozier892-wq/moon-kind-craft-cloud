import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  CreditCard,
  LayoutDashboard,
  Menu,
  Radio,
  Settings,
  Table2,
  Users,
  Workflow,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Wordmark } from "@/components/brand";
import { CommandPalette } from "@/components/command-palette";
import { OnboardingWizard } from "@/components/onboarding/wizard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useWorkspace } from "@/lib/workspace-store";
import { cn, formatCredits } from "@/lib/utils";

const NAV = [
  { to: "/app", label: "Обзор", icon: LayoutDashboard, exact: true },
  { to: "/app/tables", label: "Таблицы", icon: Table2 },
  { to: "/app/agents", label: "Агенты", icon: Bot },
  { to: "/app/audiences", label: "Аудитории", icon: Users },
  { to: "/app/signals", label: "Сигналы", icon: Radio },
  { to: "/app/integrations", label: "Интеграции", icon: Workflow },
  { to: "/app/billing", label: "Тарифы", icon: CreditCard },
  { to: "/app/settings", label: "Настройки", icon: Settings },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const favorites = useWorkspace(
    (s) => s.workspace?.tables.filter((t) => t.favorite) ?? [],
  );
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-2">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.to
          : pathname === item.to || pathname.startsWith(item.to + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            className={cn(
              "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition-colors duration-150",
              active
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-muted hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
      {favorites.length > 0 ? (
        <div className="mt-3">
          <p className="px-2.5 pb-1 text-[10px] font-medium uppercase tracking-wider text-sidebar-muted">
            Избранные
          </p>
          {favorites.slice(0, 6).map((t) => {
            const href = `/app/tables/${t.id}`;
            const on = pathname === href;
            return (
              <Link
                key={t.id}
                to="/app/tables/$tableId"
                params={{ tableId: t.id }}
                onClick={onClick}
                className={cn(
                  "flex h-8 items-center truncate rounded-md px-2.5 text-[12px] transition-colors",
                  on
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-muted hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
                )}
              >
                {t.name}
              </Link>
            );
          })}
        </div>
      ) : null}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const credits = useWorkspace((s) => s.workspace?.credits);
  const unread = useWorkspace(
    (s) => s.workspace?.signals.filter((x) => !x.read).length ?? 0,
  );
  return (
    <>
      <div className="flex h-12 items-center px-4">
        <Link to="/app" onClick={onNavigate}>
          <Wordmark light />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <NavLinks onClick={onNavigate} />
      </div>
      {unread > 0 ? (
        <p className="px-4 pb-2 text-[11px] text-sidebar-muted">
          {unread} новых сигналов
        </p>
      ) : null}
      <div className="border-t border-sidebar-border px-3 py-3">
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-sidebar-muted">
          Кредиты
        </p>
        <div className="grid grid-cols-3 gap-1 text-[11px] text-sidebar-foreground">
          <div>
            <div className="text-sidebar-muted">Data</div>
            <div className="tabular font-medium">
              {formatCredits(credits?.data ?? 0)}
            </div>
          </div>
          <div>
            <div className="text-sidebar-muted">AI</div>
            <div className="tabular font-medium">
              {formatCredits(credits?.ai ?? 0)}
            </div>
          </div>
          <div>
            <div className="text-sidebar-muted">Act</div>
            <div className="tabular font-medium">
              {formatCredits(credits?.actions ?? 0)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const bootstrap = useWorkspace((s) => s.bootstrap);
  const undo = useWorkspace((s) => s.undo);
  const redo = useWorkspace((s) => s.redo);
  const loading = useWorkspace((s) => s.loading);
  const onboarded = useWorkspace((s) => s.workspace?.onboardingComplete);
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    if (!isPending && user) void bootstrap();
  }, [isPending, user, bootstrap]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
        return;
      }
      if (meta && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  if (!loading && onboarded === false) {
    return <OnboardingWizard />;
  }

  return (
    <div className="flex h-dvh min-h-0 bg-background">
      <aside className="hidden w-[220px] shrink-0 flex-col bg-sidebar md:flex">
        <SidebarBody />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-3 md:px-4">
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Меню">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SidebarBody onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <Wordmark />
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <Activity className="size-3.5" />
            Рабочее пространство
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              className="hidden font-mono text-[11px] text-muted-foreground md:inline-flex"
              onClick={() => setPalette(true)}
            >
              ⌘K
            </Button>
            {isPending ? (
              <div className="size-8 animate-pulse rounded-full bg-muted" />
            ) : (
              <UserButton />
            )}
          </div>
        </header>
        <main className="min-h-0 min-w-0 flex-1 overflow-auto">{children}</main>
      </div>
      <CommandPalette open={palette} onOpenChange={setPalette} />
    </div>
  );
}
