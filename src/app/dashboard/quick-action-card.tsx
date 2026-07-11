import { ArrowRight, type LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
}

export function QuickActionCard({ icon: Icon, title }: QuickActionCardProps) {
  return (
    <button
      key={title}
      className="group flex min-h-24 items-center justify-between rounded-xl border border-neutral-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
    >
      <span>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="mt-4 block text-sm font-semibold text-neutral-950">
          {title}
        </span>
      </span>
      <ArrowRight
        className="h-4 w-4 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-neutral-700"
        aria-hidden="true"
      />
    </button>
  );
}
