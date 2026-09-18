//#region node_modules/.nitro/vite/services/ssr/assets/types-IAoun2Tf.js
var COLUMN_TYPE_META = {
	text: {
		label: "Текст",
		hint: "Строка произвольного текста"
	},
	number: {
		label: "Число",
		hint: "Числовое значение"
	},
	email: {
		label: "Email",
		hint: "Электронная почта"
	},
	phone: {
		label: "Телефон",
		hint: "Номер телефона"
	},
	url: {
		label: "URL",
		hint: "Сайт или ссылка"
	},
	company: {
		label: "Компания",
		hint: "Название компании"
	},
	person: {
		label: "Человек",
		hint: "Контакт или сотрудник"
	},
	date: {
		label: "Дата",
		hint: "Календарная дата"
	},
	boolean: {
		label: "Флаг",
		hint: "Да / нет"
	},
	formula: {
		label: "Формула",
		hint: "IF, CONCAT, SUM и другие"
	},
	enrichment: {
		label: "Обогащение",
		hint: "Данные из провайдеров"
	},
	ai: {
		label: "AI",
		hint: "Промпт по данным строки"
	},
	score: {
		label: "Скоринг",
		hint: "ICP-оценка по правилам"
	}
};
var INTENT_META = {
	email: {
		label: "Email",
		hint: "Рабочая почта компании"
	},
	phone: {
		label: "Телефон",
		hint: "Контактный номер"
	},
	website: {
		label: "Сайт",
		hint: "Официальный сайт"
	},
	company: {
		label: "Карточка компании",
		hint: "ИНН, отрасль, адрес"
	},
	person: {
		label: "Контакт",
		hint: "ЛПР или сотрудник"
	},
	revenue: {
		label: "Выручка",
		hint: "Финансовые показатели"
	},
	employees: {
		label: "Сотрудники",
		hint: "Численность штата"
	},
	custom: {
		label: "Свой запрос",
		hint: "Произвольное исследование"
	}
};
var SIGNAL_KIND_META = {
	job: { label: "Новая вакансия" },
	executive: { label: "Изменение руководителя" },
	company_change: { label: "Изменение компании" },
	registration: { label: "Регистрация компании" },
	okved: { label: "Изменение ОКВЭД" },
	tender: { label: "Новый тендер" },
	mention: { label: "Упоминание" }
};
var INTEGRATION_META = {
	amocrm: {
		label: "amoCRM",
		hint: "Сделки и контакты"
	},
	bitrix24: {
		label: "Bitrix24",
		hint: "CRM и задачи"
	},
	"1c": {
		label: "1С",
		hint: "Контрагенты"
	},
	telegram: {
		label: "Telegram",
		hint: "Уведомления в чат"
	},
	vk: {
		label: "VK",
		hint: "Сообщения и реклама"
	},
	email: {
		label: "Email",
		hint: "Исходящая почта"
	},
	webhook: {
		label: "Webhooks",
		hint: "HTTP-события"
	}
};
var PLAN_META = {
	free: {
		label: "Free",
		price: "0 ₽",
		hint: "Для знакомства с продуктом"
	},
	launch: {
		label: "Launch",
		price: "9 900 ₽",
		hint: "Команда до 5 человек"
	},
	growth: {
		label: "Growth",
		price: "29 900 ₽",
		hint: "Отдел продаж и аналитика"
	},
	enterprise: {
		label: "Enterprise",
		price: "По запросу",
		hint: "Свои провайдеры и SLA"
	}
};
var MEMBER_ROLE_META = {
	owner: { label: "Владелец" },
	admin: { label: "Админ" },
	editor: { label: "Редактор" },
	viewer: { label: "Наблюдатель" }
};
var ONBOARDING_GOALS = [
	{
		id: "find-leads",
		label: "Найти лиды",
		hint: "Список компаний и контакты"
	},
	{
		id: "enrich",
		label: "Обогатить компании",
		hint: "ИНН, сайт, email, штат"
	},
	{
		id: "research",
		label: "Исследовать prospects",
		hint: "AI-оценка и ICP"
	},
	{
		id: "audiences",
		label: "Собрать аудитории",
		hint: "Динамические сегменты"
	},
	{
		id: "automate",
		label: "Автоматизировать продажи",
		hint: "Сигналы и CRM"
	}
];
var FORMULA_FNS = [
	{
		name: "IF",
		sample: "IF({Сотрудники} > 500, \"Enterprise\", \"SMB\")"
	},
	{
		name: "CONCAT",
		sample: "CONCAT({Компания}, \" — \", {Отрасль})"
	},
	{
		name: "SUM",
		sample: "SUM({Сотрудники}, 0)"
	},
	{
		name: "AVERAGE",
		sample: "AVERAGE({Сотрудники})"
	},
	{
		name: "ROUND",
		sample: "ROUND({Выручка, млрд}, 1)"
	},
	{
		name: "LEN",
		sample: "LEN({Компания})"
	},
	{
		name: "LOWER",
		sample: "LOWER({Email})"
	},
	{
		name: "UPPER",
		sample: "UPPER({Компания})"
	}
];
var SCORE_OPS = [
	{
		op: "gt",
		label: ">"
	},
	{
		op: "gte",
		label: "≥"
	},
	{
		op: "lt",
		label: "<"
	},
	{
		op: "eq",
		label: "="
	},
	{
		op: "neq",
		label: "≠"
	},
	{
		op: "contains",
		label: "содержит"
	},
	{
		op: "not_empty",
		label: "не пусто"
	},
	{
		op: "empty",
		label: "пусто"
	}
];
//#endregion
export { MEMBER_ROLE_META as a, SCORE_OPS as c, INTENT_META as i, SIGNAL_KIND_META as l, FORMULA_FNS as n, ONBOARDING_GOALS as o, INTEGRATION_META as r, PLAN_META as s, COLUMN_TYPE_META as t };
