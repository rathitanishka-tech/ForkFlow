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
            className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-4"
          >
            <span
              className={`mt-1 h-3 w-3 shrink-0 rounded-full ${activity.tone}`}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-neutral-950">
                  {activity.status}
                </p>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                  {activity.table}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-500">{activity.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
