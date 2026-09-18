import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn } from "./button-BsuIlnCY.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums", {
	variants: { variant: {
		default: "bg-secondary text-secondary-foreground",
		pine: "bg-accent text-accent-foreground",
		outline: "border border-border text-muted-foreground",
		success: "bg-success/10 text-success",
		warning: "bg-warning/10 text-warning",
		danger: "bg-destructive/10 text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			variant,
			className
		})),
		...props
	});
}
//#endregion
export { Badge as t };
