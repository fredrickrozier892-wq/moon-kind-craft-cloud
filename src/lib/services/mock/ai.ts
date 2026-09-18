import type { Primitive, Row, Column } from "@/lib/types";
import { hash32 } from "@/lib/utils";

function cell(row: Row, columns: Column[], name: string): Primitive {
  const col = columns.find(
    (c) => c.name.toLowerCase() === name.toLowerCase() || c.id === name,
  );
  return col ? (row.cells[col.id]?.value ?? null) : null;
}

export function interpolatePrompt(
  prompt: string,
  row: Row,
  columns: Column[],
): string {
  return prompt.replace(/\{\{?([^}]+)\}?\}/g, (_, raw: string) => {
    const key = String(raw).trim();
    const v = cell(row, columns, key);
    return v == null ? "" : String(v);
  });
}

export function mockAiComplete(prompt: string, row: Row, columns: Column[]): {
  value: Primitive;
  display: string;
  explanation: string;
} {
  const filled = interpolatePrompt(prompt, row, columns);
  const company = String(cell(row, columns, "Компания") ?? "");
  const employees = Number(cell(row, columns, "Сотрудники") ?? 0);
  const industry = String(cell(row, columns, "Отрасль") ?? "");
  const email = String(cell(row, columns, "Email") ?? "");
  const website = String(cell(row, columns, "Сайт") ?? "");

  const wantsScore = /шкал|оцен|score|1-100|1–100|подход/i.test(prompt);
  if (wantsScore) {
    let score = 40;
    if (employees > 500) score += 20;
    else if (employees > 100) score += 12;
    if (/saas|интернет|финтех|hr tech|кибер/i.test(industry)) score += 22;
    if (email) score += 8;
    if (website) score += 6;
    score = Math.min(98, score + (hash32(company) % 7));
    const explanation = [
      employees > 500 ? "крупный штат" : "средний размер",
      industry || "отрасль не указана",
      email ? "есть email" : "нет email",
    ].join(", ");
    return {
      value: score,
      display: String(score),
      explanation: `${company || "Компания"}: ${explanation}.`,
    };
  }

  const snippet = filled.slice(0, 180).replace(/\s+/g, " ").trim();
  const display = company
    ? `${company}: ${snippet || "недостаточно данных для вывода"}`
    : snippet || "Недостаточно данных в строке";
  return { value: display, display, explanation: display };
}

export function mockAgentRun(goal: string, tasks: string[], company: string): string {
  const findings = {
    website: `https://${company.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "")}.ru`,
    industry: "B2B / технологии",
    size: "500–5 000",
    icp: 78,
    note: "Есть отдел продаж, закупки централизованы.",
  };
  return JSON.stringify(
    {
      goal,
      company,
      tasks,
      result: findings,
    },
    null,
    2,
  );
}
