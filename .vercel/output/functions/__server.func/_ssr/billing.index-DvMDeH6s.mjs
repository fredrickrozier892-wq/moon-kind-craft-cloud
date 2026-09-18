import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as formatRelative, r as formatCredits, t as Button } from "./button-BsuIlnCY.mjs";
import { u as useWorkspace } from "./workspace-store-B-RjcRTR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-DukFuPF8.mjs";
import { s as PLAN_META } from "./types-IAoun2Tf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing.index-DvMDeH6s.js
var import_jsx_runtime = require_jsx_runtime();
var ORDER = [
	"free",
	"launch",
	"growth",
	"enterprise"
];
function BillingPage() {
	const ws = useWorkspace((s) => s.workspace);
	const setPlan = useWorkspace((s) => s.setPlan);
	const addCredits = useWorkspace((s) => s.addCredits);
	if (!ws) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold tracking-tight",
				children: "Тарифы и кредиты"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Платежи пока в mock-режиме. Позже — ЮKassa, CloudPayments и СБП."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-2 sm:grid-cols-3",
				children: [
					[
						"Data",
						ws.credits.data,
						"data"
					],
					[
						"AI",
						ws.credits.ai,
						"ai"
					],
					[
						"Actions",
						ws.credits.actions,
						"actions"
					]
				].map(([label, n, bucket]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-display text-2xl tabular",
							children: formatCredits(n)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "xs",
							variant: "outline",
							className: "mt-3",
							onClick: () => {
								addCredits(bucket, 1e3);
								toast.success(`+1 000 ${label}`);
							},
							children: "Пополнить +1 000"
						})
					]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-2 md:grid-cols-4",
				children: ORDER.map((id) => {
					const p = PLAN_META[id];
					const on = ws.plan === id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-xl border bg-card p-4 ${on ? "border-primary" : "border-border"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: p.label
								}), on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "pine",
									children: "текущий"
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-xl",
								children: p.price
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: p.hint
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: on ? "secondary" : "outline",
								className: "mt-4 w-full",
								disabled: on,
								onClick: () => {
									setPlan(id);
									toast.success(`Тариф: ${p.label}`);
								},
								children: on ? "Выбран" : "Выбрать"
							})
						]
					}, id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-sm font-semibold",
				children: "История кредитов"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
				children: ws.creditLog.slice(0, 12).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between px-4 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t.reason, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-xs text-muted-foreground",
						children: t.bucket
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular",
						children: [
							t.amount > 0 ? "+" : "",
							t.amount,
							" · ",
							formatRelative(t.createdAt)
						]
					})]
				}, t.id))
			})
		]
	});
}
//#endregion
export { BillingPage as component };
