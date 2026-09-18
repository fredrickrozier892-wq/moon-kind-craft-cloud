import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as require_jsx_runtime, u as Slot } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function nid(prefix = "") {
	return `${prefix}${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-5)}`;
}
function formatNumber(n) {
	return new Intl.NumberFormat("ru-RU").format(n);
}
function formatCredits(n) {
	return new Intl.NumberFormat("ru-RU").format(Math.max(0, Math.round(n)));
}
function formatRelative(iso) {
	const t = new Date(iso).getTime();
	const diff = Date.now() - t;
	const min = Math.round(diff / 6e4);
	if (min < 1) return "только что";
	if (min < 60) return `${min} мин назад`;
	const h = Math.round(min / 60);
	if (h < 24) return `${h} ч назад`;
	const d = Math.round(h / 24);
	if (d < 7) return `${d} дн назад`;
	return new Date(iso).toLocaleDateString("ru-RU");
}
function hash32(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,background-color,transform,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
			outline: "border border-border bg-card hover:bg-muted",
			ghost: "hover:bg-muted",
			destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
			sidebar: "text-sidebar-foreground hover:bg-sidebar-accent"
		},
		size: {
			default: "h-9 px-3",
			sm: "h-8 px-2.5 text-[13px]",
			lg: "h-10 px-4",
			icon: "size-8",
			xs: "h-7 px-2 text-xs"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
export { formatRelative as a, formatNumber as i, cn as n, hash32 as o, formatCredits as r, nid as s, Button as t };
