import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  href?: string;
}

export function QuickActionCard({
  icon: Icon,
  title,
  href,
}: QuickActionCardProps) {
  const content = (
    <div className="group flex min-h-[5.5rem] items-center justify-between rounded-2xl border border-border bg-card p-5 text-left shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm">
      <div className="flex items-center gap-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-[#216E46] group-hover:text-white dark:group-hover:bg-[#74A96B] dark:group-hover:text-[#101712]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-foreground">
          {title}
        </span>
      </div>
      <ArrowRight
        className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent"
        aria-hidden="true"
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} key={title} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
