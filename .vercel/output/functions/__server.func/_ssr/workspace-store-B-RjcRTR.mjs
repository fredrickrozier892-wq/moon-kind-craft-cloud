import { o as hash32, s as nid } from "./button-BsuIlnCY.mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DQ62JDHt.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace-store-B-RjcRTR.js
function parseCsv(text) {
	const rows = [];
	let row = [];
	let cur = "";
	let quoted = false;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (quoted) {
			if (c === "\"") {
				if (text[i + 1] === "\"") {
					cur += "\"";
					i++;
				} else quoted = false;
			} else cur += c;
			continue;
		}
		if (c === "\"") {
			quoted = true;
			continue;
		}
		if (c === ",") {
			row.push(cur);
			cur = "";
			continue;
		}
		if (c === "\n") {
			row.push(cur);
			rows.push(row);
			row = [];
			cur = "";
			continue;
		}
		if (c === "\r") continue;
		cur += c;
	}
	row.push(cur);
	if (row.some((c) => c.length) || rows.length === 0) rows.push(row);
	return rows.filter((r) => r.some((c) => c.trim().length));
}
function toCsv(headers, lines) {
	const esc = (v) => {
		if (/[",\n]/.test(v)) return `"${v.replaceAll("\"", "\"\"")}"`;
		return v;
	};
	return [headers, ...lines].map((r) => r.map(esc).join(",")).join("\n");
}
function toNum$1(v) {
	if (typeof v === "number") return v;
	if (v == null || v === "") return NaN;
	return Number(String(v).replace(/\s/g, "").replace(",", "."));
}
function toStr$1(v) {
	return v == null ? "" : String(v);
}
function evalCond(value, op, rhs) {
	const s = toStr$1(value);
	switch (op) {
		case "eq": return s.toLowerCase() === toStr$1(rhs).toLowerCase();
		case "neq": return s.toLowerCase() !== toStr$1(rhs).toLowerCase();
		case "contains": return s.toLowerCase().includes(toStr$1(rhs).toLowerCase());
		case "not_contains": return !s.toLowerCase().includes(toStr$1(rhs).toLowerCase());
		case "gt": return toNum$1(value) > toNum$1(rhs ?? 0);
		case "gte": return toNum$1(value) >= toNum$1(rhs ?? 0);
		case "lt": return toNum$1(value) < toNum$1(rhs ?? 0);
		case "lte": return toNum$1(value) <= toNum$1(rhs ?? 0);
		case "empty": return value == null || s === "";
		case "not_empty": return value != null && s !== "";
	}
}
function evalFilter(node, row) {
	if (node.kind === "cond") return evalCond(row.cells[node.columnId]?.value ?? null, node.op, node.value);
	if (!node.children.length) return true;
	const parts = node.children.map((c) => evalFilter(c, row));
	const base = node.combinator === "and" ? parts.every(Boolean) : parts.some(Boolean);
	return node.not ? !base : base;
}
function emptyFilterGroup() {
	return {
		id: nid("fg"),
		kind: "group",
		combinator: "and",
		children: []
	};
}
function filterIsActive(group) {
	return group.children.length > 0;
}
function applyView(table, search) {
	const q = search.trim().toLowerCase();
	let rows = table.rows;
	if (filterIsActive(table.filters)) rows = rows.filter((r) => evalFilter(table.filters, r));
	if (q) rows = rows.filter((r) => Object.values(r.cells).some((c) => String(c?.display ?? c?.value ?? "").toLowerCase().includes(q)));
	if (table.sorts.length) {
		const sorts = table.sorts;
		rows = [...rows].sort((a, b) => {
			for (const s of sorts) {
				const av = a.cells[s.columnId]?.value;
				const bv = b.cells[s.columnId]?.value;
				const an = toNum$1(av ?? null);
				const bn = toNum$1(bv ?? null);
				let cmp = 0;
				if (!Number.isNaN(an) && !Number.isNaN(bn)) cmp = an - bn;
				else cmp = toStr$1(av ?? null).localeCompare(toStr$1(bv ?? null), "ru", {
					numeric: true,
					sensitivity: "base"
				});
				if (cmp !== 0) return s.dir === "asc" ? cmp : -cmp;
			}
			return 0;
		});
	}
	return rows;
}
var FILTER_OPS = [
	{
		op: "eq",
		label: "равно"
	},
	{
		op: "neq",
		label: "не равно"
	},
	{
		op: "contains",
		label: "содержит"
	},
	{
		op: "not_contains",
		label: "не содержит"
	},
	{
		op: "gt",
		label: "больше"
	},
	{
		op: "gte",
		label: "≥"
	},
	{
		op: "lt",
		label: "меньше"
	},
	{
		op: "lte",
		label: "≤"
	},
	{
		op: "empty",
		label: "пусто"
	},
	{
		op: "not_empty",
		label: "не пусто"
	}
];
function tokenize(src) {
	const s = src.trim().replace(/^=/, "");
	const out = [];
	let i = 0;
	while (i < s.length) {
		const c = s[i];
		if (/\s/.test(c)) {
			i++;
			continue;
		}
		if (c === "(") {
			out.push({ t: "lp" });
			i++;
			continue;
		}
		if (c === ")") {
			out.push({ t: "rp" });
			i++;
			continue;
		}
		if (c === ",") {
			out.push({ t: "comma" });
			i++;
			continue;
		}
		if (c === "{") {
			const j = s.indexOf("}", i);
			if (j < 0) throw new Error("Незакрытая ссылка {колонка}");
			out.push({
				t: "ref",
				v: s.slice(i + 1, j).trim()
			});
			i = j + 1;
			continue;
		}
		if (c === "\"" || c === "'") {
			let j = i + 1;
			let v = "";
			while (j < s.length && s[j] !== c) {
				if (s[j] === "\\") {
					v += s[j + 1] ?? "";
					j += 2;
					continue;
				}
				v += s[j];
				j++;
			}
			out.push({
				t: "str",
				v
			});
			i = j + 1;
			continue;
		}
		if ("<>=!".includes(c)) {
			if ((c === "<" || c === ">" || c === "!" || c === "=") && s[i + 1] === "=") {
				out.push({
					t: "op",
					v: c + "="
				});
				i += 2;
				continue;
			}
			out.push({
				t: "op",
				v: c === "=" ? "=" : c
			});
			i++;
			continue;
		}
		if ("+-*/".includes(c)) {
			out.push({
				t: "op",
				v: c
			});
			i++;
			continue;
		}
		if (/[0-9.]/.test(c)) {
			const m = s.slice(i).match(/^[0-9]+(?:\.[0-9]+)?/);
			out.push({
				t: "num",
				v: Number(m[0])
			});
			i += m[0].length;
			continue;
		}
		if (/[A-Za-zА-Яа-я_]/.test(c)) {
			const m = s.slice(i).match(/^[A-Za-zА-Яа-я_][A-Za-zА-Яа-я0-9_]*/);
			out.push({
				t: "id",
				v: m[0]
			});
			i += m[0].length;
			continue;
		}
		throw new Error(`Неожиданный символ «${c}»`);
	}
	return out;
}
function parse(tokens) {
	let i = 0;
	const peek = () => tokens[i];
	const eat = () => tokens[i++];
	function primary() {
		const t = eat();
		if (!t) throw new Error("Пустое выражение");
		if (t.t === "num") return {
			k: "num",
			v: t.v
		};
		if (t.t === "str") return {
			k: "str",
			v: t.v
		};
		if (t.t === "ref") return {
			k: "ref",
			v: t.v
		};
		if (t.t === "id") {
			if (peek()?.t === "lp") {
				eat();
				const args = [];
				if (peek()?.t !== "rp") {
					args.push(expr());
					while (peek()?.t === "comma") {
						eat();
						args.push(expr());
					}
				}
				if (eat()?.t !== "rp") throw new Error("Ожидалась )");
				return {
					k: "call",
					name: t.v.toUpperCase(),
					args
				};
			}
			return {
				k: "ref",
				v: t.v
			};
		}
		if (t.t === "lp") {
			const n = expr();
			if (eat()?.t !== "rp") throw new Error("Ожидалась )");
			return n;
		}
		throw new Error("Ожидалось значение");
	}
	function cmp() {
		let left = add();
		while (peek()?.t === "op" && [
			"=",
			"!=",
			">",
			"<",
			">=",
			"<="
		].includes(peek().v)) left = {
			k: "bin",
			op: eat().v,
			a: left,
			b: add()
		};
		return left;
	}
	function add() {
		let left = mul();
		while (peek()?.t === "op" && ["+", "-"].includes(peek().v)) left = {
			k: "bin",
			op: eat().v,
			a: left,
			b: mul()
		};
		return left;
	}
	function mul() {
		let left = primary();
		while (peek()?.t === "op" && ["*", "/"].includes(peek().v)) left = {
			k: "bin",
			op: eat().v,
			a: left,
			b: primary()
		};
		return left;
	}
	function expr() {
		return cmp();
	}
	const tree = expr();
	if (i < tokens.length) throw new Error("Лишние символы в формуле");
	return tree;
}
function toNum(v) {
	if (typeof v === "number") return v;
	if (typeof v === "boolean") return v ? 1 : 0;
	if (v == null || v === "") return 0;
	const n = Number(String(v).replace(/\s/g, "").replace(",", "."));
	return Number.isFinite(n) ? n : 0;
}
function toStr(v) {
	if (v == null) return "";
	return String(v);
}
function truthy(v) {
	if (typeof v === "boolean") return v;
	if (typeof v === "number") return v !== 0;
	return toStr(v).length > 0 && toStr(v) !== "false";
}
function evalNode(node, resolve) {
	switch (node.k) {
		case "num": return node.v;
		case "str": return node.v;
		case "ref": return resolve(node.v);
		case "bin": {
			const a = evalNode(node.a, resolve);
			const b = evalNode(node.b, resolve);
			switch (node.op) {
				case "+": return toNum(a) + toNum(b);
				case "-": return toNum(a) - toNum(b);
				case "*": return toNum(a) * toNum(b);
				case "/": return toNum(b) === 0 ? null : toNum(a) / toNum(b);
				case ">": return toNum(a) > toNum(b);
				case "<": return toNum(a) < toNum(b);
				case ">=": return toNum(a) >= toNum(b);
				case "<=": return toNum(a) <= toNum(b);
				case "=": return toStr(a) === toStr(b) || toNum(a) === toNum(b);
				case "!=": return toStr(a) !== toStr(b);
				default: return null;
			}
		}
		case "call": {
			const args = node.args.map((a) => evalNode(a, resolve));
			switch (node.name) {
				case "IF": return truthy(args[0] ?? null) ? args[1] ?? null : args[2] ?? null;
				case "CONCAT": return args.map(toStr).join("");
				case "SUM": return args.reduce((s, v) => s + toNum(v), 0);
				case "AVERAGE":
					if (!args.length) return 0;
					return args.reduce((s, v) => s + toNum(v), 0) / args.length;
				case "ROUND": {
					const p = 10 ** (args[1] != null ? toNum(args[1]) : 0);
					return Math.round(toNum(args[0] ?? 0) * p) / p;
				}
				case "LEN": return toStr(args[0] ?? "").length;
				case "LOWER": return toStr(args[0] ?? "").toLowerCase();
				case "UPPER": return toStr(args[0] ?? "").toUpperCase();
				default: throw new Error(`Неизвестная функция ${node.name}`);
			}
		}
	}
}
function evalFormula(formula, row, columns) {
	try {
		const tree = parse(tokenize(formula));
		const resolve = (name) => {
			const col = columns.find((c) => c.name.toLowerCase() === name.toLowerCase()) ?? columns.find((c) => c.id === name);
			if (!col) return null;
			return row.cells[col.id]?.value ?? null;
		};
		const value = evalNode(tree, resolve);
		return {
			value,
			display: value == null ? "" : String(value),
			status: "success"
		};
	} catch (e) {
		return {
			value: null,
			status: "error",
			error: e instanceof Error ? e.message : "Ошибка формулы"
		};
	}
}
function recalcRow(row, columns) {
	const next = {
		...row,
		cells: { ...row.cells }
	};
	for (const col of columns) {
		if (col.type === "formula" && col.formula) next.cells[col.id] = evalFormula(col.formula, next, columns);
		if (col.type === "score" && col.score) {
			let total = 0;
			for (const rule of col.score.rules) if (matchScore(next.cells[rule.columnId]?.value ?? null, rule.op, rule.value)) total += rule.points;
			next.cells[col.id] = {
				value: total,
				display: String(total),
				status: "success"
			};
		}
	}
	return next;
}
function matchScore(v, op, rhs) {
	switch (op) {
		case "gt": return toNum(v) > toNum(rhs ?? 0);
		case "gte": return toNum(v) >= toNum(rhs ?? 0);
		case "lt": return toNum(v) < toNum(rhs ?? 0);
		case "eq": return toStr(v) === toStr(rhs ?? "");
		case "neq": return toStr(v) !== toStr(rhs ?? "");
		case "contains": return toStr(v).toLowerCase().includes(toStr(rhs ?? "").toLowerCase());
		case "not_empty": return v != null && toStr(v) !== "";
		case "empty": return v == null || toStr(v) === "";
	}
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var loadWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e3bfff75aac896f885bc78eea0ac93b6c865572ec4971c425046daccfbb3f7fc"));
var saveWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ccfa28a77e3f768db9d597ba66f4bd52e9be29ad2616e9932791de0123ab63ee"));
var KIND_TITLES = {
	job: (c) => ({
		title: `Новая вакансия: Sales Manager`,
		detail: `${c} ищет руководителя отдела продаж. Сигнал к заходу в закупку.`
	}),
	executive: (c) => ({
		title: "Смена коммерческого директора",
		detail: `В ${c} назначен новый CCO — окно для первого касания.`
	}),
	company_change: (c) => ({
		title: "Изменён юридический адрес",
		detail: `${c} обновила карточку в ЕГРЮЛ.`
	}),
	registration: (c) => ({
		title: "Новое юрлицо в группе",
		detail: `Зарегистрирована дочерняя компания ${c}.`
	}),
	okved: (c) => ({
		title: "Добавлен ОКВЭД 62.01",
		detail: `${c} расширила виды деятельности — разработка ПО.`
	}),
	tender: (c) => ({
		title: "Новый тендер на CRM",
		detail: `${c} разместила закупку внедрения CRM, срок 21 день.`
	}),
	mention: (c) => ({
		title: "Упоминание в СМИ",
		detail: `${c} анонсировала расширение B2B-направления.`
	})
};
function makeSignal(company, kind, hoursAgo, tableId, rowId) {
	const { title, detail } = KIND_TITLES[kind](company);
	return {
		id: nid("sig"),
		kind,
		company,
		title,
		detail,
		tableId,
		rowId,
		createdAt: (/* @__PURE__ */ new Date(Date.now() - hoursAgo * 36e5)).toISOString(),
		read: hoursAgo > 18
	};
}
var REGISTRY = [
	{
		name: "Яндекс",
		inn: "7736207543",
		website: "https://yandex.ru",
		email: "partners@yandex-team.ru",
		phone: "+7 495 739-70-00",
		industry: "Интернет / SaaS",
		employees: 21e3,
		revenue: 892,
		person: "Артём Савиновский",
		city: "Москва"
	},
	{
		name: "VK",
		inn: "7743001840",
		website: "https://vk.company",
		email: "b2b@vk.team",
		phone: "+7 495 725-63-57",
		industry: "Интернет / Медиа",
		employees: 14e3,
		revenue: 144,
		person: "Владимир Кириенко",
		city: "Москва"
	},
	{
		name: "X5 Group",
		inn: "7707030411",
		website: "https://www.x5.ru",
		email: "partners@x5.ru",
		phone: "+7 495 662-88-88",
		industry: "Ритейл",
		employees: 361e3,
		revenue: 3147,
		person: "Игорь Шехтерман",
		city: "Москва"
	},
	{
		name: "Сбер",
		inn: "7707083893",
		website: "https://www.sberbank.ru",
		email: "corp@sberbank.ru",
		phone: "+7 495 500-55-50",
		industry: "Банк / Финтех",
		employees: 284e3,
		revenue: 3380,
		person: "Герман Греф",
		city: "Москва"
	},
	{
		name: "Т-Банк",
		inn: "7710140679",
		website: "https://www.tbank.ru",
		email: "corp@tbank.ru",
		phone: "+7 495 648-98-00",
		industry: "Банк / Финтех",
		employees: 58e3,
		revenue: 787,
		person: "Станислав Близнюк",
		city: "Москва"
	},
	{
		name: "Ozon",
		inn: "7712263726",
		website: "https://www.ozon.ru",
		email: "partners@ozon.ru",
		phone: "+7 495 232-10-00",
		industry: "E-commerce",
		employees: 51e3,
		revenue: 617,
		person: "Геворг Саркисян",
		city: "Москва"
	},
	{
		name: "Wildberries",
		inn: "7721546864",
		website: "https://www.wildberries.ru",
		email: "corp@wildberries.ru",
		phone: "+7 495 363-06-36",
		industry: "E-commerce",
		employees: 12e4,
		revenue: 2376,
		person: "Владислав Бакальчук",
		city: "Москва"
	},
	{
		name: "Авито",
		inn: "7706419470",
		website: "https://www.avito.ru",
		email: "b2b@avito.ru",
		phone: "+7 495 777-12-12",
		industry: "Классифайд",
		employees: 6200,
		revenue: 97,
		person: "Владимир Колосов",
		city: "Москва"
	},
	{
		name: "HeadHunter",
		inn: "7718620740",
		website: "https://hh.ru",
		email: "corp@hh.ru",
		phone: "+7 495 974-64-27",
		industry: "HR Tech",
		employees: 3400,
		revenue: 32,
		person: "Дмитрий Сергиенков",
		city: "Москва"
	},
	{
		name: "2ГИС",
		inn: "5405270525",
		website: "https://2gis.ru",
		email: "partners@2gis.ru",
		phone: "+7 383 363-05-05",
		industry: "Карты / Данные",
		employees: 4200,
		revenue: 18,
		person: "Александр Сысоев",
		city: "Новосибирск"
	},
	{
		name: "МТС",
		inn: "7740000076",
		website: "https://mts.ru",
		email: "b2b@mts.ru",
		phone: "+7 495 766-01-66",
		industry: "Телеком",
		employees: 62e3,
		revenue: 606,
		person: "Вячеслав Николаев",
		city: "Москва"
	},
	{
		name: "МегаФон",
		inn: "7812014560",
		website: "https://megafon.ru",
		email: "b2b@megafon.ru",
		phone: "+7 800 550-05-00",
		industry: "Телеком",
		employees: 42e3,
		revenue: 432,
		person: "Хачатур Помбухчан",
		city: "Москва"
	},
	{
		name: "Ростелеком",
		inn: "7707049388",
		website: "https://www.company.rt.ru",
		email: "b2b@rt.ru",
		phone: "+7 800 100-08-00",
		industry: "Телеком",
		employees: 126e3,
		revenue: 702,
		person: "Михаил Осеевский",
		city: "Москва"
	},
	{
		name: "Лаборатория Касперского",
		inn: "7713140469",
		website: "https://www.kaspersky.ru",
		email: "b2b@kaspersky.com",
		phone: "+7 495 797-87-00",
		industry: "Кибербезопасность",
		employees: 5200,
		revenue: 72,
		person: "Евгений Касперский",
		city: "Москва"
	},
	{
		name: "Positive Technologies",
		inn: "7718668880",
		website: "https://www.ptsecurity.com",
		email: "sales@ptsecurity.com",
		phone: "+7 495 744-01-44",
		industry: "Кибербезопасность",
		employees: 2800,
		revenue: 21,
		person: "Денис Баранов",
		city: "Москва"
	},
	{
		name: "СКБ Контур",
		inn: "6663003127",
		website: "https://kontur.ru",
		email: "sales@skbkontur.ru",
		phone: "+7 343 365-81-81",
		industry: "SaaS / Бухгалтерия",
		employees: 9e3,
		revenue: 34,
		person: "Дмитрий Машков",
		city: "Екатеринбург"
	},
	{
		name: "Точка",
		inn: "7702070139",
		website: "https://tochka.com",
		email: "corp@tochka.com",
		phone: "+7 495 150-21-30",
		industry: "Банк / Финтех",
		employees: 4100,
		revenue: 28,
		person: "Андрей Морозов",
		city: "Москва"
	},
	{
		name: "Модульбанк",
		inn: "2204000595",
		website: "https://modulbank.ru",
		email: "hello@modulbank.ru",
		phone: "+7 495 232-35-00",
		industry: "Банк / Финтех",
		employees: 1800,
		revenue: 9,
		person: "Оксана Смирнова",
		city: "Москва"
	},
	{
		name: "Skyeng",
		inn: "7703403946",
		website: "https://skyeng.ru",
		email: "b2b@skyeng.ru",
		phone: "+7 495 137-77-47",
		industry: "EdTech",
		employees: 7500,
		revenue: 14,
		person: "Александр Ларьяновский",
		city: "Москва"
	},
	{
		name: "Skillbox",
		inn: "7724445478",
		website: "https://skillbox.ru",
		email: "b2b@skillbox.ru",
		phone: "+7 495 266-20-79",
		industry: "EdTech",
		employees: 2100,
		revenue: 8,
		person: "Дмитрий Крутов",
		city: "Москва"
	},
	{
		name: "Циан",
		inn: "7704358478",
		website: "https://cian.ru",
		email: "partners@cian.ru",
		phone: "+7 495 800-51-20",
		industry: "PropTech",
		employees: 1900,
		revenue: 12,
		person: "Дмитрий Гришин",
		city: "Москва"
	},
	{
		name: "Самокат",
		inn: "7802829993",
		website: "https://samokat.ru",
		email: "partners@samokat.ru",
		phone: "+7 812 449-07-00",
		industry: "Quick commerce",
		employees: 18e3,
		revenue: 96,
		person: "Антон Виноградов",
		city: "Санкт-Петербург"
	},
	{
		name: "Лента",
		inn: "7814148471",
		website: "https://lenta.com",
		email: "partners@lenta.com",
		phone: "+7 812 336-44-44",
		industry: "Ритейл",
		employees: 54e3,
		revenue: 612,
		person: "Владимир Сорокин",
		city: "Санкт-Петербург"
	},
	{
		name: "Магнит",
		inn: "2309085638",
		website: "https://magnit.ru",
		email: "partners@magnit.ru",
		phone: "+7 861 210-98-10",
		industry: "Ритейл",
		employees: 36e4,
		revenue: 2697,
		person: "Надежда Псарева",
		city: "Краснодар"
	}
];
function norm(s) {
	return s.toLowerCase().replace(/["«»]/g, "").replace(/\s+/g, " ").trim();
}
function findRecord(req) {
	const q = norm(req.query || req.company || req.inn || "");
	if (!q) return void 0;
	return REGISTRY.find((r) => norm(r.name) === q || r.inn === q || q.includes(norm(r.name)) || norm(r.name).includes(q) || req.inn && r.inn === req.inn);
}
function pickValue(rec, intent) {
	switch (intent) {
		case "email": return rec.email;
		case "phone": return rec.phone;
		case "website": return rec.website;
		case "company": return `${rec.inn} · ${rec.city} · ${rec.industry}`;
		case "person": return rec.person;
		case "revenue": return rec.revenue;
		case "employees": return rec.employees;
		case "custom": return `${rec.industry}, ${rec.city}, штат ${rec.employees}`;
	}
}
function delayFor(id) {
	return 280 + hash32(id) % 420;
}
function hitRate(providerId, query) {
	const rate = providerId === "dadata" ? .9 : providerId === "spark" ? .72 : .64;
	return hash32(providerId + query) % 100 / 100 < rate;
}
function makeProvider(id, name, hint, cost, intents) {
	return {
		id,
		name,
		hint,
		cost,
		intents,
		async lookup(req) {
			await new Promise((r) => setTimeout(r, delayFor(id + req.query)));
			if (id === "kontur" && hash32(req.query) % 17 === 0) return {
				ok: false,
				value: null,
				provider: name,
				cost: 0,
				error: "Провайдер временно недоступен"
			};
			const rec = findRecord(req);
			if (!rec || !hitRate(id, req.query + req.intent)) return {
				ok: false,
				value: null,
				provider: name,
				cost,
				error: "Не найдено"
			};
			const value = pickValue(rec, req.intent);
			return {
				ok: true,
				value,
				display: String(value),
				provider: name,
				cost
			};
		}
	};
}
var PROVIDERS = [
	makeProvider("dadata", "DaData", "ИНН, адрес, реквизиты ФНС", 1, [
		"company",
		"website",
		"phone",
		"email",
		"employees"
	]),
	makeProvider("spark", "СПАРК", "Карточка юрлица и финансы", 2, [
		"company",
		"revenue",
		"employees",
		"person"
	]),
	makeProvider("kontur", "Контур.Фокус", "Связи, проверки, выручка", 3, [
		"company",
		"revenue",
		"person",
		"custom"
	]),
	makeProvider("hh", "HeadHunter", "Вакансии и численность", 2, [
		"employees",
		"person",
		"custom"
	])
];
function providersFor(intent) {
	return PROVIDERS.filter((p) => p.intents.includes(intent));
}
async function runWaterfall(providerIds, req) {
	const tried = [];
	for (const id of providerIds) {
		const p = PROVIDERS.find((x) => x.id === id);
		if (!p) continue;
		tried.push(p.name);
		const res = await p.lookup(req);
		if (res.ok) return {
			...res,
			tried
		};
	}
	return {
		ok: false,
		value: null,
		provider: tried[tried.length - 1] ?? "—",
		cost: 0,
		error: "Ни один провайдер не нашёл данные",
		tried
	};
}
function col(name, type, width, extra = {}) {
	return {
		id: nid("col"),
		name,
		type,
		width,
		...extra
	};
}
var TABLE_TEMPLATES = [
	{
		id: "lead-gen",
		name: "Лидогенерация",
		description: "Компании, сайт, email и ICP-оценка",
		columns: () => [
			col("Компания", "company", 220, { frozen: true }),
			col("ИНН", "text", 130),
			col("Сайт", "url", 180),
			col("Email", "email", 200),
			col("Телефон", "phone", 150),
			col("Отрасль", "text", 160),
			col("Сотрудники", "number", 120),
			col("ICP Score", "score", 120)
		]
	},
	{
		id: "icp-research",
		name: "ICP-исследование",
		description: "Размер, отрасль, формула сегмента и AI-оценка",
		columns: () => [
			col("Компания", "company", 220, { frozen: true }),
			col("Отрасль", "text", 160),
			col("Сотрудники", "number", 120),
			col("Выручка, млрд", "number", 140),
			col("Сегмент", "formula", 140, { formula: `=IF({Сотрудники} > 500, "Enterprise", "SMB")` }),
			col("AI Fit", "ai", 120, { ai: { prompt: "Оцени компанию по шкале 1-100. Учитывай размер, отрасль, наличие отдела продаж и соответствие ICP." } })
		]
	},
	{
		id: "enrichment",
		name: "Обогащение компаний",
		description: "ИНН → карточка, сайт, телефон, email",
		columns: () => [
			col("Компания", "company", 220, { frozen: true }),
			col("ИНН", "text", 130),
			col("Сайт", "url", 180),
			col("Телефон", "phone", 150),
			col("Email", "email", 200),
			col("Карточка", "text", 240)
		]
	},
	{
		id: "prospecting",
		name: "Sales prospecting",
		description: "ЛПР, контакты и следующий шаг",
		columns: () => [
			col("Компания", "company", 200, { frozen: true }),
			col("ЛПР", "person", 180),
			col("Email", "email", 200),
			col("Телефон", "phone", 150),
			col("Статус", "text", 140),
			col("Следующий шаг", "text", 200)
		]
	},
	{
		id: "startups",
		name: "База стартапов",
		description: "Раунд, отрасль, сайт, оценка",
		columns: () => [
			col("Компания", "company", 200, { frozen: true }),
			col("Отрасль", "text", 150),
			col("Раунд", "text", 110),
			col("Сайт", "url", 180),
			col("Сотрудники", "number", 120),
			col("Заметка", "text", 220)
		]
	},
	{
		id: "b2b-leads",
		name: "B2B-лиды",
		description: "Готовый конвейер: данные → скоринг → CRM",
		columns: () => [
			col("Компания", "company", 200, { frozen: true }),
			col("ИНН", "text", 130),
			col("Сайт", "url", 170),
			col("Email", "email", 190),
			col("Сотрудники", "number", 120),
			col("ICP Score", "score", 120),
			col("Готов к CRM", "boolean", 120)
		]
	}
];
function nowIso(daysAgo = 0) {
	return (/* @__PURE__ */ new Date(Date.now() - daysAgo * 864e5)).toISOString();
}
function cell$1(value) {
	if (value == null || value === "") return {
		value: null,
		status: "empty"
	};
	return {
		value,
		display: String(value),
		status: "success"
	};
}
function makeRow(columns, values) {
	const cells = {};
	for (const c of columns) {
		const v = values[c.name];
		cells[c.id] = v === void 0 ? {
			value: null,
			status: "empty"
		} : cell$1(v);
	}
	return recalcRow({
		id: nid("row"),
		cells,
		createdAt: nowIso()
	}, columns);
}
function ownerMember() {
	return {
		id: nid("mb"),
		name: "Владелец",
		email: "",
		role: "owner",
		status: "active",
		invitedAt: nowIso(12)
	};
}
function hydrateWorkspace(raw) {
	return {
		...raw,
		members: raw.members?.length ? raw.members : [ownerMember()],
		onboardingComplete: raw.onboardingComplete ?? true,
		tables: raw.tables ?? [],
		agents: raw.agents ?? [],
		audiences: raw.audiences ?? [],
		signals: raw.signals ?? [],
		integrations: raw.integrations ?? [],
		webhooks: raw.webhooks ?? [],
		activity: raw.activity ?? [],
		creditLog: raw.creditLog ?? [],
		credits: raw.credits ?? {
			data: 0,
			ai: 0,
			actions: 0
		}
	};
}
function createEmptyWorkspace() {
	const companyCol = col("Компания", "company", 220, { frozen: true });
	const innCol = col("ИНН", "text", 128);
	const siteCol = col("Сайт", "url", 180);
	const emailCol = col("Email", "email", 210);
	const phoneCol = col("Телефон", "enrichment", 150, { enrichment: {
		intent: "phone",
		providers: ["dadata", "spark"],
		inputColumnId: companyCol.id
	} });
	const industryCol = col("Отрасль", "text", 170);
	const empCol = col("Сотрудники", "number", 128);
	const revCol = col("Выручка, млрд", "number", 140);
	const segmentCol = col("Сегмент", "formula", 140, { formula: `=IF({Сотрудники} > 500, "Enterprise", "SMB")` });
	const scoreCol = col("ICP Score", "score", 120, { score: { rules: [
		{
			id: nid("sr"),
			label: "Штат > 500",
			columnId: empCol.id,
			op: "gt",
			value: 500,
			points: 20
		},
		{
			id: nid("sr"),
			label: "Выручка > 20",
			columnId: revCol.id,
			op: "gt",
			value: 20,
			points: 20
		},
		{
			id: nid("sr"),
			label: "SaaS / интернет / финтех",
			columnId: industryCol.id,
			op: "contains",
			value: "SaaS",
			points: 15
		},
		{
			id: nid("sr"),
			label: "Email найден",
			columnId: emailCol.id,
			op: "not_empty",
			points: 10
		},
		{
			id: nid("sr"),
			label: "Сайт найден",
			columnId: siteCol.id,
			op: "not_empty",
			points: 10
		},
		{
			id: nid("sr"),
			label: "Телефон найден",
			columnId: phoneCol.id,
			op: "not_empty",
			points: 10
		}
	] } });
	const columns = [
		companyCol,
		innCol,
		siteCol,
		emailCol,
		phoneCol,
		industryCol,
		empCol,
		revCol,
		segmentCol,
		scoreCol,
		col("AI Fit", "ai", 110, { ai: { prompt: "Оцени компанию по шкале 1-100. Учитывай размер, отрасль, наличие отдела продаж и соответствие ICP B2B SaaS." } })
	];
	const rows = REGISTRY.map((r) => makeRow(columns, {
		Компания: r.name,
		ИНН: r.inn,
		Сайт: r.website,
		Email: r.email,
		Отрасль: r.industry,
		Сотрудники: r.employees,
		"Выручка, млрд": r.revenue
	}));
	const tableId = nid("tbl");
	const table = {
		id: tableId,
		name: "Компании — ICP 2026",
		description: "Основной список для квалификации российского B2B",
		favorite: true,
		template: "lead-gen",
		columns,
		rows,
		filters: emptyFilterGroup(),
		sorts: [{
			columnId: scoreCol.id,
			dir: "desc"
		}],
		createdAt: nowIso(12),
		updatedAt: nowIso()
	};
	return {
		id: nid("ws"),
		name: "Рабочее пространство",
		plan: "launch",
		credits: {
			data: 8420,
			ai: 2130,
			actions: 1e3
		},
		onboardingComplete: false,
		tables: [table],
		agents: [{
			id: nid("ag"),
			name: "Lead Researcher",
			goal: "Найти потенциальных клиентов и собрать карточку",
			input: "Company",
			tasks: [
				{
					id: nid("tk"),
					title: "Найти сайт"
				},
				{
					id: nid("tk"),
					title: "Определить отрасль"
				},
				{
					id: nid("tk"),
					title: "Найти размер компании"
				},
				{
					id: nid("tk"),
					title: "Определить ICP fit"
				},
				{
					id: nid("tk"),
					title: "Дать объяснение"
				}
			],
			output: "json",
			status: "idle"
		}],
		audiences: [{
			id: nid("aud"),
			name: "Enterprise SaaS",
			tableId,
			filters: {
				id: nid("fg"),
				kind: "group",
				combinator: "and",
				children: [
					{
						id: nid("fc"),
						kind: "cond",
						columnId: empCol.id,
						op: "gt",
						value: 500
					},
					{
						id: nid("fc"),
						kind: "cond",
						columnId: scoreCol.id,
						op: "gte",
						value: 40
					},
					{
						id: nid("fc"),
						kind: "cond",
						columnId: emailCol.id,
						op: "not_empty"
					}
				]
			},
			createdAt: nowIso(3)
		}],
		signals: [
			makeSignal("VK", "job", 2, tableId, rows[1]?.id),
			makeSignal("Яндекс", "tender", 5, tableId, rows[0]?.id),
			makeSignal("Ozon", "executive", 9, tableId),
			makeSignal("СКБ Контур", "okved", 14, tableId),
			makeSignal("Т-Банк", "mention", 20, tableId),
			makeSignal("Positive Technologies", "job", 28, tableId)
		],
		integrations: [
			{
				id: nid("int"),
				provider: "amocrm",
				name: "amoCRM",
				connected: false
			},
			{
				id: nid("int"),
				provider: "bitrix24",
				name: "Bitrix24",
				connected: false
			},
			{
				id: nid("int"),
				provider: "1c",
				name: "1С",
				connected: false
			},
			{
				id: nid("int"),
				provider: "telegram",
				name: "Telegram",
				connected: false
			},
			{
				id: nid("int"),
				provider: "vk",
				name: "VK",
				connected: false
			},
			{
				id: nid("int"),
				provider: "email",
				name: "Email",
				connected: true
			},
			{
				id: nid("int"),
				provider: "webhook",
				name: "Webhooks",
				connected: true
			}
		],
		webhooks: [{
			id: nid("wh"),
			url: "https://example.com/webhook",
			events: ["enrichment_completed", "signal_detected"],
			enabled: true
		}],
		activity: [
			{
				id: nid("ac"),
				text: "Создана таблица «Компании — ICP 2026»",
				createdAt: nowIso(12)
			},
			{
				id: nid("ac"),
				text: "Импортировано 24 компании",
				createdAt: nowIso(12)
			},
			{
				id: nid("ac"),
				text: "Добавлена формула сегмента Enterprise / SMB",
				createdAt: nowIso(4)
			},
			{
				id: nid("ac"),
				text: "Собрана аудитория Enterprise SaaS",
				createdAt: nowIso(3)
			},
			{
				id: nid("ac"),
				text: "Сигнал: VK — новая вакансия Sales Manager",
				createdAt: nowIso(0)
			}
		],
		creditLog: [{
			id: nid("tx"),
			bucket: "data",
			amount: -24,
			reason: "Обогащение карточек компаний",
			createdAt: nowIso(6)
		}],
		members: [ownerMember()]
	};
}
function createTableFromTemplate(templateId, name) {
	const t = TABLE_TEMPLATES.find((x) => x.id === templateId) ?? TABLE_TEMPLATES[0];
	const columns = t.columns();
	return {
		id: nid("tbl"),
		name: name ?? t.name,
		description: t.description,
		favorite: false,
		template: t.id,
		columns,
		rows: [],
		filters: emptyFilterGroup(),
		sorts: [],
		createdAt: nowIso(),
		updatedAt: nowIso()
	};
}
var completeAiCell = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f8ce3e2eca644d9b7e118cfa05000e186f75b9447d1c02f8fcf5ff9613de683a"));
function cell(row, columns, name) {
	const col = columns.find((c) => c.name.toLowerCase() === name.toLowerCase() || c.id === name);
	return col ? row.cells[col.id]?.value ?? null : null;
}
function interpolatePrompt(prompt, row, columns) {
	return prompt.replace(/\{\{?([^}]+)\}?\}/g, (_, raw) => {
		const v = cell(row, columns, String(raw).trim());
		return v == null ? "" : String(v);
	});
}
function mockAiComplete(prompt, row, columns) {
	const filled = interpolatePrompt(prompt, row, columns);
	const company = String(cell(row, columns, "Компания") ?? "");
	const employees = Number(cell(row, columns, "Сотрудники") ?? 0);
	const industry = String(cell(row, columns, "Отрасль") ?? "");
	const email = String(cell(row, columns, "Email") ?? "");
	const website = String(cell(row, columns, "Сайт") ?? "");
	if (/шкал|оцен|score|1-100|1–100|подход/i.test(prompt)) {
		let score = 40;
		if (employees > 500) score += 20;
		else if (employees > 100) score += 12;
		if (/saas|интернет|финтех|hr tech|кибер/i.test(industry)) score += 22;
		if (email) score += 8;
		if (website) score += 6;
		score = Math.min(98, score + hash32(company) % 7);
		const explanation = [
			employees > 500 ? "крупный штат" : "средний размер",
			industry || "отрасль не указана",
			email ? "есть email" : "нет email"
		].join(", ");
		return {
			value: score,
			display: String(score),
			explanation: `${company || "Компания"}: ${explanation}.`
		};
	}
	const snippet = filled.slice(0, 180).replace(/\s+/g, " ").trim();
	const display = company ? `${company}: ${snippet || "недостаточно данных для вывода"}` : snippet || "Недостаточно данных в строке";
	return {
		value: display,
		display,
		explanation: display
	};
}
function mockAgentRun(goal, tasks, company) {
	const findings = {
		website: `https://${company.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "")}.ru`,
		industry: "B2B / технологии",
		size: "500–5 000",
		icp: 78,
		note: "Есть отдел продаж, закупки централизованы."
	};
	return JSON.stringify({
		goal,
		company,
		tasks,
		result: findings
	}, null, 2);
}
var SAVE_MS = 700;
function touch(table) {
	return {
		...table,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function mapTable(ws, tableId, fn) {
	return {
		...ws,
		tables: ws.tables.map((t) => t.id === tableId ? touch(fn(t)) : t)
	};
}
function activity(ws, text) {
	return {
		...ws,
		activity: [{
			id: nid("ac"),
			text,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...ws.activity].slice(0, 40)
	};
}
function spend(ws, bucket, amount, reason) {
	const next = Math.max(0, ws.credits[bucket] - amount);
	return {
		...ws,
		credits: {
			...ws.credits,
			[bucket]: next
		},
		creditLog: [{
			id: nid("tx"),
			bucket,
			amount: -amount,
			reason,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...ws.creditLog].slice(0, 80)
	};
}
function emptyCell() {
	return {
		value: null,
		status: "empty"
	};
}
function valueCell(value) {
	if (value == null || value === "") return emptyCell();
	return {
		value,
		display: String(value),
		status: "success"
	};
}
function recalcTable(table) {
	return {
		...table,
		rows: table.rows.map((r) => recalcRow(r, table.columns))
	};
}
var saveTimer = null;
var useWorkspace = create((set, get) => ({
	workspace: null,
	loading: true,
	error: null,
	saving: false,
	search: "",
	selectedRowIds: [],
	past: [],
	future: [],
	persistSoon: () => {
		if (saveTimer) clearTimeout(saveTimer);
		saveTimer = setTimeout(async () => {
			const ws = get().workspace;
			if (!ws) return;
			set({ saving: true });
			try {
				await saveWorkspace({ data: { workspace: ws } });
			} catch {} finally {
				set({ saving: false });
			}
		}, SAVE_MS);
	},
	pushHistory: () => {
		const ws = get().workspace;
		if (!ws) return;
		set({
			past: [...get().past, structuredClone(ws)].slice(-40),
			future: []
		});
	},
	undo: () => {
		const { past, workspace, future } = get();
		const prev = past[past.length - 1];
		if (!prev || !workspace) return;
		set({
			workspace: prev,
			past: past.slice(0, -1),
			future: [...future, workspace]
		});
		get().persistSoon();
	},
	redo: () => {
		const { future, workspace, past } = get();
		const next = future[future.length - 1];
		if (!next || !workspace) return;
		set({
			workspace: next,
			future: future.slice(0, -1),
			past: [...past, workspace]
		});
		get().persistSoon();
	},
	bootstrap: async () => {
		set({
			loading: true,
			error: null
		});
		try {
			const existing = await loadWorkspace();
			set({
				workspace: hydrateWorkspace(existing ?? createEmptyWorkspace()),
				loading: false
			});
			if (!existing) get().persistSoon();
		} catch (e) {
			set({
				loading: false,
				error: e instanceof Error ? e.message : "Не удалось загрузить пространство",
				workspace: createEmptyWorkspace()
			});
		}
	},
	setSearch: (q) => set({ search: q }),
	setSelected: (ids) => set({ selectedRowIds: ids }),
	patch: (fn, history = true) => {
		const ws = get().workspace;
		if (!ws) return;
		if (history) get().pushHistory();
		set({ workspace: fn(ws) });
		get().persistSoon();
	},
	createTable: ({ name, templateId, empty }) => {
		const id = nid("tbl");
		get().patch((ws) => {
			const table = templateId ? createTableFromTemplate(templateId, name) : {
				id,
				name,
				description: "",
				favorite: false,
				columns: empty ? [{
					id: nid("col"),
					name: "Компания",
					type: "company",
					width: 220,
					frozen: true
				}] : createTableFromTemplate("lead-gen", name).columns,
				rows: [],
				filters: emptyFilterGroup(),
				sorts: [],
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			const created = {
				...table,
				id: table.id || id,
				name
			};
			return activity({
				...ws,
				tables: [created, ...ws.tables]
			}, `Создана таблица «${name}»`);
		});
		return (get().workspace?.tables ?? [])[0]?.id ?? id;
	},
	renameTable: (id, name) => get().patch((ws) => mapTable(ws, id, (t) => ({
		...t,
		name
	}))),
	deleteTable: (id) => get().patch((ws) => activity({
		...ws,
		tables: ws.tables.filter((t) => t.id !== id)
	}, "Таблица удалена")),
	toggleFavorite: (id) => get().patch((ws) => mapTable(ws, id, (t) => ({
		...t,
		favorite: !t.favorite
	})), false),
	addColumn: (tableId, column) => get().patch((ws) => mapTable(ws, tableId, (t) => recalcTable({
		...t,
		columns: [...t.columns, column],
		rows: t.rows.map((r) => ({
			...r,
			cells: {
				...r.cells,
				[column.id]: emptyCell()
			}
		}))
	}))),
	updateColumn: (tableId, columnId, patch) => get().patch((ws) => mapTable(ws, tableId, (t) => recalcTable({
		...t,
		columns: t.columns.map((c) => c.id === columnId ? {
			...c,
			...patch
		} : c)
	}))),
	deleteColumn: (tableId, columnId) => get().patch((ws) => mapTable(ws, tableId, (t) => ({
		...t,
		columns: t.columns.filter((c) => c.id !== columnId),
		rows: t.rows.map((r) => {
			const cells = { ...r.cells };
			delete cells[columnId];
			return {
				...r,
				cells
			};
		})
	}))),
	resizeColumn: (tableId, columnId, width) => get().patch((ws) => mapTable(ws, tableId, (t) => ({
		...t,
		columns: t.columns.map((c) => c.id === columnId ? {
			...c,
			width: Math.max(72, Math.min(480, width))
		} : c)
	})), false),
	reorderColumn: (tableId, fromId, toId) => {
		if (fromId === toId) return;
		get().patch((ws) => mapTable(ws, tableId, (t) => {
			const from = t.columns.findIndex((c) => c.id === fromId);
			const to = t.columns.findIndex((c) => c.id === toId);
			if (from < 0 || to < 0) return t;
			const columns = [...t.columns];
			const [item] = columns.splice(from, 1);
			if (!item) return t;
			columns.splice(to, 0, item);
			return {
				...t,
				columns
			};
		}));
	},
	addRow: (tableId) => get().patch((ws) => mapTable(ws, tableId, (t) => {
		const row = {
			id: nid("row"),
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			cells: Object.fromEntries(t.columns.map((c) => [c.id, emptyCell()]))
		};
		return {
			...t,
			rows: [...t.rows, recalcRow(row, t.columns)]
		};
	})),
	updateCell: (tableId, rowId, columnId, value) => get().patch((ws) => mapTable(ws, tableId, (t) => ({
		...t,
		rows: t.rows.map((r) => r.id === rowId ? recalcRow({
			...r,
			cells: {
				...r.cells,
				[columnId]: valueCell(value)
			}
		}, t.columns) : r)
	}))),
	deleteRows: (tableId, rowIds) => {
		const setIds = new Set(rowIds);
		get().patch((ws) => mapTable(ws, tableId, (t) => ({
			...t,
			rows: t.rows.filter((r) => !setIds.has(r.id))
		})));
		set({ selectedRowIds: [] });
	},
	duplicateRows: (tableId, rowIds) => {
		const setIds = new Set(rowIds);
		get().patch((ws) => mapTable(ws, tableId, (t) => {
			const copies = t.rows.filter((r) => setIds.has(r.id)).map((r) => ({
				id: nid("row"),
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				cells: structuredClone(r.cells)
			}));
			return {
				...t,
				rows: [...t.rows, ...copies]
			};
		}));
	},
	importCsv: (tableId, text) => {
		const grid = parseCsv(text);
		const headers = grid[0] ?? [];
		const body = grid.slice(1);
		get().patch((ws) => mapTable(ws, tableId, (t) => {
			let columns = [...t.columns];
			const index = headers.map((h) => {
				const existing = columns.find((c) => c.name.toLowerCase() === h.trim().toLowerCase());
				if (existing) return columns.indexOf(existing);
				const c = {
					id: nid("col"),
					name: h.trim() || "Колонка",
					type: "text",
					width: 160
				};
				columns = [...columns, c];
				return columns.length - 1;
			});
			const rows = body.map((line) => {
				const cells = {};
				for (const c of columns) cells[c.id] = emptyCell();
				line.forEach((v, i) => {
					const col = columns[index[i] ?? -1];
					if (!col) return;
					const num = Number(v.replace(/\s/g, "").replace(",", "."));
					cells[col.id] = valueCell(col.type === "number" && v && Number.isFinite(num) ? num : v);
				});
				return recalcRow({
					id: nid("row"),
					cells,
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				}, columns);
			});
			return {
				...t,
				columns,
				rows: [...t.rows, ...rows]
			};
		}));
		return { rows: body.length };
	},
	setFilters: (tableId, filters) => get().patch((ws) => mapTable(ws, tableId, (t) => ({
		...t,
		filters
	})), false),
	setSort: (tableId, sort) => get().patch((ws) => mapTable(ws, tableId, (t) => ({
		...t,
		sorts: sort ? [sort] : []
	})), false),
	runEnrichment: async (tableId, columnId, rowIds) => {
		const ws = get().workspace;
		const table = ws?.tables.find((t) => t.id === tableId);
		const column = table?.columns.find((c) => c.id === columnId);
		if (!ws || !table || !column?.enrichment) return;
		const cfg = column.enrichment;
		const targets = table.rows.filter((r) => !rowIds || rowIds.includes(r.id));
		get().pushHistory();
		get().patch((cur) => {
			let next = mapTable(cur, tableId, (t) => ({
				...t,
				rows: t.rows.map((r) => targets.some((x) => x.id === r.id) ? {
					...r,
					cells: {
						...r.cells,
						[columnId]: {
							value: r.cells[columnId]?.value ?? null,
							status: "loading"
						}
					}
				} : r)
			}));
			next = activity(next, `Запущено обогащение «${column.name}» · ${targets.length} строк`);
			return next;
		}, false);
		let spent = 0;
		let found = 0;
		for (const row of targets) {
			const q = String(row.cells[cfg.inputColumnId]?.value ?? "");
			const res = await runWaterfall(cfg.providers, {
				intent: cfg.intent,
				query: q,
				company: q
			});
			spent += res.cost;
			if (res.ok) found += 1;
			get().patch((cur) => {
				let next = mapTable(cur, tableId, (t) => ({
					...t,
					rows: t.rows.map((r) => r.id === row.id ? recalcRow({
						...r,
						cells: {
							...r.cells,
							[columnId]: {
								value: res.value,
								display: res.display ?? (res.value == null ? "" : String(res.value)),
								status: res.ok ? "success" : "error",
								provider: res.provider,
								credits: res.cost,
								error: res.error
							}
						}
					}, t.columns) : r)
				}));
				if (res.cost) next = spend(next, "data", res.cost, `${column.name}: ${q || "строка"}`);
				return next;
			}, false);
		}
		get().patch((cur) => activity(cur, `Обогащение «${column.name}»: ${found}/${targets.length}, −${spent} кр.`), false);
	},
	runAiColumn: async (tableId, columnId, rowIds) => {
		const ws = get().workspace;
		const table = ws?.tables.find((t) => t.id === tableId);
		const column = table?.columns.find((c) => c.id === columnId);
		if (!ws || !table || !column?.ai) return;
		const targets = table.rows.filter((r) => !rowIds || rowIds.includes(r.id));
		get().pushHistory();
		get().patch((cur) => mapTable(cur, tableId, (t) => ({
			...t,
			rows: t.rows.map((r) => targets.some((x) => x.id === r.id) ? {
				...r,
				cells: {
					...r.cells,
					[columnId]: {
						value: r.cells[columnId]?.value ?? null,
						status: "loading"
					}
				}
			} : r)
		})), false);
		for (const row of targets) {
			const prompt = column.ai.prompt;
			const context = interpolatePrompt(table.columns.map((c) => `${c.name}: {{${c.name}}}`).join("\n"), row, table.columns);
			let value;
			let display;
			let explanation;
			try {
				const res = await completeAiCell({ data: {
					prompt,
					context
				} });
				if (res.ok) {
					const text = res.text;
					const num = text.match(/\b(\d{1,3})\b/);
					value = num ? Number(num[1]) : text;
					display = text;
					explanation = text;
				} else {
					const mock = mockAiComplete(prompt, row, table.columns);
					value = mock.value;
					display = mock.display;
					explanation = mock.explanation;
				}
			} catch {
				const mock = mockAiComplete(prompt, row, table.columns);
				value = mock.value;
				display = mock.display;
				explanation = mock.explanation;
			}
			get().patch((cur) => {
				let next = mapTable(cur, tableId, (t) => ({
					...t,
					rows: t.rows.map((r) => r.id === row.id ? recalcRow({
						...r,
						cells: {
							...r.cells,
							[columnId]: {
								value,
								display: String(display),
								status: "success",
								explanation,
								credits: 4
							}
						}
					}, t.columns) : r)
				}));
				next = spend(next, "ai", 4, `AI · ${column.name}`);
				return next;
			}, false);
		}
	},
	createAudience: (input) => get().patch((ws) => {
		const aud = {
			...input,
			id: nid("aud"),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		return activity({
			...ws,
			audiences: [aud, ...ws.audiences]
		}, `Аудитория «${input.name}»`);
	}),
	deleteAudience: (id) => get().patch((ws) => ({
		...ws,
		audiences: ws.audiences.filter((a) => a.id !== id)
	})),
	applyAudience: (id) => {
		const a = get().workspace?.audiences.find((x) => x.id === id);
		if (!a) return void 0;
		get().setFilters(a.tableId, a.filters);
		return a.tableId;
	},
	toggleIntegration: (id) => get().patch((ws) => ({
		...ws,
		integrations: ws.integrations.map((i) => i.id === id ? {
			...i,
			connected: !i.connected
		} : i)
	})),
	exportToIntegration: (id, count) => get().patch((ws) => {
		let next = {
			...ws,
			integrations: ws.integrations.map((i) => i.id === id ? {
				...i,
				lastExportAt: (/* @__PURE__ */ new Date()).toISOString(),
				lastCount: count
			} : i)
		};
		next = spend(next, "actions", Math.max(1, Math.round(count / 10)), "Экспорт в CRM");
		const name = ws.integrations.find((i) => i.id === id)?.name ?? "CRM";
		return activity(next, `✓ ${count} контактов отправлено в ${name}`);
	}),
	addWebhook: (url, events) => get().patch((ws) => ({
		...ws,
		webhooks: [{
			id: nid("wh"),
			url,
			events,
			enabled: true
		}, ...ws.webhooks]
	})),
	testWebhook: async (id) => {
		await new Promise((r) => setTimeout(r, 400));
		const ok = true;
		get().patch((ws) => ({
			...ws,
			webhooks: ws.webhooks.map((w) => w.id === id ? {
				...w,
				lastTestAt: (/* @__PURE__ */ new Date()).toISOString(),
				lastStatus: "ok"
			} : w)
		}));
		return { ok };
	},
	deleteWebhook: (id) => get().patch((ws) => ({
		...ws,
		webhooks: ws.webhooks.filter((w) => w.id !== id)
	})),
	toggleWebhook: (id) => get().patch((ws) => ({
		...ws,
		webhooks: ws.webhooks.map((w) => w.id === id ? {
			...w,
			enabled: !w.enabled
		} : w)
	})),
	runAgent: async (id, company) => {
		get().patch((ws) => ({
			...ws,
			agents: ws.agents.map((a) => a.id === id ? {
				...a,
				status: "running"
			} : a)
		}), false);
		await new Promise((r) => setTimeout(r, 900));
		const agent = get().workspace?.agents.find((a) => a.id === id);
		if (!agent) return;
		const result = mockAgentRun(agent.goal, agent.tasks.map((t) => t.title), company);
		get().patch((ws) => {
			let next = {
				...ws,
				agents: ws.agents.map((a) => a.id === id ? {
					...a,
					status: "done",
					lastRunAt: (/* @__PURE__ */ new Date()).toISOString(),
					lastResult: result
				} : a)
			};
			next = spend(next, "ai", 12, `Агент «${agent.name}»`);
			return activity(next, `Агент «${agent.name}» обработал ${company}`);
		});
	},
	createAgent: (agent) => get().patch((ws) => ({
		...ws,
		agents: [{
			...agent,
			id: nid("ag"),
			status: "idle"
		}, ...ws.agents]
	})),
	deleteAgent: (id) => get().patch((ws) => ({
		...ws,
		agents: ws.agents.filter((a) => a.id !== id)
	})),
	ingestAgentResult: (tableId, company, json) => get().patch((ws) => mapTable(ws, tableId, (t) => {
		let columns = t.columns;
		let note = columns.find((c) => c.name === "Исследование");
		if (!note) {
			note = {
				id: nid("col"),
				name: "Исследование",
				type: "text",
				width: 280
			};
			columns = [...columns, note];
		}
		const companyCol = columns.find((c) => c.type === "company") ?? columns[0];
		const row = {
			id: nid("row"),
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			cells: Object.fromEntries(columns.map((c) => [c.id, emptyCell()]))
		};
		if (companyCol) row.cells[companyCol.id] = valueCell(company);
		row.cells[note.id] = valueCell(json);
		return recalcTable({
			...t,
			columns,
			rows: [...t.rows, row]
		});
	})),
	markSignalRead: (id) => get().patch((ws) => ({
		...ws,
		signals: ws.signals.map((s) => s.id === id ? {
			...s,
			read: true
		} : s)
	}), false),
	addSignal: (company, kind, tableId) => get().patch((ws) => ({
		...ws,
		signals: [makeSignal(company, kind, 0, tableId), ...ws.signals]
	})),
	completeOnboarding: (goal, tableId) => get().patch((ws) => ({
		...ws,
		onboardingComplete: true,
		onboardingGoal: goal,
		tables: tableId ? ws.tables : ws.tables.length ? ws.tables : [createTableFromTemplate("lead-gen", "Моя первая таблица"), ...ws.tables]
	})),
	resetOnboarding: () => get().patch((ws) => ({
		...ws,
		onboardingComplete: false
	}), false),
	setPlan: (plan) => get().patch((ws) => ({
		...ws,
		plan
	})),
	renameWorkspace: (name) => get().patch((ws) => ({
		...ws,
		name
	})),
	addCredits: (bucket, amount) => get().patch((ws) => ({
		...ws,
		credits: {
			...ws.credits,
			[bucket]: ws.credits[bucket] + amount
		},
		creditLog: [{
			id: nid("tx"),
			bucket,
			amount,
			reason: "Пополнение",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...ws.creditLog]
	})),
	inviteMember: ({ name, email, role }) => get().patch((ws) => {
		const member = {
			id: nid("mb"),
			name: name.trim() || email.split("@")[0] || "Участник",
			email: email.trim(),
			role,
			status: "invited",
			invitedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		return activity({
			...ws,
			members: [...ws.members, member]
		}, `Приглашён ${member.email || member.name}`);
	}),
	removeMember: (id) => get().patch((ws) => ({
		...ws,
		members: ws.members.filter((m) => m.id !== id || m.role === "owner")
	})),
	setMemberRole: (id, role) => get().patch((ws) => ({
		...ws,
		members: ws.members.map((m) => m.id === id && m.role !== "owner" ? {
			...m,
			role
		} : m)
	}))
}));
function useTable(tableId) {
	return useWorkspace((s) => s.workspace?.tables.find((t) => t.id === tableId));
}
//#endregion
export { emptyFilterGroup as a, toCsv as c, applyView as i, useTable as l, PROVIDERS as n, filterIsActive as o, TABLE_TEMPLATES as r, providersFor as s, FILTER_OPS as t, useWorkspace as u };
