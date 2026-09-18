import { createFileRoute, Link } from "@tanstack/react-router";
import { TableWorkspace } from "@/components/table/table-workspace";
import { Skeleton } from "@/components/ui/skeleton";
import { useTable, useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/app/tables/$tableId")({
  component: TablePage,
});

function TablePage() {
  const { tableId } = Route.useParams();
  const loading = useWorkspace((s) => s.loading);
  const table = useTable(tableId);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-64" />
      </div>
    );
  }
  if (!table) {
    return (
      <div className="grid h-full place-items-center p-6 text-sm text-muted-foreground">
        Таблица не найдена.{" "}
        <Link to="/app/tables" className="ml-1 text-foreground underline">
          К списку
        </Link>
      </div>
    );
  }
  return <TableWorkspace table={table} />;
}
