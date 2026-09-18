import type { CellValue, Column, Primitive, Row } from "./types";

type Token =
  | { t: "num"; v: number }
  | { t: "str"; v: string }
  | { t: "id"; v: string }
  | { t: "ref"; v: string }
  | { t: "op"; v: string }
  | { t: "lp" }
  | { t: "rp" }
  | { t: "comma" };

function tokenize(src: string): Token[] {
  const s = src.trim().replace(/^=/, "");
  const out: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i]!;
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
      out.push({ t: "ref", v: s.slice(i + 1, j).trim() });
      i = j + 1;
      continue;
    }
    if (c === '"' || c === "'") {
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
      out.push({ t: "str", v });
      i = j + 1;
      continue;
    }
    if ("<>=!".includes(c)) {
      if ((c === "<" || c === ">" || c === "!" || c === "=") && s[i + 1] === "=") {
        out.push({ t: "op", v: c + "=" });
        i += 2;
        continue;
      }
      out.push({ t: "op", v: c === "=" ? "=" : c });
      i++;
      continue;
    }
    if ("+-*/".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      const m = s.slice(i).match(/^[0-9]+(?:\.[0-9]+)?/);
      out.push({ t: "num", v: Number(m![0]) });
      i += m![0].length;
      continue;
    }
    if (/[A-Za-zА-Яа-я_]/.test(c)) {
      const m = s.slice(i).match(/^[A-Za-zА-Яа-я_][A-Za-zА-Яа-я0-9_]*/);
      out.push({ t: "id", v: m![0] });
      i += m![0].length;
      continue;
    }
    throw new Error(`Неожиданный символ «${c}»`);
  }
  return out;
}

type Node =
  | { k: "num"; v: number }
  | { k: "str"; v: string }
  | { k: "ref"; v: string }
  | { k: "call"; name: string; args: Node[] }
  | { k: "bin"; op: string; a: Node; b: Node };

function parse(tokens: Token[]): Node {
  let i = 0;
  const peek = () => tokens[i];
  const eat = () => tokens[i++];

  function primary(): Node {
    const t = eat();
    if (!t) throw new Error("Пустое выражение");
    if (t.t === "num") return { k: "num", v: t.v };
    if (t.t === "str") return { k: "str", v: t.v };
    if (t.t === "ref") return { k: "ref", v: t.v };
    if (t.t === "id") {
      if (peek()?.t === "lp") {
        eat();
        const args: Node[] = [];
        if (peek()?.t !== "rp") {
          args.push(expr());
          while (peek()?.t === "comma") {
            eat();
            args.push(expr());
          }
        }
        if (eat()?.t !== "rp") throw new Error("Ожидалась )");
        return { k: "call", name: t.v.toUpperCase(), args };
      }
      return { k: "ref", v: t.v };
    }
    if (t.t === "lp") {
      const n = expr();
      if (eat()?.t !== "rp") throw new Error("Ожидалась )");
      return n;
    }
    throw new Error("Ожидалось значение");
  }

  function cmp(): Node {
    let left = add();
    while (peek()?.t === "op" && ["=", "!=", ">", "<", ">=", "<="].includes((peek() as { v: string }).v)) {
      const op = (eat() as { v: string }).v;
      left = { k: "bin", op, a: left, b: add() };
    }
    return left;
  }

  function add(): Node {
    let left = mul();
    while (peek()?.t === "op" && ["+", "-"].includes((peek() as { v: string }).v)) {
      const op = (eat() as { v: string }).v;
      left = { k: "bin", op, a: left, b: mul() };
    }
    return left;
  }

  function mul(): Node {
    let left = primary();
    while (peek()?.t === "op" && ["*", "/"].includes((peek() as { v: string }).v)) {
      const op = (eat() as { v: string }).v;
      left = { k: "bin", op, a: left, b: primary() };
    }
    return left;
  }

  function expr(): Node {
    return cmp();
  }

  const tree = expr();
  if (i < tokens.length) throw new Error("Лишние символы в формуле");
  return tree;
}

