import * as React from "react";
import { Flame, Plus, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

export type SpiceLevel = "NONE" | "MILD" | "MEDIUM" | "HOT" | "VERY_HOT";
export type DietaryType = "VEG" | "NON_VEG";
export type Availability = "AVAILABLE" | "UNAVAILABLE";

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  spiceLevel: SpiceLevel;
  category: string;
  isAvailable: boolean;
  isVeg: boolean;
}

interface MenuCardProps {
  menuItem: MenuItemData;
  onAdd: (menuItem: MenuItemData) => void;
}

const spiceLevelStyles: Record<
  SpiceLevel,
  { count: number; label: string }
> = {
  NONE: { count: 0, label: "Not Spicy" },
  MILD: { count: 1, label: "Mild Spice" },
  MEDIUM: { count: 2, label: "Medium Spice" },
  HOT: { count: 3, label: "Hot & Spicy" },
  VERY_HOT: { count: 4, label: "Extra Hot" },
};

const DietaryBadge = ({ type }: { type: DietaryType }) => (
  <div
    className={cn(
      "flex h-4 w-4 items-center justify-center rounded-xs border",
      type === "VEG"
        ? "border-[#216E46] dark:border-[#74A96B]"
        : "border-[#E5483F]",
    )}
    title={type === "VEG" ? "Pure Vegetarian" : "Non-Vegetarian"}
  >
    <div
      className={cn(
        "h-2 w-2 rounded-full",
        type === "VEG"
          ? "bg-[#216E46] dark:bg-[#74A96B]"
          : "bg-[#E5483F]",
      )}
    />
  </div>
);

const SpiceLevelBadge = ({ level }: { level: SpiceLevel }) => {
  const config = spiceLevelStyles[level];
  if (!config || config.count === 0) return null;

  return (
    <div
      className="flex items-center gap-0.5 text-[#E5483F]"
      title={config.label}
    >
      {Array.from({ length: config.count }).map((_, i) => (
        <Flame key={i} className="h-3 w-3 fill-current" />
      ))}
    </div>
  );
};

export function MenuCard({ menuItem, onAdd }: MenuCardProps) {
  const isAvailable = menuItem.isAvailable;
  const dietaryType: DietaryType = menuItem.isVeg ? "VEG" : "NON_VEG";

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-xs",
        !isAvailable && "opacity-60 grayscale",
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
        {menuItem.imageUrl ? (
          <img
            src={menuItem.imageUrl}
            alt={menuItem.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <UtensilsCrossed className="h-7 w-7" />
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <span className="rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info & Action */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-foreground leading-snug">
              {menuItem.name}
            </h3>
            <span className="shrink-0 text-base font-bold text-foreground">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(menuItem.price)}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <DietaryBadge type={dietaryType} />
            <SpiceLevelBadge level={menuItem.spiceLevel} />
          </div>

          {menuItem.description && (
            <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {menuItem.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={() => onAdd(menuItem)}
            disabled={!isAvailable}
            className={cn(
              "flex items-center gap-1.5 rounded-xl bg-[#216E46] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1b5838] active:scale-95 dark:bg-[#74A96B] dark:text-[#101712] cursor-pointer",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#216E46]",
            )}
            aria-label={`Add ${menuItem.name} to order`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
