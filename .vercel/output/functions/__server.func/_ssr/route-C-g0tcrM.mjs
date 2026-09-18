import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn, r as formatCredits, t as Button } from "./button-BsuIlnCY.mjs";
import { A as Activity, T as Bot, _ as LayoutDashboard, f as Radio, h as Menu, n as Workflow, r as Users, s as Table2, t as X, u as Settings, x as CreditCard } from "../_libs/lucide-react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as DialogContent$1, t as Dialog$1 } from "./dialog-CGOfacp1.mjs";
import { b as useNavigate, d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as TABLE_TEMPLATES, u as useWorkspace } from "./workspace-store-B-RjcRTR.mjs";
import { o as ONBOARDING_GOALS } from "./types-IAoun2Tf.mjs";
import { t as Wordmark } from "./brand-NJEv3Ez3.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { i as UserButton, t as RedirectToSignIn } from "./gates-uw_RvcsB.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-C-g0tcrM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommandPalette({ open, onOpenChange }) {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const tables = useWorkspace((s) => s.workspace?.tables ?? []);
	const createTable = useWorkspace((s) => s.createTable);
	const addRow = useWorkspace((s) => s.addRow);
	const undo = useWorkspace((s) => s.undo);
	const redo = useWorkspace((s) => s.redo);
	const [q, setQ] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) setQ("");
	}, [open]);
	const tableId = pathname.match(/^\/app\/tables\/([^/]+)/)?.[1];
	function go(to, params) {
		onOpenChange(false);
		if (params) navigate({
			to,
			params
		});
		else navigate({ to });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent$1, {
			title: "Команды",
			className: "overflow-hidden p-0 sm:max-w-lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e, {
				className: "bg-transparent",
				shouldFilter: true,
				label: "Командная палитра",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
					value: q,
					onValueChange: setQ,
					placeholder: "Перейти, создать, отменить…",
					className: "h-11 w-full border-b border-border bg-transparent px-4 text-sm outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.List, {
					className: "max-h-72 overflow-auto p-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
							className: "px-3 py-6 text-center text-sm text-muted-foreground",
							children: "Ничего не найдено"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
							heading: "Навигация",
							className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => go("/app"),
									children: "Обзор"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => go("/app/tables"),
									children: "Таблицы"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => go("/app/agents"),
									children: "Агенты"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => go("/app/audiences"),
									children: "Аудитории"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => go("/app/signals"),
									children: "Сигналы"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => go("/app/integrations"),
									children: "Интеграции"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => go("/app/billing"),
									children: "Тарифы"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => go("/app/settings"),
									children: "Настройки"
								})
							]
						}),
						tables.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
							heading: "Таблицы",
							className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
							children: tables.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								onSelect: () => go("/app/tables/$tableId", { tableId: t.id }),
								children: t.name
							}, t.id))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
							heading: "Действия",
							className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => {
										go("/app/tables/$tableId", { tableId: createTable({
											name: "Новая таблица",
											templateId: "lead-gen"
										}) });
									},
									children: "Создать таблицу"
								}),
								tableId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => {
										addRow(tableId);
										onOpenChange(false);
									},
									children: "Добавить строку"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => {
										undo();
										onOpenChange(false);
									},
									children: "Отменить"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onSelect: () => {
										redo();
										onOpenChange(false);
									},
									children: "Повторить"
								})
							]
						})
					]
				})]
			})
		})
	});
}
function Item({ children, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
		value: children,
		onSelect,
		className: "flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm text-foreground data-[selected=true]:bg-muted",
		children
	});
}
function OnboardingWizard() {
	const navigate = useNavigate();
	const complete = useWorkspace((s) => s.completeOnboarding);
	const createTable = useWorkspace((s) => s.createTable);
	const importCsv = useWorkspace((s) => s.importCsv);
	const tables = useWorkspace((s) => s.workspace?.tables ?? []);
	const [goal, setGoal] = (0, import_react.useState)("find-leads");
	const [step, setStep] = (0, import_react.useState)(1);
	const fileRef = (0, import_react.useRef)(null);
	function finish(tableId) {
		complete(goal, tableId);
		const id = tableId ?? tables[0]?.id;
		if (id) navigate({
			to: "/app/tables/$tableId",
			params: { tableId: id }
		});
		else navigate({ to: "/app" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "flex h-12 items-center px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-16 pt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground",
				children: [
					"Шаг ",
					step,
					" из 2"
				]
			}), step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-2xl font-semibold tracking-tight",
					children: "Что хотите сделать?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "От этого зависит стартовый шаблон. Потом можно сменить."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 space-y-1.5",
					children: ONBOARDING_GOALS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setGoal(g.id),
						className: cn("flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition-colors", goal === g.id ? "border-primary bg-accent" : "border-border bg-card hover:bg-muted/60"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-0.5 size-3.5 shrink-0 rounded-full border", goal === g.id ? "border-primary bg-primary" : "border-input bg-card") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-medium",
							children: g.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-xs text-muted-foreground",
							children: g.hint
						})] })]
					}) }, g.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setStep(2),
						children: "Дальше"
					})
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-2xl font-semibold tracking-tight",
					children: "Первая таблица"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Импорт, шаблон или пустая сетка. Демо-список российских компаний уже подготовлен."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "h-auto justify-start py-3",
							onClick: () => fileRef.current?.click(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium",
									children: "Импорт CSV"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-normal text-muted-foreground",
									children: "Колонки подхватятся из заголовков файла"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "h-auto justify-start py-3",
							onClick: () => {
								finish(createTable({
									name: "Моя первая таблица",
									empty: true
								}));
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium",
									children: "Пустая таблица"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-normal text-muted-foreground",
									children: "Одна колонка «Компания» — остальное добавите сами"
								})]
							})
						}),
						TABLE_TEMPLATES.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "h-auto justify-start py-3",
							onClick: () => {
								finish(createTable({
									name: t.name,
									templateId: t.id
								}));
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-normal text-muted-foreground",
									children: t.description
								})]
							})
						}, t.id))
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setStep(1),
						children: "Назад"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => finish(tables[0]?.id),
						children: "Открыть демо-таблицу"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileRef,
					type: "file",
					accept: ".csv,text/csv",
					className: "hidden",
					onChange: async (e) => {
						const file = e.target.files?.[0];
						if (!file) return;
						const id = createTable({
							name: file.name.replace(/\.csv$/i, ""),
							empty: true
						});
						const text = await file.text();
						importCsv(id, text);
						finish(id);
					}
				})
			] })]
		})]
	});
}
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
function SheetContent({ className, children, side = "left", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex h-full w-[min(280px,88vw)] flex-col bg-sidebar text-sidebar-foreground shadow-soft outline-none", side === "left" ? "left-0 top-0" : "right-0 top-0", className),
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: "Меню"
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
				className: "absolute right-2 top-2 rounded-md p-1 text-sidebar-muted hover:bg-sidebar-accent",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})
		]
	})] });
}
var NAV = [
	{
		to: "/app",
		label: "Обзор",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/app/tables",
		label: "Таблицы",
		icon: Table2
	},
	{
		to: "/app/agents",
		label: "Агенты",
		icon: Bot
	},
	{
		to: "/app/audiences",
		label: "Аудитории",
		icon: Users
	},
	{
		to: "/app/signals",
		label: "Сигналы",
		icon: Radio
	},
	{
		to: "/app/integrations",
		label: "Интеграции",
		icon: Workflow
	},
	{
		to: "/app/billing",
		label: "Тарифы",
		icon: CreditCard
	},
	{
		to: "/app/settings",
		label: "Настройки",
		icon: Settings
	}
];
function NavLinks({ onClick }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const favorites = useWorkspace((s) => s.workspace?.tables.filter((t) => t.favorite) ?? []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "flex flex-1 flex-col gap-0.5 px-2",
		children: [NAV.map((item) => {
			const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick,
				className: cn("flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition-colors duration-150", active ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), item.label]
			}, item.to);
		}), favorites.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2.5 pb-1 text-[10px] font-medium uppercase tracking-wider text-sidebar-muted",
				children: "Избранные"
			}), favorites.slice(0, 6).map((t) => {
				const href = `/app/tables/${t.id}`;
				const on = pathname === href;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/tables/$tableId",
					params: { tableId: t.id },
					onClick,
					className: cn("flex h-8 items-center truncate rounded-md px-2.5 text-[12px] transition-colors", on ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"),
					children: t.name
				}, t.id);
			})]
		}) : null]
	});
}
function SidebarBody({ onNavigate }) {
	const credits = useWorkspace((s) => s.workspace?.credits);
	const unread = useWorkspace((s) => s.workspace?.signals.filter((x) => !x.read).length ?? 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-12 items-center px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app",
				onClick: onNavigate,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { light: true })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto py-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { onClick: onNavigate })
		}),
		unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "px-4 pb-2 text-[11px] text-sidebar-muted",
			children: [unread, " новых сигналов"]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-sidebar-border px-3 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1.5 text-[10px] font-medium uppercase tracking-wider text-sidebar-muted",
				children: "Кредиты"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-1 text-[11px] text-sidebar-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sidebar-muted",
						children: "Data"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "tabular font-medium",
						children: formatCredits(credits?.data ?? 0)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sidebar-muted",
						children: "AI"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "tabular font-medium",
						children: formatCredits(credits?.ai ?? 0)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sidebar-muted",
						children: "Act"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "tabular font-medium",
						children: formatCredits(credits?.actions ?? 0)
					})] })
				]
			})]
		})
	] });
}
function AppShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const bootstrap = useWorkspace((s) => s.bootstrap);
	const undo = useWorkspace((s) => s.undo);
	const redo = useWorkspace((s) => s.redo);
	const loading = useWorkspace((s) => s.loading);
	const onboarded = useWorkspace((s) => s.workspace?.onboardingComplete);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [palette, setPalette] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!isPending && user) bootstrap();
	}, [
		isPending,
		user,
		bootstrap
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
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
	if (!loading && onboarded === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingWizard, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden w-[220px] shrink-0 flex-col bg-sidebar md:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-3 md:px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 md:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
								open,
								onOpenChange: setOpen,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Меню",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, { onNavigate: () => setOpen(false) }) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-2 text-xs text-muted-foreground md:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }), "Рабочее пространство"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "xs",
								className: "hidden font-mono text-[11px] text-muted-foreground md:inline-flex",
								onClick: () => setPalette(true),
								children: "⌘K"
							}), isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-pulse rounded-full bg-muted" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-h-0 min-w-0 flex-1 overflow-auto",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {
				open: palette,
				onOpenChange: setPalette
			})
		]
	});
}
function AppLayout() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-dvh items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 animate-pulse rounded-md bg-muted" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { AppLayout as component };