function toNum(v: Primitive): number {
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (v == null || v === "") return 0;
  const n = Number(String(v).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function toStr(v: Primitive): string {
  if (v == null) return "";
  return String(v);
}

function truthy(v: Primitive): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  return toStr(v).length > 0 && toStr(v) !== "false";
}

function evalNode(
  node: Node,
  resolve: (name: string) => Primitive,
): Primitive {
  switch (node.k) {
    case "num":
      return node.v;
    case "str":
      return node.v;
    case "ref":
      return resolve(node.v);
    case "bin": {
      const a = evalNode(node.a, resolve);
      const b = evalNode(node.b, resolve);
      switch (node.op) {
        case "+":
          return toNum(a) + toNum(b);
        case "-":
          return toNum(a) - toNum(b);
        case "*":
          return toNum(a) * toNum(b);
        case "/":
          return toNum(b) === 0 ? null : toNum(a) / toNum(b);
        case ">":
          return toNum(a) > toNum(b);
        case "<":
          return toNum(a) < toNum(b);
        case ">=":
          return toNum(a) >= toNum(b);
        case "<=":
          return toNum(a) <= toNum(b);
        case "=":
          return toStr(a) === toStr(b) || toNum(a) === toNum(b);
        case "!=":
          return toStr(a) !== toStr(b);
        default:
          return null;
      }
    }
    case "call": {
      const args = node.args.map((a) => evalNode(a, resolve));
      switch (node.name) {
        case "IF":
          return truthy(args[0] ?? null) ? (args[1] ?? null) : (args[2] ?? null);
        case "CONCAT":
          return args.map(toStr).join("");
        case "SUM":
          return args.reduce<number>((s, v) => s + toNum(v), 0);
        case "AVERAGE": {
          if (!args.length) return 0;
          return args.reduce<number>((s, v) => s + toNum(v), 0) / args.length;
        }
        case "ROUND": {
          const digits = args[1] != null ? toNum(args[1]) : 0;
          const p = 10 ** digits;
          return Math.round(toNum(args[0] ?? 0) * p) / p;
        }
        case "LEN":
          return toStr(args[0] ?? "").length;
        case "LOWER":
          return toStr(args[0] ?? "").toLowerCase();
        case "UPPER":
          return toStr(args[0] ?? "").toUpperCase();
        default:
          throw new Error(`Неизвестная функция ${node.name}`);
      }
    }
  }
}

export function evalFormula(
  formula: string,
  row: Row,
  columns: Column[],
): CellValue {
  try {
    const tokens = tokenize(formula);
    const tree = parse(tokens);
    const resolve = (name: string): Primitive => {
      const col =
        columns.find((c) => c.name.toLowerCase() === name.toLowerCase()) ??
        columns.find((c) => c.id === name);
      if (!col) return null;
      return row.cells[col.id]?.value ?? null;
    };
    const value = evalNode(tree, resolve);
    return {
      value,
      display: value == null ? "" : String(value),
      status: "success",
    };
  } catch (e) {
    return {
      value: null,
      status: "error",
      error: e instanceof Error ? e.message : "Ошибка формулы",
    };
  }
}

export function recalcRow(row: Row, columns: Column[]): Row {
  const next: Row = { ...row, cells: { ...row.cells } };
  for (const col of columns) {
    if (col.type === "formula" && col.formula) {
      next.cells[col.id] = evalFormula(col.formula, next, columns);
    }
    if (col.type === "score" && col.score) {
      let total = 0;
      for (const rule of col.score.rules) {
        const v = next.cells[rule.columnId]?.value ?? null;
        if (matchScore(v, rule.op, rule.value)) total += rule.points;
      }
      next.cells[col.id] = {
        value: total,
        display: String(total),
        status: "success",
      };
    }
  }
  return next;
}

function matchScore(
  v: Primitive,
  op: ScoreRuleOp,
  rhs: Primitive | undefined,
): boolean {
  switch (op) {
    case "gt":
      return toNum(v) > toNum(rhs ?? 0);
    case "gte":
      return toNum(v) >= toNum(rhs ?? 0);
    case "lt":
      return toNum(v) < toNum(rhs ?? 0);
    case "eq":
      return toStr(v) === toStr(rhs ?? "");
    case "neq":
      return toStr(v) !== toStr(rhs ?? "");
    case "contains":
      return toStr(v).toLowerCase().includes(toStr(rhs ?? "").toLowerCase());
    case "not_empty":
      return v != null && toStr(v) !== "";
    case "empty":
      return v == null || toStr(v) === "";
  }
}

type ScoreRuleOp =
  | "gt"
  | "gte"
  | "lt"
  | "eq"
  | "neq"
  | "contains"
  | "not_empty"
  | "empty";
