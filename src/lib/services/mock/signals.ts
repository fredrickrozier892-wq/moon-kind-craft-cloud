import type { Signal, SignalKind } from "@/lib/types";
import { nid } from "@/lib/utils";

const KIND_TITLES: Record<SignalKind, (c: string) => { title: string; detail: string }> = {
  job: (c) => ({
    title: `Новая вакансия: Sales Manager`,
    detail: `${c} ищет руководителя отдела продаж. Сигнал к заходу в закупку.`,
  }),
  executive: (c) => ({
    title: "Смена коммерческого директора",
    detail: `В ${c} назначен новый CCO — окно для первого касания.`,
  }),
  company_change: (c) => ({
    title: "Изменён юридический адрес",
    detail: `${c} обновила карточку в ЕГРЮЛ.`,
  }),
  registration: (c) => ({
    title: "Новое юрлицо в группе",
    detail: `Зарегистрирована дочерняя компания ${c}.`,
  }),
  okved: (c) => ({
    title: "Добавлен ОКВЭД 62.01",
    detail: `${c} расширила виды деятельности — разработка ПО.`,
  }),
  tender: (c) => ({
    title: "Новый тендер на CRM",
    detail: `${c} разместила закупку внедрения CRM, срок 21 день.`,
  }),
  mention: (c) => ({
    title: "Упоминание в СМИ",
    detail: `${c} анонсировала расширение B2B-направления.`,
  }),
};

export function makeSignal(
  company: string,
  kind: SignalKind,
  hoursAgo: number,
  tableId?: string,
  rowId?: string,
): Signal {
  const { title, detail } = KIND_TITLES[kind](company);
  return {
    id: nid("sig"),
    kind,
    company,
    title,
    detail,
    tableId,
    rowId,
    createdAt: new Date(Date.now() - hoursAgo * 3600_000).toISOString(),
    read: hoursAgo > 18,
  };
}
