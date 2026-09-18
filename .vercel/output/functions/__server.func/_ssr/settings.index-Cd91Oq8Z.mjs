import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-BsuIlnCY.mjs";
import { n as Label, t as Input } from "./label-BKCLw4Ud.mjs";
import { u as useWorkspace } from "./workspace-store-B-RjcRTR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as MEMBER_ROLE_META } from "./types-IAoun2Tf.mjs";
import { t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings.index-Cd91Oq8Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const user = useCurrentUser();
	const ws = useWorkspace((s) => s.workspace);
	const rename = useWorkspace((s) => s.renameWorkspace);
	const resetOnboarding = useWorkspace((s) => s.resetOnboarding);
	const inviteMember = useWorkspace((s) => s.inviteMember);
	const removeMember = useWorkspace((s) => s.removeMember);
	const setMemberRole = useWorkspace((s) => s.setMemberRole);
	const [name, setName] = (0, import_react.useState)(ws?.name ?? "");
	const [email, setEmail] = (0, import_react.useState)("");
	const [inviteName, setInviteName] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("editor");
	if (!ws) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold tracking-tight",
				children: "Настройки"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Пространство"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ws",
							children: "Название"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ws",
							className: "mt-1",
							value: name,
							onChange: (e) => setName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => {
								rename(name.trim() || ws.name);
								toast.success("Сохранено");
							},
							children: "Сохранить"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								resetOnboarding();
								toast.message("Мастер запуска открыт");
							},
							children: "Мастер запуска"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Команда"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Участники видят одно пространство. Приглашение пока mock — без писем."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border",
						children: ws.members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2 px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-medium",
									children: m.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate text-xs text-muted-foreground",
									children: [
										m.email || "—",
										" · ",
										m.status === "invited" ? "приглашён" : "активен"
									]
								})]
							}), m.role === "owner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Владелец"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "h-7 rounded-md border border-input bg-card px-1.5 text-xs",
								value: m.role,
								onChange: (e) => setMemberRole(m.id, e.target.value),
								children: Object.keys(MEMBER_ROLE_META).filter((r) => r !== "owner").map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: r,
									children: MEMBER_ROLE_META[r].label
								}, r))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "xs",
								variant: "ghost",
								onClick: () => removeMember(m.id),
								children: "Убрать"
							})] })]
						}, m.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-2 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Имя",
							value: inviteName,
							onChange: (e) => setInviteName(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "email@компания.ru",
							value: email,
							onChange: (e) => setEmail(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-8 rounded-md border border-input bg-card px-2 text-xs",
							value: role,
							onChange: (e) => setRole(e.target.value),
							children: Object.keys(MEMBER_ROLE_META).filter((r) => r !== "owner").map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r,
								children: MEMBER_ROLE_META[r].label
							}, r))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: !email.trim(),
							onClick: () => {
								inviteMember({
									name: inviteName,
									email,
									role
								});
								setEmail("");
								setInviteName("");
								toast.success("Приглашение создано");
							},
							children: "Пригласить"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Профиль"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: user?.displayName ?? "Пользователь"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: user?.primaryEmail ?? "—"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Клавиши"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-2 space-y-1 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "⌘K",
							v: "Командная палитра"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "⌘Z / ⌘⇧Z",
							v: "Отменить / повторить"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "/",
							v: "Фокус на поиск"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "n",
							v: "Новая строка"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "c",
							v: "Новая колонка"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "⌘Enter",
							v: "Запуск обогащения"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Delete",
							v: "Удалить выбранные строки"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Esc",
							v: "Снять выделение"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "двойной клик",
							v: "Редактировать ячейку"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Провайдеры"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Сейчас работает mock-слой: DaData, СПАРК, Контур.Фокус, HeadHunter. Интерфейс провайдера можно заменить на реальный API без переписывания таблицы."
				})]
			})
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: v
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "shrink-0 font-mono text-xs",
			children: k
		})]
	});
}
//#endregion
export { SettingsPage as component };
