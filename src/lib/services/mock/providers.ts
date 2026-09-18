import type { EnrichmentIntent, Primitive } from "@/lib/types";
import { hash32 } from "@/lib/utils";

export type ProviderResult = {
  ok: boolean;
  value: Primitive;
  display?: string;
  provider: string;
  cost: number;
  error?: string;
};

export type EnrichmentRequest = {
  intent: EnrichmentIntent;
  query: string;
  company?: string;
  inn?: string;
};

export interface EnrichmentProvider {
  id: string;
  name: string;
  hint: string;
  cost: number;
  intents: EnrichmentIntent[];
  lookup(req: EnrichmentRequest): Promise<ProviderResult>;
}

type CompanyRecord = {
  name: string;
  inn: string;
  website: string;
  email: string;
  phone: string;
  industry: string;
  employees: number;
  revenue: number;
  person: string;
  city: string;
};

const REGISTRY: CompanyRecord[] = [
  {
    name: "Яндекс",
    inn: "7736207543",
    website: "https://yandex.ru",
    email: "partners@yandex-team.ru",
    phone: "+7 495 739-70-00",
    industry: "Интернет / SaaS",
    employees: 21000,
    revenue: 892,
    person: "Артём Савиновский",
    city: "Москва",
  },
  {
    name: "VK",
    inn: "7743001840",
    website: "https://vk.company",
    email: "b2b@vk.team",
    phone: "+7 495 725-63-57",
    industry: "Интернет / Медиа",
    employees: 14000,
    revenue: 144,
    person: "Владимир Кириенко",
    city: "Москва",
  },
  {
    name: "X5 Group",
    inn: "7707030411",
    website: "https://www.x5.ru",
    email: "partners@x5.ru",
    phone: "+7 495 662-88-88",
    industry: "Ритейл",
    employees: 361000,
    revenue: 3147,
    person: "Игорь Шехтерман",
    city: "Москва",
  },
  {
    name: "Сбер",
    inn: "7707083893",
    website: "https://www.sberbank.ru",
    email: "corp@sberbank.ru",
    phone: "+7 495 500-55-50",
    industry: "Банк / Финтех",
    employees: 284000,
    revenue: 3380,
    person: "Герман Греф",
    city: "Москва",
  },
  {
    name: "Т-Банк",
    inn: "7710140679",
    website: "https://www.tbank.ru",
    email: "corp@tbank.ru",
    phone: "+7 495 648-98-00",
    industry: "Банк / Финтех",
    employees: 58000,
    revenue: 787,
    person: "Станислав Близнюк",
    city: "Москва",
  },
  {
    name: "Ozon",
    inn: "7712263726",
    website: "https://www.ozon.ru",
    email: "partners@ozon.ru",
    phone: "+7 495 232-10-00",
    industry: "E-commerce",
    employees: 51000,
    revenue: 617,
    person: "Геворг Саркисян",
    city: "Москва",
  },
  {
    name: "Wildberries",
    inn: "7721546864",
    website: "https://www.wildberries.ru",
    email: "corp@wildberries.ru",
    phone: "+7 495 363-06-36",
    industry: "E-commerce",
    employees: 120000,
    revenue: 2376,
    person: "Владислав Бакальчук",
    city: "Москва",
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
    city: "Москва",
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
    city: "Москва",
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
    city: "Новосибирск",
  },
  {
    name: "МТС",
    inn: "7740000076",
    website: "https://mts.ru",
    email: "b2b@mts.ru",
    phone: "+7 495 766-01-66",
    industry: "Телеком",
    employees: 62000,
    revenue: 606,
    person: "Вячеслав Николаев",
    city: "Москва",
  },
  {
    name: "МегаФон",
    inn: "7812014560",
    website: "https://megafon.ru",
    email: "b2b@megafon.ru",
    phone: "+7 800 550-05-00",
    industry: "Телеком",
    employees: 42000,
    revenue: 432,
    person: "Хачатур Помбухчан",
    city: "Москва",
  },
  {
    name: "Ростелеком",
    inn: "7707049388",
    website: "https://www.company.rt.ru",
    email: "b2b@rt.ru",
    phone: "+7 800 100-08-00",
    industry: "Телеком",
    employees: 126000,
    revenue: 702,
    person: "Михаил Осеевский",
    city: "Москва",
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
    city: "Москва",
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
    city: "Москва",
  },
  {
    name: "СКБ Контур",
    inn: "6663003127",
    website: "https://kontur.ru",
    email: "sales@skbkontur.ru",
    phone: "+7 343 365-81-81",
    industry: "SaaS / Бухгалтерия",
    employees: 9000,
    revenue: 34,
    person: "Дмитрий Машков",
    city: "Екатеринбург",
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
    city: "Москва",
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
    city: "Москва",
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
    city: "Москва",
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
    city: "Москва",
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
    city: "Москва",
  },
  {
    name: "Самокат",
    inn: "7802829993",
    website: "https://samokat.ru",
    email: "partners@samokat.ru",
    phone: "+7 812 449-07-00",
    industry: "Quick commerce",
    employees: 18000,
    revenue: 96,
    person: "Антон Виноградов",
    city: "Санкт-Петербург",
  },
  {
    name: "Лента",
    inn: "7814148471",
    website: "https://lenta.com",
    email: "partners@lenta.com",
    phone: "+7 812 336-44-44",
    industry: "Ритейл",
    employees: 54000,
    revenue: 612,
    person: "Владимир Сорокин",
    city: "Санкт-Петербург",
  },
  {
    name: "Магнит",
    inn: "2309085638",
    website: "https://magnit.ru",
    email: "partners@magnit.ru",
    phone: "+7 861 210-98-10",
    industry: "Ритейл",
    employees: 360000,
    revenue: 2697,
    person: "Надежда Псарева",
    city: "Краснодар",
  },
];

