function Card({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section
      className={`rounded-[1.5rem] border border-[#29443C] bg-[#10231E] ${className}`}
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
    <div className="flex items-start justify-between gap-4 border-b border-[#29443C] px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-[#f8f5ef]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[#7f948b]">{subtitle}</p>}
      </div>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  Available: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  Reserved: "border-amber-400/20 bg-amber-500/10 text-amber-300",
  Occupied: "border-rose-400/20 bg-rose-500/10 text-rose-300",
  Maintenance: "border-slate-500/20 bg-slate-500/10 text-slate-400",
};

const statusDots: Record<string, string> = {
  Available: "bg-emerald-400",
  Reserved: "bg-amber-400",
  Occupied: "bg-rose-400",
  Maintenance: "bg-slate-400",
};

export function LiveTableGrid({ tableStatuses }: { tableStatuses: string[] }) {
  return (
    <Card>
      <SectionHeader
        title="Live Table Status"
        subtitle="30 table overview across the floor"
      />
      <div className="p-5">
        <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
          {Object.keys(statusDots).map((status) => (
            <div
              key={status}
              className="flex items-center gap-2 text-xs font-medium text-slate-400"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${statusDots[status]}`}
              />
              {status}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-10">
          {tableStatuses.map((status, index) => (
            <div
              key={`${status}-${index}`}
              className={`flex h-14 items-center justify-center rounded-full border text-sm font-semibold ${statusStyles[status]}`}
            >
              T{String(index + 1).padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
