import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as require_jsx_runtime, n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as formatNumber, n as cn, s as nid, t as Button } from "./button-BsuIlnCY.mjs";
import { C as ChevronLeft, E as ArrowUp, S as Copy, b as Download, c as Star, d as Search, g as LoaderCircle, i as Upload, k as ArrowDown, l as Sparkles, m as Play, o as Trash2, p as Plus, v as Funnel, w as Check, y as Ellipsis } from "../_libs/lucide-react.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-CGOfacp1.mjs";
import { n as Label, r as Textarea, t as Input } from "./label-BKCLw4Ud.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as emptyFilterGroup, c as toCsv, i as applyView, l as useTable, n as PROVIDERS, o as filterIsActive, s as providersFor, u as useWorkspace } from "./workspace-store-B-RjcRTR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Skeleton } from "./skeleton-gukXFkdc.mjs";
import { t as FilterBuilder } from "./filter-builder-BSyms9Nf.mjs";
import { c as SCORE_OPS, i as INTENT_META, n as FORMULA_FNS, t as COLUMN_TYPE_META } from "./types-IAoun2Tf.mjs";
import { a as Separator2, i as Root2, n as Item2, o as Trigger, r as Portal2, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as Route } from "./router-D5th-1W0.mjs";
import { t as useVirtualizer } from "../_libs/@tanstack/react-virtual+[...].mjs";
import { i as Trigger$1, n as Portal, r as Root2$1, t as Content2$1 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tables._tableId-DIgM4ak8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function defaultScoreConfig(table) {
	const emp = table.columns.find((c) => /сотруд/i.test(c.name));
	const email = table.columns.find((c) => c.type === "email");
	const site = table.columns.find((c) => c.type === "url");
	const rules = [];
	if (emp) rules.push({
		id: nid("sr"),
		label: "Штат > 500",
		columnId: emp.id,
		op: "gt",
		value: 500,
		points: 20
	});
	if (email) rules.push({
		id: nid("sr"),
		label: "Email найден",
		columnId: email.id,
		op: "not_empty",
		points: 10
	});
	if (site) rules.push({
		id: nid("sr"),
		label: "Сайт найден",
		columnId: site.id,
		op: "not_empty",
		points: 10
	});
	if (!rules.length && table.columns[0]) rules.push({
		id: nid("sr"),
		label: "Не пусто",
		columnId: table.columns[0].id,
		op: "not_empty",
		points: 10
	});
	return { rules };
}
function ScoreEditor({ table, value, onChange }) {
	function patch(i, next) {
		onChange({ rules: value.rules.map((r, idx) => idx === i ? {
			...r,
			...next
		} : r) });
	}
	const needsValue = (op) => !["empty", "not_empty"].includes(op);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Баллы суммируются, если условие выполняется."
			}),
			value.rules.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mb-1.5 h-7",
					value: r.label,
					onChange: (e) => patch(i, { label: e.target.value }),
					placeholder: "Подпись правила"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-8 min-w-0 flex-1 rounded-md border border-input bg-card px-2 text-xs",
							value: r.columnId,
							onChange: (e) => patch(i, { columnId: e.target.value }),
							children: table.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-8 rounded-md border border-input bg-card px-2 text-xs",
							value: r.op,
							onChange: (e) => patch(i, { op: e.target.value }),
							children: SCORE_OPS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: o.op,
								children: o.label
							}, o.op))
						}),
						needsValue(r.op) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "h-8 w-20",
							value: r.value == null ? "" : String(r.value),
							onChange: (e) => {
								const raw = e.target.value;
								const n = Number(raw.replace(",", "."));
								patch(i, { value: raw !== "" && Number.isFinite(n) && raw.trim() !== "" && /^-?\d/.test(raw) ? n : raw });
							}
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "h-8 w-16",
							type: "number",
							value: r.points,
							onChange: (e) => patch(i, { points: Number(e.target.value) || 0 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Удалить правило",
							onClick: () => onChange({ rules: value.rules.filter((_, idx) => idx !== i) }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})
					]
				})]
			}, r.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "self-start",
				onClick: () => onChange({ rules: [...value.rules, {
					id: nid("sr"),
					label: "Правило",
					columnId: table.columns[0]?.id ?? "",
					op: "not_empty",
					points: 10
				}] }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Правило"]
			})
		]
	});
}
var BASIC = [
	"text",
	"number",
	"email",
	"phone",
	"url",
	"company",
	"person",
	"date",
	"boolean",
	"formula",
	"enrichment",
	"ai",
	"score"
];
function AddColumnDialog({ open, onOpenChange, table, onCreate }) {
	const [step, setStep] = (0, import_react.useState)("type");
	const [type, setType] = (0, import_react.useState)("text");
	const [name, setName] = (0, import_react.useState)("");
	const [formula, setFormula] = (0, import_react.useState)("=IF({Сотрудники} > 500, \"Enterprise\", \"SMB\")");
	const [prompt, setPrompt] = (0, import_react.useState)("Оцени компанию по шкале 1-100.\n\nУчитывай:\n- размер;\n- отрасль;\n- наличие отдела продаж;\n- соответствие ICP.");
	const [intent, setIntent] = (0, import_react.useState)("website");
	const [inputCol, setInputCol] = (0, import_react.useState)(table.columns[0]?.id ?? "");
	const [providerIds, setProviderIds] = (0, import_react.useState)(["dadata", "spark"]);
	const [score, setScore] = (0, import_react.useState)(() => defaultScoreConfig(table));
	function reset() {
		setStep("type");
		setType("text");
		setName("");
		setScore(defaultScoreConfig(table));
	}
	function submit() {
		const column = {
			id: nid("col"),
			name: name.trim() || (type === "enrichment" ? INTENT_META[intent].label : type === "ai" ? "AI" : COLUMN_TYPE_META[type].label),
			type,
			width: type === "company" ? 220 : 160
		};
		if (type === "formula") column.formula = formula;
		if (type === "ai") column.ai = { prompt };
		if (type === "enrichment") column.enrichment = {
			intent,
			providers: providerIds,
			inputColumnId: inputCol || table.columns[0]?.id || ""
		};
		if (type === "score") column.score = score;
		onCreate(column);
		onOpenChange(false);
		reset();
	}
	const available = providersFor(intent);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			onOpenChange(v);
			if (!v) reset();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: step === "type" ? "Новая колонка" : COLUMN_TYPE_META[type].label,
			className: type === "score" && step === "setup" ? "max-h-[min(90dvh,720px)] overflow-y-auto" : void 0,
			children: step === "type" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-1.5 sm:grid-cols-3",
				children: BASIC.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setType(t);
						setStep("setup");
						if (!name) setName(COLUMN_TYPE_META[t].label);
						if (t === "score") setScore(defaultScoreConfig(table));
					},
					className: "rounded-lg border border-border bg-card px-3 py-2.5 text-left hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: COLUMN_TYPE_META[t].label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[11px] text-muted-foreground",
						children: COLUMN_TYPE_META[t].hint
					})]
				}, t))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Название" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1",
						value: name,
						onChange: (e) => setName(e.target.value)
					})] }),
					type === "formula" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Формула" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 font-mono text-xs",
							value: formula,
							onChange: (e) => setFormula(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1",
							children: FORMULA_FNS.map((fn) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] hover:bg-muted",
								onClick: () => setFormula(`=${fn.sample}`),
								children: fn.name
							}, fn.name))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: ["Ссылки на колонки: ", "{Колонка}"]
						})
					] }),
					type === "ai" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Промпт" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-1",
							value: prompt,
							onChange: (e) => setPrompt(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: [
								"Подстановки: ",
								"{{Компания}}",
								", ",
								"{{Сотрудники}}"
							]
						})
					] }),
					type === "score" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreEditor, {
						table,
						value: score,
						onChange: setScore
					}),
					type === "enrichment" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Что найти" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 grid grid-cols-2 gap-1",
							children: Object.keys(INTENT_META).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setIntent(k);
									setProviderIds(providersFor(k).slice(0, 2).map((p) => p.id));
								},
								className: `rounded-md border px-2 py-1.5 text-left text-xs ${intent === k ? "border-primary bg-accent text-accent-foreground" : "border-border hover:bg-muted"}`,
								children: INTENT_META[k].label
							}, k))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Исходная колонка" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "mt-1 h-9 w-full rounded-md border border-input bg-card px-2 text-sm",
							value: inputCol,
							onChange: (e) => setInputCol(e.target.value),
							children: table.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Провайдеры · waterfall" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex flex-col gap-1",
								children: available.map((p, i) => {
									const on = providerIds.includes(p.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center justify-between rounded-md border border-border px-2 py-1.5 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: on,
												onChange: () => setProviderIds((ids) => on ? ids.filter((x) => x !== p.id) : [...ids, p.id])
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												i + 1,
												". ",
												p.name
											] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground tabular",
											children: [p.cost, " кр."]
										})]
									}, p.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: [
									"Цепочка:",
									" ",
									providerIds.map((id) => PROVIDERS.find((p) => p.id === id)?.name).filter(Boolean).join(" → ") || "не выбрано"
								]
							})
						] })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setStep("type"),
							children: "Назад"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: submit,
							children: "Добавить"
						})]
					})
				]
			})
		})
	});
}
function Checkbox({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
		className: cn("flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-border bg-card data-[state=checked]:border-primary data-[state=checked]:bg-primary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-3 text-primary-foreground",
			strokeWidth: 3
		}) })
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
function DropdownMenuContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset: 4,
		className: cn("z-50 min-w-44 overflow-hidden rounded-lg border border-border bg-card p-1 shadow-soft", className),
		...props
	}) });
}
function DropdownMenuItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-muted", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
		className: cn("-mx-1 my-1 h-px bg-border", className),
		...props
	});
}
var ROW_H = 36;
var IDX_W = 52;
var CHK_W = 36;
function display(cell) {
	if (!cell) return "";
	if (cell.display != null && cell.display !== "") return cell.display;
	if (cell.value == null) return "";
	return String(cell.value);
}
function scoreTone(n) {
	if (n >= 70) return "text-success";
	if (n >= 40) return "text-warning";
	return "text-muted-foreground";
}
function CellView({ column, cell }) {
	if (cell?.status === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }), "Ищем…"]
	});
	if (cell?.status === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "truncate text-destructive",
		title: cell.error,
		children: cell.error || "Ошибка"
	});
	const text = display(cell);
	if (!text) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground/50",
		children: "—"
	});
	if (column.type === "url") {
		const href = text.startsWith("http") ? text : `https://${text}`;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href,
			target: "_blank",
			rel: "noreferrer",
			className: "truncate text-primary hover:underline",
			onClick: (e) => e.stopPropagation(),
			children: text.replace(/^https?:\/\//, "")
		});
	}
	if (column.type === "email") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: `mailto:${text}`,
		className: "truncate hover:underline",
		onClick: (e) => e.stopPropagation(),
		children: text
	});
	if (column.type === "boolean") return cell?.value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-success" }) : null;
	if (column.type === "number" || column.type === "score") {
		const n = Number(cell?.value);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("tabular", column.type === "score" && scoreTone(n)),
			children: Number.isFinite(n) ? n.toLocaleString("ru-RU") : text
		});
	}
	if (column.type === "company") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex min-w-0 items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-5 shrink-0 items-center justify-center rounded-[4px] bg-secondary text-[10px] font-semibold",
			children: text.slice(0, 1)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate font-medium",
			children: text
		})]
	});
	if (column.type === "enrichment" || column.type === "ai") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex min-w-0 items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: text
		}), cell?.provider ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shrink-0 rounded bg-muted px-1 text-[10px] text-muted-foreground",
			children: cell.provider
		}) : null]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "truncate",
		children: text
	});
}
function DataGrid({ table, onAddColumn }) {
	const search = useWorkspace((s) => s.search);
	const selected = useWorkspace((s) => s.selectedRowIds);
	const setSelected = useWorkspace((s) => s.setSelected);
	const updateCell = useWorkspace((s) => s.updateCell);
	const addRow = useWorkspace((s) => s.addRow);
	const deleteRows = useWorkspace((s) => s.deleteRows);
	const deleteColumn = useWorkspace((s) => s.deleteColumn);
	const resizeColumn = useWorkspace((s) => s.resizeColumn);
	const setSort = useWorkspace((s) => s.setSort);
	const updateColumn = useWorkspace((s) => s.updateColumn);
	const duplicateRows = useWorkspace((s) => s.duplicateRows);
	const reorderColumn = useWorkspace((s) => s.reorderColumn);
	const rows = (0, import_react.useMemo)(() => applyView(table, search), [table, search]);
	const columns = table.columns.filter((c) => !c.hidden);
	const parentRef = (0, import_react.useRef)(null);
	const virtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => ROW_H,
		overscan: 12
	});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [menu, setMenu] = (0, import_react.useState)(null);
	const [renaming, setRenaming] = (0, import_react.useState)(null);
	const [renameDraft, setRenameDraft] = (0, import_react.useState)("");
	const drag = (0, import_react.useRef)(null);
	const colDrag = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const onMove = (e) => {
			if (!drag.current) return;
			const w = drag.current.startW + (e.clientX - drag.current.startX);
			resizeColumn(table.id, drag.current.id, w);
		};
		const onUp = () => {
			drag.current = null;
		};
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
	}, [resizeColumn, table.id]);
	const frozen = columns.filter((c) => c.frozen);
	const rest = columns.filter((c) => !c.frozen);
	const ordered = [...frozen, ...rest];
	const leftOf = (index) => {
		let x = 88;
		for (let i = 0; i < index; i++) if (ordered[i]?.frozen) x += ordered[i].width;
		return x;
	};
	const totalW = 88 + ordered.reduce((s, c) => s + c.width, 0) + 44;
	function commit() {
		if (!editing) return;
		const col = columns.find((c) => c.id === editing.colId);
		let value = draft;
		if (col?.type === "number" || col?.type === "score") {
			const n = Number(draft.replace(/\s/g, "").replace(",", "."));
			value = draft === "" ? null : Number.isFinite(n) ? n : draft;
		} else if (col?.type === "boolean") value = draft === "true" || draft === "1" || draft.toLowerCase() === "да";
		updateCell(table.id, editing.rowId, editing.colId, value);
		setEditing(null);
	}
	function toggleRow(id, additive) {
		if (!additive) {
			setSelected(selected.includes(id) && selected.length === 1 ? [] : [id]);
			return;
		}
		setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
	}
	const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: parentRef,
				className: "min-h-0 flex-1 overflow-auto bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						width: totalW,
						minWidth: "100%"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-0 z-20 flex border-b border-border bg-muted/80 backdrop-blur-sm",
						style: { height: ROW_H },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sticky left-0 z-30 flex items-center justify-center border-r border-border bg-muted",
								style: { width: CHK_W },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: allSelected,
									onCheckedChange: () => setSelected(allSelected ? [] : rows.map((r) => r.id))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sticky z-30 flex items-center justify-center border-r border-border bg-muted text-[11px] font-medium text-muted-foreground",
								style: {
									width: IDX_W,
									left: CHK_W
								},
								children: "#"
							}),
							ordered.map((col, i) => {
								const sorted = table.sorts[0]?.columnId === col.id;
								const sticky = col.frozen;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("group relative flex shrink-0 items-center gap-1 border-r border-border px-2 text-[12px] font-medium", sticky && "sticky z-30 bg-muted"),
									style: {
										width: col.width,
										left: sticky ? leftOf(i) : void 0
									},
									draggable: true,
									onDragStart: () => {
										colDrag.current = col.id;
									},
									onDragOver: (e) => e.preventDefault(),
									onDrop: () => {
										if (colDrag.current) reorderColumn(table.id, colDrag.current, col.id);
										colDrag.current = null;
									},
									children: [
										renaming === col.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											autoFocus: true,
											className: "h-6 min-w-0 flex-1 rounded-sm border border-ring bg-card px-1 text-[12px] outline-none",
											value: renameDraft,
											onChange: (e) => setRenameDraft(e.target.value),
											onBlur: () => {
												if (renameDraft.trim()) updateColumn(table.id, col.id, { name: renameDraft.trim() });
												setRenaming(null);
											},
											onKeyDown: (e) => {
												if (e.key === "Enter") e.target.blur();
												if (e.key === "Escape") setRenaming(null);
											}
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "flex min-w-0 flex-1 items-center gap-1 text-left",
											onClick: () => setSort(table.id, sorted && table.sorts[0]?.dir === "asc" ? {
												columnId: col.id,
												dir: "desc"
											} : {
												columnId: col.id,
												dir: "asc"
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: col.name
											}), sorted ? table.sorts[0]?.dir === "asc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-3 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3 shrink-0" }) : null]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "rounded p-0.5 opacity-0 hover:bg-secondary group-hover:opacity-100",
												"aria-label": "Колонка",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-3.5" })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												onClick: () => {
													setRenaming(col.id);
													setRenameDraft(col.name);
												},
												children: "Переименовать"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												onClick: () => setSort(table.id, {
													columnId: col.id,
													dir: "asc"
												}),
												children: "Сортировать A→Я"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												onClick: () => setSort(table.id, {
													columnId: col.id,
													dir: "desc"
												}),
												children: "Сортировать Я→A"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												onClick: () => updateColumn(table.id, col.id, { frozen: !col.frozen }),
												children: col.frozen ? "Открепить" : "Закрепить"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												onClick: () => updateColumn(table.id, col.id, { hidden: true }),
												children: "Скрыть"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												className: "text-destructive",
												onClick: () => deleteColumn(table.id, col.id),
												children: "Удалить колонку"
											})
										] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-primary/30",
											onMouseDown: (e) => {
												e.preventDefault();
												drag.current = {
													id: col.id,
													startX: e.clientX,
													startW: col.width
												};
											}
										})
									]
								}, col.id);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex w-11 items-center justify-center text-muted-foreground hover:text-foreground",
								onClick: onAddColumn,
								"aria-label": "Добавить колонку",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
							})
						]
					}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-40 flex-col items-center justify-center gap-2 text-sm text-muted-foreground",
						children: "Нет строк. Добавьте компанию или снимите фильтр."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							height: virtualizer.getTotalSize(),
							position: "relative"
						},
						children: virtualizer.getVirtualItems().map((v) => {
							const row = rows[v.index];
							const on = selected.includes(row.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("absolute left-0 flex border-b border-border", on ? "bg-accent/60" : "bg-card hover:bg-muted/40"),
								style: {
									height: ROW_H,
									transform: `translateY(${v.start}px)`,
									width: totalW
								},
								onContextMenu: (e) => {
									e.preventDefault();
									setMenu({
										x: e.clientX,
										y: e.clientY,
										rowId: row.id
									});
									if (!selected.includes(row.id)) setSelected([row.id]);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("sticky left-0 z-10 flex items-center justify-center border-r border-border", on ? "bg-accent" : "bg-card"),
										style: { width: CHK_W },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: on,
											onCheckedChange: () => toggleRow(row.id, true)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("sticky z-10 flex items-center justify-center border-r border-border text-[11px] tabular text-muted-foreground", on ? "bg-accent" : "bg-card"),
										style: {
											width: IDX_W,
											left: CHK_W
										},
										children: v.index + 1
									}),
									ordered.map((col, i) => {
										const isEdit = editing?.rowId === row.id && editing.colId === col.id;
										const readOnly = col.type === "formula" || col.type === "score" || col.type === "enrichment" || col.type === "ai";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cn("flex shrink-0 items-center border-r border-border px-2 text-[13px]", col.frozen && "sticky z-10", col.frozen && (on ? "bg-accent" : "bg-card")),
											style: {
												width: col.width,
												left: col.frozen ? leftOf(i) : void 0
											},
											onClick: (e) => {
												if (e.metaKey || e.ctrlKey) toggleRow(row.id, true);
												else if (!selected.includes(row.id)) setSelected([row.id]);
											},
											onDoubleClick: () => {
												if (readOnly) return;
												setEditing({
													rowId: row.id,
													colId: col.id
												});
												setDraft(display(row.cells[col.id]));
											},
											children: isEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												autoFocus: true,
												className: "h-7 w-full rounded-sm border border-ring bg-card px-1 text-[13px] outline-none",
												value: draft,
												onChange: (e) => setDraft(e.target.value),
												onBlur: commit,
												onKeyDown: (e) => {
													if (e.key === "Enter") commit();
													if (e.key === "Escape") setEditing(null);
												}
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "min-w-0 flex-1",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CellView, {
													column: col,
													cell: row.cells[col.id]
												})
											})
										}, col.id);
									})
								]
							}, row.id);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-9 shrink-0 items-center gap-3 border-t border-border bg-card px-3 text-[12px] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "inline-flex items-center gap-1 hover:text-foreground",
						onClick: () => addRow(table.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Строка"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular",
						children: [
							rows.length.toLocaleString("ru-RU"),
							" из ",
							table.rows.length.toLocaleString("ru-RU")
						]
					}),
					selected.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular",
						children: [selected.length, " выбрано"]
					}) : null
				]
			}),
			menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowMenu, {
				x: menu.x,
				y: menu.y,
				onClose: () => setMenu(null),
				onDelete: () => {
					deleteRows(table.id, selected.length ? selected : [menu.rowId]);
					setMenu(null);
				},
				onDuplicate: () => {
					duplicateRows(table.id, selected.length ? selected : [menu.rowId]);
					setMenu(null);
				}
			}) : null
		]
	});
}
function RowMenu({ x, y, onClose, onDelete, onDuplicate }) {
	(0, import_react.useEffect)(() => {
		const close = () => onClose();
		window.addEventListener("click", close);
		return () => window.removeEventListener("click", close);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed z-50 min-w-40 rounded-lg border border-border bg-card p-1 shadow-soft",
		style: {
			left: x,
			top: y
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted",
			onClick: onDuplicate,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Дублировать"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-muted",
			onClick: onDelete,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Удалить"]
		})]
	});
}
var Popover = Root2$1;
var PopoverTrigger = Trigger$1;
function PopoverContent({ className, align = "start", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
		align,
		sideOffset: 6,
		className: cn("z-50 w-72 rounded-lg border border-border bg-card p-3 shadow-soft outline-none", className),
		...props
	}) });
}
function typingTarget(el) {
	if (!(el instanceof HTMLElement)) return false;
	const tag = el.tagName;
	return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}
