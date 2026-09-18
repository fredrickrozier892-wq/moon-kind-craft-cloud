import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as formatNumber, t as Button } from "./button-BsuIlnCY.mjs";
import { p as Plus, r as Users } from "../_libs/lucide-react.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-CGOfacp1.mjs";
import { n as Label, t as Input } from "./label-BKCLw4Ud.mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as emptyFilterGroup, i as applyView, u as useWorkspace } from "./workspace-store-B-RjcRTR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as FilterBuilder } from "./filter-builder-BSyms9Nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audiences.index-CtueoSZB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AudiencesPage() {
	const ws = useWorkspace((s) => s.workspace);
	const createAudience = useWorkspace((s) => s.createAudience);
	const deleteAudience = useWorkspace((s) => s.deleteAudience);
	const applyAudience = useWorkspace((s) => s.applyAudience);
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("Enterprise SaaS");
	const [tableId, setTableId] = (0, import_react.useState)(ws?.tables[0]?.id ?? "");
	const table = ws?.tables.find((t) => t.id === tableId) ?? ws?.tables[0];
	const [filters, setFilters] = (0, import_react.useState)(emptyFilterGroup());
	const counts = (0, import_react.useMemo)(() => {
		if (!ws) return {};
		const map = {};
		for (const a of ws.audiences) {
			const t = ws.tables.find((x) => x.id === a.tableId);
			if (!t) {
				map[a.id] = 0;
				continue;
			}
			map[a.id] = applyView({
				...t,
				filters: a.filters
			}, "").length;
		}
		return map;
	}, [ws]);
	if (!ws) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold tracking-tight",
					children: "Аудитории"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Динамические выборки. Меняется таблица — меняется состав."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setOpen(true),
					disabled: !table,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Аудитория"]
				})]
			}),
			ws.audiences.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-xl border border-dashed border-border p-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mx-auto size-6 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Соберите первую аудиторию из фильтра таблицы."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
				children: ws.audiences.map((a) => {
					const t = ws.tables.find((x) => x.id === a.tableId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: a.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										t?.name ?? "таблица удалена",
										" · ",
										formatNumber(counts[a.id] ?? 0),
										" компаний"
									]
								})]
							}),
							t ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "xs",
								onClick: () => {
									const id = applyAudience(a.id);
									toast.success(`Фильтр «${a.name}» применён`);
									if (id) navigate({
										to: "/app/tables/$tableId",
										params: { tableId: id }
									});
								},
								children: "Применить"
							}) : null,
							t ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "xs",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/app/tables/$tableId",
									params: { tableId: t.id },
									children: "Открыть"
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "xs",
								onClick: () => deleteAudience(a.id),
								children: "Удалить"
							})
						]
					}, a.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Новая аудитория",
					children: table ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Название" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								value: name,
								onChange: (e) => setName(e.target.value)
							})] }),
							ws.tables.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Таблица" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1 h-9 w-full rounded-md border border-input bg-card px-2 text-sm",
								value: table.id,
								onChange: (e) => {
									setTableId(e.target.value);
									setFilters(emptyFilterGroup());
								},
								children: ws.tables.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t.id,
									children: t.name
								}, t.id))
							})] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBuilder, {
								table,
								value: filters,
								onChange: setFilters
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									createAudience({
										name,
										tableId: table.id,
										filters
									});
									setOpen(false);
									setFilters(emptyFilterGroup());
								},
								children: "Создать"
							})
						]
					}) : null
				})
			})
		]
	});
}
//#endregion
export { AudiencesPage as component };
