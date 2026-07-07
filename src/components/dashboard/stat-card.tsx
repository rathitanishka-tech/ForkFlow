import type { LucideIcon } from "lucide-react";

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

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-normal text-neutral-950">
            {value}
          </p>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}
