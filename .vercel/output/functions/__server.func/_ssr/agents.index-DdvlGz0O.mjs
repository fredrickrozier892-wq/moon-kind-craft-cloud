import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as formatRelative, t as Button } from "./button-BsuIlnCY.mjs";
import { m as Play, o as Trash2, p as Plus, s as Table2 } from "../_libs/lucide-react.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-CGOfacp1.mjs";
import { n as Label, r as Textarea, t as Input } from "./label-BKCLw4Ud.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as useWorkspace } from "./workspace-store-B-RjcRTR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agents.index-DdvlGz0O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AgentsPage() {
	const ws = useWorkspace((s) => s.workspace);
	const runAgent = useWorkspace((s) => s.runAgent);
	const createAgent = useWorkspace((s) => s.createAgent);
	const deleteAgent = useWorkspace((s) => s.deleteAgent);
	const ingest = useWorkspace((s) => s.ingestAgentResult);
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("Lead Researcher");
	const [goal, setGoal] = (0, import_react.useState)("Найти потенциальных клиентов.");
	const [company, setCompany] = (0, import_react.useState)("Яндекс");
	const [runningId, setRunningId] = (0, import_react.useState)(null);
	if (!ws) return null;
	const tableId = ws.tables[0]?.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold tracking-tight",
					children: "Агенты"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Исследователи, которые проходят по строке и возвращают JSON."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Агент"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-3",
				children: ws.agents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold",
									children: a.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: a.goal
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: ["Вход: ", a.input]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "mt-2 list-decimal pl-4 text-sm",
									children: a.tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t.title }, t.id))
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									disabled: runningId === a.id || a.status === "running",
									onClick: async () => {
										setRunningId(a.id);
										await runAgent(a.id, company);
										setRunningId(null);
										toast.success(`Агент «${a.name}» завершил прогон`);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), "Запуск"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => deleteAgent(a.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "h-8 w-40",
								value: company,
								onChange: (e) => setCompany(e.target.value),
								placeholder: "Компания"
							}), a.lastRunAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: formatRelative(a.lastRunAt)
							}) : null]
						}),
						a.lastResult ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "mt-3 overflow-auto rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed",
							children: a.lastResult
						}), tableId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "xs",
							variant: "outline",
							className: "mt-2",
							onClick: () => {
								ingest(tableId, company, a.lastResult ?? "");
								toast.success("Записано в таблицу");
								navigate({
									to: "/app/tables/$tableId",
									params: { tableId }
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table2, { className: "size-3.5" }), "В таблицу"]
						}) : null] }) : null
					]
				}, a.id))
			}),
			ws.agents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted-foreground",
				children: "Агентов нет. Создайте Lead Researcher."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Новый агент",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Имя" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								value: name,
								onChange: (e) => setName(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Цель" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-1",
								value: goal,
								onChange: (e) => setGoal(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									createAgent({
										name,
										goal,
										input: "Company",
										tasks: [
											{
												id: "1",
												title: "Найти сайт"
											},
											{
												id: "2",
												title: "Определить отрасль"
											},
											{
												id: "3",
												title: "Найти размер компании"
											},
											{
												id: "4",
												title: "Определить ICP fit"
											},
											{
												id: "5",
												title: "Дать объяснение"
											}
										],
										output: "json"
									});
									setOpen(false);
								},
								children: "Создать"
							})
						]
					})
				})
			})
		]
	});
}
//#endregion
export { AgentsPage as component };
