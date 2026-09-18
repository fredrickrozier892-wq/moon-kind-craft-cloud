import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { s as nid, t as Button } from "./button-BsuIlnCY.mjs";
import { o as Trash2, p as Plus } from "../_libs/lucide-react.mjs";
import { t as Input } from "./label-BKCLw4Ud.mjs";
import { t as FILTER_OPS } from "./workspace-store-B-RjcRTR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/filter-builder-BSyms9Nf.js
var import_jsx_runtime = require_jsx_runtime();
function FilterBuilder({ table, value, onChange }) {
	function updateChild(i, child) {
		const children = [...value.children];
		children[i] = child;
		onChange({
			...value,
			children
		});
	}
	function remove(i) {
		onChange({
			...value,
			children: value.children.filter((_, idx) => idx !== i)
		});
	}
	function add() {
		const cond = {
			id: nid("fc"),
			kind: "cond",
			columnId: table.columns[0]?.id ?? "",
			op: "not_empty"
		};
		onChange({
			...value,
			children: [...value.children, cond]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Соединять"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `rounded-md px-2 py-0.5 text-xs ${value.combinator === "and" ? "bg-secondary font-medium" : "hover:bg-muted"}`,
						onClick: () => onChange({
							...value,
							combinator: "and"
						}),
						children: "AND"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `rounded-md px-2 py-0.5 text-xs ${value.combinator === "or" ? "bg-secondary font-medium" : "hover:bg-muted"}`,
						onClick: () => onChange({
							...value,
							combinator: "or"
						}),
						children: "OR"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `rounded-md px-2 py-0.5 text-xs ${value.not ? "bg-secondary font-medium" : "hover:bg-muted"}`,
						onClick: () => onChange({
							...value,
							not: !value.not
						}),
						children: "NOT"
					})
				]
			}),
			value.children.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Нет условий — показаны все строки."
			}) : null,
			value.children.map((child, i) => {
				if (child.kind !== "cond") return null;
				const needsValue = !["empty", "not_empty"].includes(child.op);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-8 rounded-md border border-input bg-card px-2 text-xs",
							value: child.columnId,
							onChange: (e) => updateChild(i, {
								...child,
								columnId: e.target.value
							}),
							children: table.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-8 rounded-md border border-input bg-card px-2 text-xs",
							value: child.op,
							onChange: (e) => updateChild(i, {
								...child,
								op: e.target.value
							}),
							children: FILTER_OPS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: o.op,
								children: o.label
							}, o.op))
						}),
						needsValue ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "h-8 w-28",
							value: child.value == null ? "" : String(child.value),
							onChange: (e) => updateChild(i, {
								...child,
								value: e.target.value
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => remove(i),
							"aria-label": "Удалить",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})
					]
				}, child.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: add,
				className: "self-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Условие"]
			})
		]
	});
}
//#endregion
export { FilterBuilder as t };
