import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn } from "./button-BsuIlnCY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-NJEv3Ez3.js
var import_jsx_runtime = require_jsx_runtime();
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: cn("size-5", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3",
				y: "4",
				width: "18",
				height: "4",
				rx: "1",
				fill: "currentColor",
				opacity: "0.95"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3",
				y: "10",
				width: "18",
				height: "4",
				rx: "1",
				fill: "currentColor",
				opacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3",
				y: "16",
				width: "18",
				height: "4",
				rx: "1",
				fill: "currentColor",
				opacity: "0.45"
			})
		]
	});
}
function Wordmark({ className, light }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: light ? "text-sidebar-primary" : "text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("font-display text-[17px] font-semibold tracking-tight", light ? "text-sidebar-foreground" : "text-foreground"),
			children: "Пласт"
		})]
	});
}
//#endregion
export { Wordmark as t };
