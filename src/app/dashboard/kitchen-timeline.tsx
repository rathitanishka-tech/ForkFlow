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

interface KitchenActivity {
  status: string;
  table: string;
  detail: string;
  tone: string;
}

export function KitchenTimeline({
  kitchenActivity,
}: {
  kitchenActivity: KitchenActivity[];
}) {
  return (
    <Card>
      <SectionHeader
        title="Kitchen Activity"
        subtitle="Live operational movement by order stage"
      />
      <div className="grid gap-4 p-5 md:grid-cols-2">
        {kitchenActivity.map((activity) => (
          <div
            key={activity.status}
            className="flex gap-4 rounded-[1.2rem] border border-[#29443C] bg-[#16342D] p-4"
          >
            <span
              className={`mt-1 h-3 w-3 shrink-0 rounded-full ${activity.tone}`}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-[#f8f5ef]">
                  {activity.status}
                </p>
                <span className="rounded-full bg-[#081E19] px-2 py-0.5 text-xs font-medium text-[#8ea79d]">
                  {activity.table}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#7f948b]">{activity.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
