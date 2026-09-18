import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as formatRelative, n as cn, t as Button } from "./button-BsuIlnCY.mjs";
import { n as Label, t as Input } from "./label-BKCLw4Ud.mjs";
import { u as useWorkspace } from "./workspace-store-B-RjcRTR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-DukFuPF8.mjs";
import { r as INTEGRATION_META } from "./types-IAoun2Tf.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/integrations.index-Bq1te95X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent bg-muted transition-colors data-[state=checked]:bg-primary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-4 translate-x-0.5 rounded-full bg-card shadow-sm transition-transform data-[state=checked]:translate-x-[18px]" })
	});
}
var EVENTS = [
	{
		id: "row_created",
		label: "Строка создана"
	},
	{
		id: "row_updated",
		label: "Строка обновлена"
	},
	{
		id: "enrichment_completed",
		label: "Обогащение завершено"
	},
	{
		id: "signal_detected",
		label: "Сигнал"
	},
	{
		id: "ai_completed",
		label: "AI завершён"
	}
];
function IntegrationsPage() {
	const ws = useWorkspace((s) => s.workspace);
	const toggle = useWorkspace((s) => s.toggleIntegration);
	const exportTo = useWorkspace((s) => s.exportToIntegration);
	const addWebhook = useWorkspace((s) => s.addWebhook);
	const testWebhook = useWorkspace((s) => s.testWebhook);
	const deleteWebhook = useWorkspace((s) => s.deleteWebhook);
	const toggleWebhook = useWorkspace((s) => s.toggleWebhook);
	const [url, setUrl] = (0, import_react.useState)("https://example.com/webhook");
	const rows = ws?.tables[0]?.rows.length ?? 0;
	if (!ws) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold tracking-tight",
				children: "Интеграции"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "amoCRM, Bitrix24, 1С, Telegram, VK, почта и webhooks. Пока mock-коннекторы."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-2 sm:grid-cols-2",
				children: ws.integrations.filter((i) => i.provider !== "webhook").map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: INTEGRATION_META[i.provider].label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: INTEGRATION_META[i.provider].hint
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: i.connected ? "success" : "outline",
								children: i.connected ? "подключено" : "выкл"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => toggle(i.id),
								children: i.connected ? "Отключить" : "Подключить"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: !i.connected && i.provider !== "email",
								onClick: () => {
									const n = rows || 12;
									exportTo(i.id, n);
									toast.success(`✓ ${n} контактов экспортировано в ${i.name}`);
								},
								children: "Отправить"
							})]
						}),
						i.lastExportAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								i.lastCount,
								" шт · ",
								formatRelative(i.lastExportAt)
							]
						}) : null
					]
				}, i.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 text-sm font-semibold",
				children: "Webhooks"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 rounded-xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: url,
							onChange: (e) => setUrl(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "sm:self-end",
						onClick: () => {
							addWebhook(url, EVENTS.map((e) => e.id));
							toast.success("Webhook добавлен");
						},
						children: "Добавить"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: ws.webhooks.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "truncate text-xs",
									children: w.url
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: w.enabled,
									onCheckedChange: () => toggleWebhook(w.id)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: w.events.join(" · ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "xs",
										variant: "outline",
										onClick: async () => {
											const res = await testWebhook(w.id);
											toast[res.ok ? "success" : "error"](res.ok ? "Тестовая отправка прошла" : "Ошибка отправки");
										},
										children: "Тест"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "xs",
										variant: "ghost",
										onClick: () => deleteWebhook(w.id),
										children: "Удалить"
									}),
									w.lastTestAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-muted-foreground",
										children: [
											w.lastStatus,
											" · ",
											formatRelative(w.lastTestAt)
										]
									}) : null
								]
							})
						]
					}, w.id))
				})]
			})
		]
	});
}
//#endregion
export { IntegrationsPage as component };
