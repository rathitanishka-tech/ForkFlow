import * as React from "react";
import { Flame, Leaf, Beef, Plus, UtensilsCrossed } from "lucide-react";
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
  { icon: React.ReactNode; label: string; color: string }
> = {
  NONE: {
    icon: null,
    label: "Not Spicy",
    color: "text-slate-500",
  },
  MILD: {
    icon: <Flame className="h-4 w-4" />,
    label: "Mild",
    color: "text-green-600",
  },
  MEDIUM: {
    icon: (
      <>
        <Flame className="h-4 w-4" />
        <Flame className="h-4 w-4" />
      </>
    ),
    label: "Medium",
    color: "text-yellow-600",
  },
  HOT: {
    icon: (
      <>
        <Flame className="h-4 w-4" />
        <Flame className="h-4 w-4" />
        <Flame className="h-4 w-4" />
      </>
    ),
    label: "Hot",
    color: "text-red-600",
  },
  VERY_HOT: {
    icon: (
      <>
        <Flame className="h-4 w-4" />
        <Flame className="h-4 w-4" />
        <Flame className="h-4 w-4" />
      </>
    ),
    label: "Very Hot",
    color: "text-red-700",
  },
};

const DietaryBadge = ({ type }: { type: DietaryType }) => (
  <div
    className={cn(
      "flex h-6 w-6 items-center justify-center rounded-md border",
      type === "VEG"
        ? "border-green-600 bg-green-50"
        : "border-red-600 bg-red-50",
    )}
  >
    {type === "VEG" ? (
      <Leaf className="h-4 w-4 text-green-600" />
    ) : (
      <Beef className="h-4 w-4 text-red-600" />
    )}
  </div>
);

const SpiceLevelBadge = ({ level }: { level: SpiceLevel }) => {
  if (level === "NONE") return null;
  const { icon, label, color } = spiceLevelStyles[level];
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium",
        color,
      )}
      title={label}
    >
      {icon}
    </div>
  );
};

const AvailabilityBadge = ({
  availability,
}: {
  availability: Availability;
}) => (
  <div
    className={cn(
      "absolute right-3 top-3 select-none rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
      availability === "AVAILABLE"
        ? "bg-green-100 text-green-800"
        : "bg-slate-200 text-slate-600",
    )}
  >
    {availability === "AVAILABLE" ? "Available" : "Unavailable"}
  </div>
);

export function MenuCard({ menuItem, onAdd }: MenuCardProps) {
  const isAvailable = menuItem.isAvailable;
  const dietaryType: DietaryType = menuItem.isVeg ? "VEG" : "NON_VEG";

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg",
        !isAvailable && "grayscale",
      )}
    >
      <div className="relative h-48 w-full sm:h-56">
        {menuItem.imageUrl ? (
          <img
            src={menuItem.imageUrl}
            alt={menuItem.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <UtensilsCrossed className="h-12 w-12 text-slate-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <AvailabilityBadge
          availability={menuItem.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 pt-2">
        <div className="flex items-start justify-between gap-4 pt-2">
          <h3 className="text-lg font-bold text-slate-800">{menuItem.name}</h3>
          <div className="flex shrink-0 items-center gap-2">
            <DietaryBadge type={dietaryType} />
            <SpiceLevelBadge level={menuItem.spiceLevel} />
          </div>
        </div>

        <p className="mt-2 grow text-sm text-slate-500 line-clamp-2">
          {menuItem.description}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <p className="text-xl font-extrabold text-slate-900">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(menuItem.price)}
          </p>
          <button
            onClick={() => onAdd(menuItem)}
            disabled={!isAvailable}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-[#0f5b4c] text-white transition-colors duration-200",
              "hover:bg-[#0b4a3d] focus:outline-none focus:ring-2 focus:ring-[#0f5b4c] focus:ring-offset-2 focus:ring-offset-white",
              "disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400",
            )}
            aria-label={`Add ${menuItem.name} to cart`}
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
