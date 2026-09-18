import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as formatRelative, t as Button } from "./button-BsuIlnCY.mjs";
import { f as Radio } from "../_libs/lucide-react.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as useWorkspace } from "./workspace-store-B-RjcRTR.mjs";
import { t as Badge } from "./badge-DukFuPF8.mjs";
import { l as SIGNAL_KIND_META } from "./types-IAoun2Tf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signals.index-CBf5I_sQ.js
var import_jsx_runtime = require_jsx_runtime();
function SignalsPage() {
	const ws = useWorkspace((s) => s.workspace);
	const mark = useWorkspace((s) => s.markSignalRead);
	const addSignal = useWorkspace((s) => s.addSignal);
	if (!ws) return null;
	const unread = ws.signals.filter((s) => !s.read).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl p-4 md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold tracking-tight",
				children: "Сигналы"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: unread ? `${unread} непрочитанных` : "Все просмотрены"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => addSignal("VK", "job", ws.tables[0]?.id),
				children: "Проверить источники"
			})]
		}), ws.signals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 rounded-xl border border-dashed border-border p-10 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "mx-auto size-6 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Пока тихо. Источники подключены в mock-режиме."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 space-y-2",
			children: ws.signals.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: `rounded-xl border border-border bg-card p-4 ${s.read ? "opacity-70" : ""}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold",
									children: s.company
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: SIGNAL_KIND_META[s.kind].label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: formatRelative(s.createdAt)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: s.detail
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [!s.read ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "xs",
							variant: "ghost",
							onClick: () => mark(s.id),
							children: "Прочитано"
						}) : null, s.tableId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "xs",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/tables/$tableId",
								params: { tableId: s.tableId },
								children: "К таблице"
							})
						}) : null]
					})]
				})
			}, s.id))
		})]
	});
}
//#endregion
export { SignalsPage as component };
