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
    <div className="rounded-2xl border border-border bg-card shadow-xs">
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Kitchen Activity</h2>
          <p className="mt-1 text-xs text-muted-foreground">Live operational movement by order stage</p>
        </div>
      </div>
      <div className="grid gap-3.5 p-5 md:grid-cols-3">
        {kitchenActivity.map((activity) => (
          <div
            key={activity.status}
            className="flex gap-3.5 rounded-xl border border-border bg-muted/60 p-4 transition hover:border-primary/40"
          >
            <span
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${activity.tone}`}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {activity.status}
                </p>
                <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {activity.table}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{activity.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
