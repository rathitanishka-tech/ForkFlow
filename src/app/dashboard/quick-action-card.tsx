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
    <div className="group flex min-h-24 items-center justify-between rounded-[1.3rem] border border-border bg-card p-5 text-left shadow-[0_15px_35px_rgba(3,15,11,0.24)] transition duration-200 hover:-translate-y-0.5 hover:border-[#0f5b4c]/40">
      <span>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="mt-4 block text-sm font-semibold text-foreground">
          {title}
        </span>
      </span>
      <ArrowRight
        className="h-4 w-4 text-[#7f948b] transition group-hover:translate-x-0.5 group-hover:text-accent"
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
