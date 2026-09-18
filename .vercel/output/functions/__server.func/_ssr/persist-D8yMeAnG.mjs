import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DQ62JDHt.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-DCyqwQIc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/persist-D8yMeAnG.js
var loadWorkspace_createServerFn_handler = createServerRpc({
	id: "e3bfff75aac896f885bc78eea0ac93b6c865572ec4971c425046daccfbb3f7fc",
	name: "loadWorkspace",
	filename: "src/lib/persist.ts"
}, (opts) => loadWorkspace.__executeServer(opts));
var loadWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadWorkspace_createServerFn_handler, async ({ context }) => {
	const data = (await (await getSql()).query("select data from workspaces where user_id = $1", [context.userId]))[0]?.data;
	if (!data || typeof data !== "object" || !("tables" in data)) return null;
	return data;
});
var saveWorkspace_createServerFn_handler = createServerRpc({
	id: "ccfa28a77e3f768db9d597ba66f4bd52e9be29ad2616e9932791de0123ab63ee",
	name: "saveWorkspace",
	filename: "src/lib/persist.ts"
}, (opts) => saveWorkspace.__executeServer(opts));
var saveWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveWorkspace_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const payload = JSON.stringify(data.workspace);
	await sql.query(`insert into workspaces (user_id, data, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (user_id) do update set data = excluded.data, updated_at = now()`, [context.userId, payload]);
	return { ok: true };
});
//#endregion
export { loadWorkspace_createServerFn_handler, saveWorkspace_createServerFn_handler };
