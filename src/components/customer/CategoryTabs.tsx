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
    <div className="w-full overflow-hidden">
      <div
        className="relative flex w-full items-center justify-start gap-2 overflow-x-auto px-2 py-3 sm:justify-center"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
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
                "group relative shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200",
                isSelected
                  ? "bg-[#216E46] text-white shadow-xs dark:bg-[#74A96B] dark:text-[#101712]"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              role="tab"
              aria-selected={isSelected}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
