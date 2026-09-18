import type { Column, ColumnType } from "./types";
import { nid } from "./utils";

export function col(
  name: string,
  type: ColumnType,
  width: number,
  extra: Partial<Column> = {},
): Column {
  return { id: nid("col"), name, type, width, ...extra };
}

export const TABLE_TEMPLATES: {
  id: string;
  name: string;
  description: string;
  columns: () => Column[];
}[] = [
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
      col("ICP Score", "score", 120),
    ],
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
      col("Сегмент", "formula", 140, {
        formula: `=IF({Сотрудники} > 500, "Enterprise", "SMB")`,
      }),
      col("AI Fit", "ai", 120, {
        ai: {
          prompt:
            "Оцени компанию по шкале 1-100. Учитывай размер, отрасль, наличие отдела продаж и соответствие ICP.",
        },
      }),
    ],
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
      col("Карточка", "text", 240),
    ],
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
      col("Следующий шаг", "text", 200),
    ],
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
      col("Заметка", "text", 220),
    ],
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
      col("Готов к CRM", "boolean", 120),
    ],
  },
];
