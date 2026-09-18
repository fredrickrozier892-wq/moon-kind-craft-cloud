import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { WorkspaceDoc } from "@/lib/types";

export const loadWorkspace = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<{ data: WorkspaceDoc }>(
      "select data from workspaces where user_id = $1",
      [context.userId],
    );
    const data = rows[0]?.data;
    if (!data || typeof data !== "object" || !("tables" in data)) return null;
    return data;
  });

export const saveWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { workspace: WorkspaceDoc }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const payload = JSON.stringify(data.workspace);
    await sql.query(
      `insert into workspaces (user_id, data, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (user_id) do update set data = excluded.data, updated_at = now()`,
      [context.userId, payload],
    );
    return { ok: true as const };
  });
