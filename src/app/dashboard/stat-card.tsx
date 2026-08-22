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
      className={`rounded-[1.25rem] border border-border bg-card ${className}`}
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
    <Card className="p-5 shadow-[0_15px_40px_rgba(2,8,23,0.25)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-normal text-foreground">
            {value}
          </p>
          <p className="mt-1 text-sm text-[#7f948b]">{subtitle}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}
