import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as formatRelative, i as formatNumber, t as Button } from "./button-BsuIlnCY.mjs";
import { c as Star, i as Upload, p as Plus, s as Table2 } from "../_libs/lucide-react.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-CGOfacp1.mjs";
import { n as Label, t as Input } from "./label-BKCLw4Ud.mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as TABLE_TEMPLATES, u as useWorkspace } from "./workspace-store-B-RjcRTR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Skeleton } from "./skeleton-gukXFkdc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tables.index-wdq34lIG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TablesPage() {
	const ws = useWorkspace((s) => s.workspace);
	const loading = useWorkspace((s) => s.loading);
	const createTable = useWorkspace((s) => s.createTable);
	const deleteTable = useWorkspace((s) => s.deleteTable);
	const toggleFavorite = useWorkspace((s) => s.toggleFavorite);
	const importCsv = useWorkspace((s) => s.importCsv);
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("Новая таблица");
	const [template, setTemplate] = (0, import_react.useState)("lead-gen");
	const [tab, setTab] = (0, import_react.useState)("all");
	const fileRef = (0, import_react.useRef)(null);
	if (loading || !ws) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-40" })
	});
	const list = tab === "fav" ? ws.tables.filter((t) => t.favorite) : ws.tables;
	function make(empty) {
		const id = createTable({
			name: name.trim() || "Таблица",
			templateId: empty ? void 0 : template,
			empty
		});
		setOpen(false);
		navigate({
			to: "/app/tables/$tableId",
			params: { tableId: id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold tracking-tight",
					children: "Таблицы"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [ws.tables.length, " в пространстве"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => fileRef.current?.click(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), "CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Создать"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-1 rounded-lg bg-muted p-1 w-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `rounded-md px-3 py-1 text-xs font-medium ${tab === "all" ? "bg-card shadow-sm" : "text-muted-foreground"}`,
					onClick: () => setTab("all"),
					children: "Все"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `rounded-md px-3 py-1 text-xs font-medium ${tab === "fav" ? "bg-card shadow-sm" : "text-muted-foreground"}`,
					onClick: () => setTab("fav"),
					children: "Избранные"
				})]
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-xl border border-dashed border-border p-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table2, { className: "mx-auto size-6 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Пока пусто. Создайте таблицу или возьмите шаблон."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						onClick: () => setOpen(true),
						children: "Создать таблицу"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
				children: list.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 px-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => toggleFavorite(t.id),
							className: "text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
								className: "size-4",
								fill: t.favorite ? "currentColor" : "none"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/app/tables/$tableId",
							params: { tableId: t.id },
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium",
								children: t.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									formatNumber(t.rows.length),
									" строк · ",
									t.columns.length,
									" колонок ·",
									" ",
									formatRelative(t.updatedAt)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "xs",
							onClick: () => {
								if (confirm("Удалить таблицу?")) deleteTable(t.id);
							},
							children: "Удалить"
						})
					]
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-sm font-semibold",
				children: "Шаблоны"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
				children: TABLE_TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						const id = createTable({
							name: t.name,
							templateId: t.id
						});
						navigate({
							to: "/app/tables/$tableId",
							params: { tableId: id }
						});
					},
					className: "rounded-xl border border-border bg-card p-4 text-left hover:bg-muted/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: t.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: t.description
					})]
				}, t.id))
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
					const res = importCsv(id, text);
					toast.success(`Импортировано ${res.rows} строк`);
					navigate({
						to: "/app/tables/$tableId",
						params: { tableId: id }
					});
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Новая таблица",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Название" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								value: name,
								onChange: (e) => setName(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Шаблон" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1 h-9 w-full rounded-md border border-input bg-card px-2 text-sm",
								value: template,
								onChange: (e) => setTemplate(e.target.value),
								children: TABLE_TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t.id,
									children: t.name
								}, t.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => make(true),
									children: "Пустая"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => make(),
									children: "Создать"
								})]
							})
						]
					})
				})
			})
		]
	});
}
//#endregion
export { TablesPage as component };
