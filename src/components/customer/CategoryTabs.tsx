import * as React from "react";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  const tabsRef = React.useRef<Array<HTMLButtonElement | null>>([]);

  React.useEffect(() => {
    const selectedIndex = categories.findIndex(
      (cat) => cat === selectedCategory,
    );
    const selectedTab = tabsRef.current[selectedIndex];

    if (selectedTab) {
      selectedTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedCategory, categories]);

  return (
    <div className="w-full overflow-hidden border-b border-[#E3DCD2]">
      <div
        className="relative flex w-full items-center justify-start gap-8 overflow-x-auto px-4 py-4 sm:justify-center"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>
          {`
            .category-tabs::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {categories.map((category, index) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              onClick={() => onSelectCategory(category)}
              className={cn(
                "group relative shrink-0 cursor-pointer pb-2 font-sans text-sm font-semibold uppercase tracking-[0.2em] transition-colors duration-300",
                "focus:outline-none",
                isSelected
                  ? "text-[#2A2421]"
                  : "text-[#5C544F] hover:text-[#2A2421]",
              )}
              role="tab"
              aria-selected={isSelected}
            >
              {category}
              
              {/* Animated Underline Ornament */}
              <div
                className={cn(
                  "absolute -bottom-[17px] left-1/2 h-[2px] w-8 -translate-x-1/2 bg-[#8B2E2E] transition-all duration-300 ease-out",
                  isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0",
                )}
              />
              
              {/* Optional: Add a subtle vintage ornament like a diamond for the active state */}
              <div 
                className={cn(
                  "absolute -bottom-[20px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-[#8B2E2E] transition-all duration-300 ease-out",
                  isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