function norm(s: string): string {
  return s.toLowerCase().replace(/["«»]/g, "").replace(/\s+/g, " ").trim();
}

function findRecord(req: EnrichmentRequest): CompanyRecord | undefined {
  const q = norm(req.query || req.company || req.inn || "");
  if (!q) return undefined;
  return REGISTRY.find(
    (r) =>
      norm(r.name) === q ||
      r.inn === q ||
      q.includes(norm(r.name)) ||
      norm(r.name).includes(q) ||
      (req.inn && r.inn === req.inn),
  );
}

function pickValue(rec: CompanyRecord, intent: EnrichmentIntent): Primitive {
  switch (intent) {
    case "email":
      return rec.email;
    case "phone":
      return rec.phone;
    case "website":
      return rec.website;
    case "company":
      return `${rec.inn} · ${rec.city} · ${rec.industry}`;
    case "person":
      return rec.person;
    case "revenue":
      return rec.revenue;
    case "employees":
      return rec.employees;
    case "custom":
      return `${rec.industry}, ${rec.city}, штат ${rec.employees}`;
  }
}

function delayFor(id: string): number {
  return 280 + (hash32(id) % 420);
}

function hitRate(providerId: string, query: string): boolean {
  const rate =
    providerId === "dadata" ? 0.9 : providerId === "spark" ? 0.72 : 0.64;
  return (hash32(providerId + query) % 100) / 100 < rate;
}

function makeProvider(
  id: string,
  name: string,
  hint: string,
  cost: number,
  intents: EnrichmentIntent[],
): EnrichmentProvider {
  return {
    id,
    name,
    hint,
    cost,
    intents,
    async lookup(req) {
      await new Promise((r) => setTimeout(r, delayFor(id + req.query)));
      if (id === "kontur" && hash32(req.query) % 17 === 0) {
        return {
          ok: false,
          value: null,
          provider: name,
          cost: 0,
          error: "Провайдер временно недоступен",
        };
      }
      const rec = findRecord(req);
      if (!rec || !hitRate(id, req.query + req.intent)) {
        return { ok: false, value: null, provider: name, cost, error: "Не найдено" };
      }
      const value = pickValue(rec, req.intent);
      return {
        ok: true,
        value,
        display: String(value),
        provider: name,
        cost,
      };
    },
  };
}

export const PROVIDERS: EnrichmentProvider[] = [
  makeProvider(
    "dadata",
    "DaData",
    "ИНН, адрес, реквизиты ФНС",
    1,
    ["company", "website", "phone", "email", "employees"],
  ),
  makeProvider(
    "spark",
    "СПАРК",
    "Карточка юрлица и финансы",
    2,
    ["company", "revenue", "employees", "person"],
  ),
  makeProvider(
    "kontur",
    "Контур.Фокус",
    "Связи, проверки, выручка",
    3,
    ["company", "revenue", "person", "custom"],
  ),
  makeProvider(
    "hh",
    "HeadHunter",
    "Вакансии и численность",
    2,
    ["employees", "person", "custom"],
  ),
];

export function providersFor(intent: EnrichmentIntent): EnrichmentProvider[] {
  return PROVIDERS.filter((p) => p.intents.includes(intent));
}

export async function runWaterfall(
  providerIds: string[],
  req: EnrichmentRequest,
): Promise<ProviderResult & { tried: string[] }> {
  const tried: string[] = [];
  for (const id of providerIds) {
    const p = PROVIDERS.find((x) => x.id === id);
    if (!p) continue;
    tried.push(p.name);
    const res = await p.lookup(req);
    if (res.ok) return { ...res, tried };
  }
  return {
    ok: false,
    value: null,
    provider: tried[tried.length - 1] ?? "—",
    cost: 0,
    error: "Ни один провайдер не нашёл данные",
    tried,
  };
}

export function lookupSeed(name: string): CompanyRecord | undefined {
  return findRecord({ intent: "company", query: name });
}

export { REGISTRY };