function TableWorkspace({ table }) {
	const search = useWorkspace((s) => s.search);
	const setSearch = useWorkspace((s) => s.setSearch);
	const selected = useWorkspace((s) => s.selectedRowIds);
	const setSelected = useWorkspace((s) => s.setSelected);
	const addColumn = useWorkspace((s) => s.addColumn);
	const addRow = useWorkspace((s) => s.addRow);
	const runEnrichment = useWorkspace((s) => s.runEnrichment);
	const runAiColumn = useWorkspace((s) => s.runAiColumn);
	const setFilters = useWorkspace((s) => s.setFilters);
	const importCsv = useWorkspace((s) => s.importCsv);
	const renameTable = useWorkspace((s) => s.renameTable);
	const toggleFavorite = useWorkspace((s) => s.toggleFavorite);
	const deleteRows = useWorkspace((s) => s.deleteRows);
	const duplicateRows = useWorkspace((s) => s.duplicateRows);
	const updateColumn = useWorkspace((s) => s.updateColumn);
	const exportToIntegration = useWorkspace((s) => s.exportToIntegration);
	const integrations = useWorkspace((s) => s.workspace?.integrations ?? []);
	const credits = useWorkspace((s) => s.workspace?.credits);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [rename, setRename] = (0, import_react.useState)(table.name);
	const [confirmRun, setConfirmRun] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	const searchRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setRename(table.name);
	}, [table.name]);
	const visible = (0, import_react.useMemo)(() => applyView(table, search), [table, search]);
	const enrichCols = table.columns.filter((c) => c.type === "enrichment");
	const enrichCol = enrichCols[0];
	const aiCol = table.columns.find((c) => c.type === "ai");
	const targets = selected.length ? selected : visible.map((r) => r.id);
	const enrichCost = targets.length * 2;
	const aiCost = targets.length * 4;
	const amo = integrations.find((i) => i.provider === "amocrm");
	const fill = (0, import_react.useMemo)(() => enrichCols.map((c) => {
		const total = table.rows.length;
		const found = table.rows.filter((r) => {
			const cell = r.cells[c.id];
			return cell?.status === "success" && cell.value != null && cell.value !== "";
		}).length;
		const spent = table.rows.reduce((s, r) => s + (r.cells[c.id]?.credits ?? 0), 0);
		return {
			id: c.id,
			name: c.name,
			total,
			found,
			spent
		};
	}), [enrichCols, table.rows]);
	function downloadCsv() {
		const headers = table.columns.map((c) => c.name);
		const lines = visible.map((r) => table.columns.map((c) => String(r.cells[c.id]?.display ?? r.cells[c.id]?.value ?? "")));
		const blob = new Blob([toCsv(headers, lines)], { type: "text/csv;charset=utf-8" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `${table.name}.csv`;
		a.click();
	}
	async function handleRun(kind) {
		setConfirmRun(null);
		if (kind === "enrich" && enrichCol) {
			toast.message("Обогащение запущено", { description: `${targets.length} строк · ~${enrichCost} кр.` });
			await runEnrichment(table.id, enrichCol.id, selected.length ? selected : void 0);
			toast.success("Обогащение завершено");
		}
		if (kind === "ai" && aiCol) {
			toast.message("AI-колонка", { description: `${targets.length} строк · ${aiCost} кр.` });
			await runAiColumn(table.id, aiCol.id, selected.length ? selected : void 0);
			toast.success("AI обработал строки");
		}
	}
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (typingTarget(e.target)) {
				if (e.key === "Escape") e.target.blur();
				return;
			}
			if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
				e.preventDefault();
				searchRef.current?.focus();
			}
			if (e.key === "n" && !e.metaKey && !e.ctrlKey) {
				e.preventDefault();
				addRow(table.id);
			}
			if (e.key === "c" && !e.metaKey && !e.ctrlKey) {
				e.preventDefault();
				setAddOpen(true);
			}
			if (e.key === "Escape") setSelected([]);
			if ((e.key === "Delete" || e.key === "Backspace") && selected.length) {
				e.preventDefault();
				deleteRows(table.id, selected);
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
				e.preventDefault();
				if (enrichCol) setConfirmRun("enrich");
				else if (aiCol) setConfirmRun("ai");
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		addRow,
		aiCol,
		deleteRows,
		enrichCol,
		selected,
		setSelected,
		table.id
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border bg-card px-3 py-2 md:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/tables",
						className: "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted",
						"aria-label": "К таблицам",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => toggleFavorite(table.id),
						className: "text-muted-foreground hover:text-foreground",
						"aria-label": "В избранное",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
							className: "size-4",
							fill: table.favorite ? "currentColor" : "none"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: rename,
						onChange: (e) => setRename(e.target.value),
						onBlur: () => rename.trim() && renameTable(table.id, rename.trim()),
						className: "min-w-0 flex-1 bg-transparent text-[15px] font-semibold tracking-tight outline-none md:flex-none md:text-base"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden text-xs text-muted-foreground md:inline tabular",
						children: [formatNumber(visible.length), " строк"]
					}),
					fill[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden text-xs text-muted-foreground lg:inline tabular",
						children: [
							fill[0].name,
							": ",
							fill[0].found,
							"/",
							fill[0].total,
							fill[0].total ? ` · ${Math.round(fill[0].found / fill[0].total * 100)}%` : "",
							fill[0].spent ? ` · ${fill[0].spent} кр.` : ""
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									ref: searchRef,
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Поиск",
									className: "h-8 w-36 pl-7 md:w-48"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: filterIsActive(table.filters) ? "secondary" : "outline",
									size: "sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-3.5" }), "Фильтр"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
								className: "w-[min(420px,calc(100vw-24px))]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-sm font-medium",
										children: "Условия"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBuilder, {
										table,
										value: table.filters,
										onChange: (g) => setFilters(table.id, g)
									}),
									filterIsActive(table.filters) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "xs",
										className: "mt-2",
										onClick: () => setFilters(table.id, emptyFilterGroup()),
										children: "Сбросить"
									}) : null
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setAddOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Колонка"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => setConfirmRun(enrichCol ? "enrich" : aiCol ? "ai" : "enrich"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), enrichCol ? "Обогатить" : "Запустить"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									"aria-label": "Ещё",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => addRow(table.id),
										children: "Добавить строку"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => fileRef.current?.click(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), "Импорт CSV"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: downloadCsv,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Экспорт CSV"]
									}),
									aiCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => setConfirmRun("ai"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), "Запустить AI"]
									}) : null,
									enrichCols.length > 1 ? enrichCols.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => {
											(async () => {
												toast.message(`Обогащение «${c.name}»`);
												await runEnrichment(table.id, c.id, selected.length ? selected : void 0);
												toast.success("Готово");
											})();
										},
										children: ["Обогатить: ", c.name]
									}, c.id)) : null,
									table.columns.some((c) => c.hidden) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => {
											for (const c of table.columns) if (c.hidden) updateColumn(table.id, c.id, { hidden: false });
										},
										children: "Показать скрытые колонки"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									amo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => {
											const n = selected.length || visible.length;
											exportToIntegration(amo.id, n);
											toast.success(`✓ ${n} контактов экспортировано в amoCRM`);
										},
										children: "Отправить в amoCRM"
									}) : null,
									selected.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										className: "text-destructive",
										onClick: () => deleteRows(table.id, selected),
										children: "Удалить выбранные"
									}) : null
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: ".csv,text/csv",
								className: "hidden",
								onChange: async (e) => {
									const file = e.target.files?.[0];
									if (!file) return;
									const text = await file.text();
									const res = importCsv(table.id, text);
									toast.success(`Импортировано ${res.rows} строк`);
									e.target.value = "";
								}
							})
						]
					})
				]
			}),
			selected.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border bg-accent px-3 py-1.5 text-[12px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular font-medium",
						children: [selected.length, " выбрано"]
					}),
					enrichCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "xs",
						variant: "outline",
						onClick: () => setConfirmRun("enrich"),
						children: "Обогатить"
					}) : null,
					aiCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "xs",
						variant: "outline",
						onClick: () => setConfirmRun("ai"),
						children: "AI"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "xs",
						variant: "outline",
						onClick: () => duplicateRows(table.id, selected),
						children: "Дублировать"
					}),
					amo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "xs",
						variant: "outline",
						onClick: () => {
							exportToIntegration(amo.id, selected.length);
							toast.success(`✓ ${selected.length} в amoCRM`);
						},
						children: "В CRM"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "xs",
						variant: "ghost",
						className: "text-destructive",
						onClick: () => deleteRows(table.id, selected),
						children: "Удалить"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "xs",
						variant: "ghost",
						onClick: () => setSelected([]),
						children: "Снять"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataGrid, {
				table,
				onAddColumn: () => setAddOpen(true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddColumnDialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				table,
				onCreate: (c) => addColumn(table.id, c)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!confirmRun,
				onOpenChange: (v) => !v && setConfirmRun(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: confirmRun === "ai" ? "Запустить AI" : "Запустить обогащение",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								targets.length,
								" строк. Оценка:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-foreground tabular",
									children: [confirmRun === "ai" ? aiCost : enrichCost, " кредитов"]
								}),
								". Сейчас доступно Data ",
								credits?.data ?? 0,
								" / AI ",
								credits?.ai ?? 0,
								"."
							]
						}),
						!enrichCol && confirmRun === "enrich" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Нет колонки обогащения — добавьте её через «Колонка»."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setConfirmRun(null),
								children: "Отмена"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: confirmRun === "enrich" && !enrichCol,
								onClick: () => confirmRun && handleRun(confirmRun),
								children: "Запустить"
							})]
						})
					]
				})
			})
		]
	});
}
function TablePage() {
	const { tableId } = Route.useParams();
	const loading = useWorkspace((s) => s.loading);
	const table = useTable(tableId);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64" })
	});
	if (!table) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid h-full place-items-center p-6 text-sm text-muted-foreground",
		children: [
			"Таблица не найдена.",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/tables",
				className: "ml-1 text-foreground underline",
				children: "К списку"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableWorkspace, { table });
}
//#endregion
export { TablePage as component };
