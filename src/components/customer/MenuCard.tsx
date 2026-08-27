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
  { icon: React.ReactNode; label: string; color: string }
> = {
  NONE: {
    icon: null,
    label: "Not Spicy",
    color: "text-[#5C544F]",
  },
  MILD: {
    icon: <Flame className="h-3 w-3" />,
    label: "Mild",
    color: "text-[#8B2E2E]",
  },
  MEDIUM: {
    icon: (
      <>
        <Flame className="h-3 w-3" />
        <Flame className="h-3 w-3" />
      </>
    ),
    label: "Medium",
    color: "text-[#8B2E2E]",
  },
  HOT: {
    icon: (
      <>
        <Flame className="h-3 w-3" />
        <Flame className="h-3 w-3" />
        <Flame className="h-3 w-3" />
      </>
    ),
    label: "Hot",
    color: "text-[#8B2E2E]",
  },
  VERY_HOT: {
    icon: (
      <>
        <Flame className="h-3 w-3" />
        <Flame className="h-3 w-3" />
        <Flame className="h-3 w-3" />
        <Flame className="h-3 w-3" />
      </>
    ),
    label: "Very Hot",
    color: "text-[#8B2E2E]",
  },
};

const DietaryBadge = ({ type }: { type: DietaryType }) => (
  <div
    className={cn(
      "flex h-4 w-4 items-center justify-center rounded-sm border",
      type === "VEG"
        ? "border-[#5C544F] bg-transparent"
        : "border-[#8B2E2E] bg-transparent",
    )}
  >
    {type === "VEG" ? (
      <div className="h-2 w-2 rounded-full bg-[#5C544F]" />
    ) : (
      <div className="h-2 w-2 rounded-full bg-[#8B2E2E]" />
    )}
  </div>
);

const SpiceLevelBadge = ({ level }: { level: SpiceLevel }) => {
  if (level === "NONE") return null;
  const { icon, label, color } = spiceLevelStyles[level];
  return (
    <div
      className={cn("flex items-center gap-0.5", color)}
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
}) => {
  if (availability === "AVAILABLE") return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F5]/60 backdrop-blur-[1px]">
      <span className="border border-[#2A2421] bg-[#FAF8F5] px-3 py-1 font-sans text-xs font-semibold tracking-widest text-[#2A2421] uppercase">
        Sold Out
      </span>
    </div>
  );
};

export function MenuCard({ menuItem, onAdd }: MenuCardProps) {
  const isAvailable = menuItem.isAvailable;
  const dietaryType: DietaryType = menuItem.isVeg ? "VEG" : "NON_VEG";

  return (
    <div
      className={cn(
        "group relative flex flex-row items-start gap-5 py-6 border-b border-[#E3DCD2] transition-opacity duration-300",
        !isAvailable && "opacity-75 grayscale",
      )}
    >
      <div className="relative shrink-0 overflow-hidden rounded-sm border border-[#E3DCD2] h-24 w-24 sm:h-32 sm:w-32 shadow-sm">
        {menuItem.imageUrl ? (
          <img
            src={menuItem.imageUrl}
            alt={menuItem.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F2EFE9]">
            <UtensilsCrossed className="h-8 w-8 text-[#E3DCD2]" />
          </div>
        )}
        <AvailabilityBadge
          availability={menuItem.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
        />
      </div>

      <div className="flex flex-1 flex-col justify-between h-full min-h-[6rem] sm:min-h-[8rem]">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-heading text-xl font-bold text-[#2A2421] leading-tight sm:text-2xl">
              {menuItem.name}
            </h3>
            <p className="shrink-0 font-sans text-lg font-medium text-[#2A2421]">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(menuItem.price)}
            </p>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <DietaryBadge type={dietaryType} />
            <SpiceLevelBadge level={menuItem.spiceLevel} />
          </div>

          <p className="mt-2 text-sm text-[#5C544F] font-sans line-clamp-2 leading-relaxed">
            {menuItem.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={() => onAdd(menuItem)}
            disabled={!isAvailable}
            className={cn(
              "flex items-center gap-1.5 rounded-none border border-[#2A2421] bg-transparent px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-[#2A2421] transition-colors duration-300",
              "hover:bg-[#2A2421] hover:text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#2A2421] focus:ring-offset-1 focus:ring-offset-[#FAF8F5]",
              "disabled:cursor-not-allowed disabled:border-[#E3DCD2] disabled:text-[#E3DCD2] disabled:hover:bg-transparent disabled:hover:text-[#E3DCD2]",
            )}
            aria-label={`Add ${menuItem.name} to order`}
          >
            <span>Add</span>
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
