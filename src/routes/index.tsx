import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

const FLOW = [
  "Таблица",
  "Компании",
  "Обогащение",
  "AI",
  "Скоринг",
  "Аудитории",
  "Сигналы",
  "CRM",
];

const FEATURES = [
  {
    title: "Таблица как рабочий стол",
    body: "Редактирование ячеек, фильтры, сортировка, CSV и закреплённые колонки — без переключения в другую систему.",
  },
  {
    title: "Обогащение waterfall",
    body: "DaData, СПАРК, Контур. Если один провайдер молчит, следующий подхватывает. Видны стоимость, fill rate и статус.",
  },
  {
    title: "AI-колонка и агенты",
    body: "Промпт видит строку целиком. Агент собирает сайт, отрасль, размер и ICP — в JSON, который можно писать обратно в таблицу.",
  },
  {
    title: "Сигналы российского рынка",
    body: "Вакансии, смена ЛПР, ОКВЭД, тендеры. Не новости ради ленты — поводы зайти в сделку.",
  },
];

function Home() {
  const { isPending } = useCurrentUserState();
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Wordmark />
        <nav className="flex items-center gap-2">
          {isPending ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          ) : (
            <>
              <SignedOut>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Войти</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/login">Открыть пространство</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button size="sm" asChild>
                  <Link to="/app">К таблицам</Link>
                </Button>
              </SignedIn>
            </>
          )}
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 md:pt-20">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Российский B2B · GTM
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-[2.15rem] font-semibold leading-[1.12] tracking-tight md:text-[3.1rem]">
          Слой данных между рынком и продажами
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Пласт — таблица, которая знает ИНН, сайт, штат и ICP. Обогащайте компании,
          считайте скоринг и отправляйте готовые аудитории в amoCRM и Bitrix24.
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/login">
              Начать работу
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Посмотреть таблицу</Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap gap-1.5">
          {FLOW.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
              {i > 0 ? <span className="text-clay">/</span> : null}
              <span className="rounded-md bg-secondary px-2 py-0.5 text-foreground">{step}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-[13px] font-medium">Компании — ICP 2026</span>
            <span className="text-[11px] tabular text-muted-foreground">24 строки · 10 колонок</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead className="bg-muted/70 text-[11px] font-medium text-muted-foreground">
                <tr>
                  {["#", "Компания", "ИНН", "Сайт", "Email", "AI Score"].map((h) => (
                    <th key={h} className="border-b border-border px-3 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["1", "Яндекс", "7736207543", "yandex.ru", "partners@yandex-team.ru", "92"],
                  ["2", "VK", "7743001840", "vk.company", "b2b@vk.team", "87"],
                  ["3", "X5 Group", "7707030411", "x5.ru", "partners@x5.ru", "81"],
                  ["4", "СКБ Контур", "6663003127", "kontur.ru", "sales@skbkontur.ru", "84"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-border last:border-0">
                    {row.map((c, i) => (
                      <td
                        key={i}
                        className={`px-3 py-2 ${i === 5 ? "tabular font-medium text-success" : ""} ${i === 1 ? "font-medium" : ""}`}
                      >
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-2 px-4 pb-20 md:grid-cols-2">
        {FEATURES.map((f) => (
          <article key={f.title} className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-[15px] font-semibold">{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </article>
        ))}
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-4">
          {[
            { name: "Free", price: "0 ₽", note: "1 таблица, mock-провайдеры" },
            { name: "Launch", price: "9 900 ₽", note: "Команда, 25k кредитов" },
            { name: "Growth", price: "29 900 ₽", note: "Агенты, сигналы, CRM" },
            { name: "Enterprise", price: "По запросу", note: "Свои провайдеры, SLA" },
          ].map((p) => (
            <div key={p.name}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {p.name}
              </p>
              <p className="mt-1 font-display text-2xl">{p.price}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-muted-foreground">
          <span>Пласт · слой данных для роста продаж</span>
          <Link to="/login" className="hover:text-foreground">
            Войти
          </Link>
        </div>
      </footer>
    </div>
  );
}
