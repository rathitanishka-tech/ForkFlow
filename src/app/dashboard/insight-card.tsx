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

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
}

export function InsightCard({ title, value, description }: InsightCardProps) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-neutral-500">{title}</p>
      <p className="mt-3 text-2xl font-semibold tracking-normal text-neutral-950">
        {value}
      </p>
      <p className="mt-1 text-sm text-neutral-500">{description}</p>
    </Card>
  );
}
