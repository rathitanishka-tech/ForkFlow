interface InsightCardProps {
  title: string;
  value: string;
  description: string;
}

export function InsightCard({ title, value, description }: InsightCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition hover:border-primary/40">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <p className="mt-2 text-xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
