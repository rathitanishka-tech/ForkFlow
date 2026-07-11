import * as React from "react";
import { Flame, Leaf, Beef, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type SpiceLevel = "NONE" | "MILD" | "MEDIUM" | "HOT";
export type DietaryType = "VEG" | "NON_VEG";
export type Availability = "AVAILABLE" | "UNAVAILABLE";

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  dietaryType: DietaryType;
  spiceLevel: SpiceLevel;
  category: string;
  isAvailable: boolean;
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
    color: "text-slate-400",
  },
  MILD: {
    icon: <Flame className="h-4 w-4" />,
    label: "Mild",
    color: "text-green-400",
  },
  MEDIUM: {
    icon: (
      <>
        <Flame className="h-4 w-4" />
        <Flame className="h-4 w-4" />
      </>
    ),
    label: "Medium",
    color: "text-yellow-400",
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
    color: "text-red-500",
  },
};

const DietaryBadge = ({ type }: { type: DietaryType }) => (
  <div
    className={cn(
      "flex h-6 w-6 items-center justify-center rounded-md border",
      type === "VEG"
        ? "border-green-700 bg-green-900/50"
        : "border-red-700 bg-red-900/50",
    )}
  >
    {type === "VEG" ? (
      <Leaf className="h-4 w-4 text-green-400" />
    ) : (
      <Beef className="h-4 w-4 text-red-400" />
    )}
  </div>
);

const SpiceLevelBadge = ({ level }: { level: SpiceLevel }) => {
  if (level === "NONE") return null;
  const { icon, label, color } = spiceLevelStyles[level];
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full bg-slate-800/50 px-2 py-1 text-xs font-medium",
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
        ? "bg-green-500/20 text-green-300"
        : "bg-slate-700/50 text-slate-400",
    )}
  >
    {availability === "AVAILABLE" ? "Available" : "Unavailable"}
  </div>
);

export function MenuCard({ menuItem, onAdd }: MenuCardProps) {
  const isAvailable = menuItem.isAvailable;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10",
        !isAvailable && "opacity-60",
      )}
    >
      <div className="relative h-48 w-full sm:h-56">
        <img
          src={menuItem.imageUrl}
          alt={menuItem.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <AvailabilityBadge
          availability={menuItem.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
        />
      </div>

      <div className="flex flex-1 flex-col p-4 pt-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-white">{menuItem.name}</h3>
          <div className="flex flex-shrink-0 items-center gap-2">
            <DietaryBadge type={menuItem.dietaryType} />
            <SpiceLevelBadge level={menuItem.spiceLevel} />
          </div>
        </div>

        <p className="mt-2 flex-grow text-sm text-slate-400 line-clamp-2">
          {menuItem.description}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <p className="text-xl font-extrabold text-white">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(menuItem.price)}
          </p>
          <button
            onClick={() => onAdd(menuItem)}
            disabled={!isAvailable}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-white transition-colors duration-200",
              "hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900",
              "disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500",
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
