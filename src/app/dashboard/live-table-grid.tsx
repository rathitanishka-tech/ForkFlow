import { LiveTableStatus } from "@/modules/analytics/analytics.types";

function Card({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section
      className={`rounded-[1.5rem] border border-border bg-card ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[#7f948b]">{subtitle}</p>}
      </div>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  AVAILABLE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/20 dark:text-emerald-300",
  RESERVED: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:border-amber-400/20 dark:text-amber-300",
  OCCUPIED: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:border-rose-400/20 dark:text-rose-300",
  MAINTENANCE: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:border-slate-500/20 dark:text-slate-400",
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
    <Card>
      <SectionHeader
        title="Live Table Status"
        subtitle={`${tableStatuses.length} table overview across the floor`}
      />
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
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-10">
          {tableStatuses.map((table) => (
            <div
              key={table.id}
              className={`flex h-14 items-center justify-center rounded-full border text-sm font-semibold ${statusStyles[table.status]}`}
            >
              T{String(table.number).padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
