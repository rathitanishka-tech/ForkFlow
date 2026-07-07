function Card({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section
      className={`rounded-xl border border-neutral-200 bg-white shadow-sm ${className}`}
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
    <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-neutral-950">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  Available: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Reserved: "border-amber-200 bg-amber-50 text-amber-700",
  Occupied: "border-red-200 bg-red-50 text-red-700",
  Maintenance: "border-neutral-200 bg-neutral-100 text-neutral-600",
};

const statusDots: Record<string, string> = {
  Available: "bg-emerald-500",
  Reserved: "bg-amber-500",
  Occupied: "bg-red-500",
  Maintenance: "bg-neutral-400",
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
              className="flex items-center gap-2 text-xs font-medium text-neutral-600"
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
