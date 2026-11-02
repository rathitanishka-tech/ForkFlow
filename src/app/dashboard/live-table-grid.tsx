import { LiveTableStatus } from "@/modules/analytics/analytics.types";

const statusStyles: Record<string, string> = {
  AVAILABLE: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/25 dark:text-emerald-300 hover:bg-emerald-500/20",
  RESERVED: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:border-amber-400/25 dark:text-amber-300 hover:bg-amber-500/20",
  OCCUPIED: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:border-rose-400/25 dark:text-rose-300 hover:bg-rose-500/20",
  MAINTENANCE: "border-slate-500/25 bg-slate-500/10 text-slate-700 dark:border-slate-500/25 dark:text-slate-400 hover:bg-slate-500/20",
};

const statusDots: Record<string, string> = {
  AVAILABLE: "bg-emerald-500 dark:bg-emerald-400",
  RESERVED: "bg-amber-500 dark:bg-amber-400",
  OCCUPIED: "bg-rose-500 dark:bg-rose-400",
  MAINTENANCE: "bg-slate-500 dark:bg-slate-400",
};

const statusLabels: Record<string, string> = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
};

export function LiveTableGrid({
  tableStatuses,
}: {
  tableStatuses: LiveTableStatus[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs">
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Live Table Status</h2>
          <p className="mt-1 text-xs text-muted-foreground">{tableStatuses.length} table overview across the floor</p>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
          {Object.keys(statusLabels).map((status) => (
            <div
              key={status}
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${statusDots[status]}`}
              />
              {statusLabels[status]}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-10">
          {tableStatuses.map((table) => (
            <div
              key={table.id}
              className={`flex h-12 items-center justify-center rounded-xl border text-xs font-semibold transition-colors duration-150 ${statusStyles[table.status] ?? statusStyles.AVAILABLE}`}
            >
              T{String(table.number).padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
