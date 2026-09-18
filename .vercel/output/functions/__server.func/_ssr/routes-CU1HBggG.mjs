import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-BsuIlnCY.mjs";
import { O as ArrowRight } from "../_libs/lucide-react.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Wordmark } from "./brand-NJEv3Ez3.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { n as SignedIn, r as SignedOut } from "./gates-uw_RvcsB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CU1HBggG.js
var import_jsx_runtime = require_jsx_runtime();
var FLOW = [
	"Таблица",
	"Компании",
	"Обогащение",
	"AI",
	"Скоринг",
	"Аудитории",
	"Сигналы",
	"CRM"
];
var FEATURES = [
	{
		title: "Таблица как рабочий стол",
		body: "Редактирование ячеек, фильтры, сортировка, CSV и закреплённые колонки — без переключения в другую систему."
	},
	{
		title: "Обогащение waterfall",
		body: "DaData, СПАРК, Контур. Если один провайдер молчит, следующий подхватывает. Видны стоимость, fill rate и статус."
	},
	{
		title: "AI-колонка и агенты",
		body: "Промпт видит строку целиком. Агент собирает сайт, отрасль, размер и ICP — в JSON, который можно писать обратно в таблицу."
	},
	{
		title: "Сигналы российского рынка",
		body: "Вакансии, смена ЛПР, ОКВЭД, тендеры. Не новости ради ленты — поводы зайти в сделку."
	}
];
function Home() {
	const { isPending } = useCurrentUserState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex items-center gap-2",
					children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-20 animate-pulse rounded-md bg-muted" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedOut, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Войти"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Открыть пространство"
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app",
							children: "К таблицам"
						})
					}) })] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 pb-16 pt-12 md:pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground",
						children: "Российский B2B · GTM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-3xl font-display text-[2.15rem] font-semibold leading-[1.12] tracking-tight md:text-[3.1rem]",
						children: "Слой данных между рынком и продажами"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground",
						children: "Пласт — таблица, которая знает ИНН, сайт, штат и ICP. Обогащайте компании, считайте скоринг и отправляйте готовые аудитории в amoCRM и Bitrix24."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/login",
								children: ["Начать работу", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Посмотреть таблицу"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex flex-wrap gap-1.5",
						children: FLOW.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 text-[12px] text-muted-foreground",
							children: [i > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-clay",
								children: "/"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-secondary px-2 py-0.5 text-foreground",
								children: step
							})]
						}, step))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-6xl px-4 pb-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-xl border border-border bg-card shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[13px] font-medium",
							children: "Компании — ICP 2026"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] tabular text-muted-foreground",
							children: "24 строки · 10 колонок"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[720px] text-left text-[13px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted/70 text-[11px] font-medium text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
									"#",
									"Компания",
									"ИНН",
									"Сайт",
									"Email",
									"AI Score"
								].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border-b border-border px-3 py-2 font-medium",
									children: h
								}, h)) })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
								[
									"1",
									"Яндекс",
									"7736207543",
									"yandex.ru",
									"partners@yandex-team.ru",
									"92"
								],
								[
									"2",
									"VK",
									"7743001840",
									"vk.company",
									"b2b@vk.team",
									"87"
								],
								[
									"3",
									"X5 Group",
									"7707030411",
									"x5.ru",
									"partners@x5.ru",
									"81"
								],
								[
									"4",
									"СКБ Контур",
									"6663003127",
									"kontur.ru",
									"sales@skbkontur.ru",
									"84"
								]
							].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: "border-b border-border last:border-0",
								children: row.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: `px-3 py-2 ${i === 5 ? "tabular font-medium text-success" : ""} ${i === 1 ? "font-medium" : ""}`,
									children: c
								}, i))
							}, row[0])) })]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto grid max-w-6xl gap-2 px-4 pb-20 md:grid-cols-2",
				children: FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[15px] font-semibold",
						children: f.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: f.body
					})]
				}, f.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-4",
					children: [
						{
							name: "Free",
							price: "0 ₽",
							note: "1 таблица, mock-провайдеры"
						},
						{
							name: "Launch",
							price: "9 900 ₽",
							note: "Команда, 25k кредитов"
						},
						{
							name: "Growth",
							price: "29 900 ₽",
							note: "Агенты, сигналы, CRM"
						},
						{
							name: "Enterprise",
							price: "По запросу",
							note: "Свои провайдеры, SLA"
						}
					].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl",
							children: p.price
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: p.note
						})
					] }, p.name))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Пласт · слой данных для роста продаж" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "hover:text-foreground",
						children: "Войти"
					})]
				})
			})
		]
	});
}
//#endregion
export { Home as component };
