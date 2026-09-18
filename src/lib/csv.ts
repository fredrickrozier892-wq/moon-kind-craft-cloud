export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else quoted = false;
      } else cur += c;
      continue;
    }
    if (c === '"') {
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

export function toCsv(headers: string[], lines: string[][]): string {
  const esc = (v: string) => {
    if (/[",\n]/.test(v)) return `"${v.replaceAll('"', '""')}"`;
    return v;
  };
  return [headers, ...lines].map((r) => r.map(esc).join(",")).join("\n");
}
