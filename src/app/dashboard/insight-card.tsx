function Card({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section
      className={`rounded-[1.25rem] border border-border bg-card ${className}`}
    >
      {children}
    </section>
  );
}

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
}

export function InsightCard({ title, value, description }: InsightCardProps) {
  return (
    <Card className="p-5 shadow-[0_15px_40px_rgba(2,8,23,0.2)]">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-3 text-2xl font-semibold tracking-normal text-foreground">
        {value}
      </p>
      <p className="mt-1 text-sm text-[#7f948b]">{description}</p>
    </Card>
  );
}
