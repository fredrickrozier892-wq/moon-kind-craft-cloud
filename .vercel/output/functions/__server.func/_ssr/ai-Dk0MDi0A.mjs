import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DQ62JDHt.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-Dk0MDi0A.js
var completeAiCell_createServerFn_handler = createServerRpc({
	id: "f8ce3e2eca644d9b7e118cfa05000e186f75b9447d1c02f8fcf5ff9613de683a",
	name: "completeAiCell",
	filename: "src/lib/services/ai.ts"
}, (opts) => completeAiCell.__executeServer(opts));
var completeAiCell = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(completeAiCell_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "unavailable"
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 180,
			messages: [{
				role: "system",
				content: "Ты аналитик B2B. Отвечай кратко, по делу, на русском. Если просят оценку 1–100 — верни сначала число, затем одно предложение."
			}, {
				role: "user",
				content: `${data.prompt}\n\nДанные строки:\n${data.context}`
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI ${res.status}`
	};
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "empty"
	};
	return {
		ok: true,
		text
	};
});
//#endregion
export { completeAiCell_createServerFn_handler };
