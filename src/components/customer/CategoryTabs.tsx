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
  const [indicatorStyle, setIndicatorStyle] =
    React.useState<React.CSSProperties>({});
  const tabsRef = React.useRef<Array<HTMLButtonElement | null>>([]);

  React.useEffect(() => {
    const selectedIndex = categories.findIndex(
      (cat) => cat === selectedCategory,
    );
    const selectedTab = tabsRef.current[selectedIndex];

    if (selectedTab) {
      setIndicatorStyle({
        left: selectedTab.offsetLeft,
        width: selectedTab.offsetWidth,
      });

      // Scroll the active tab into view if it's not fully visible
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
        className="relative flex w-full items-center overflow-x-auto p-1"
        // A common utility to hide scrollbars while keeping the functionality
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>
          {`
            .category-tabs::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {/* Animated Indicator */}
        {categories.length > 0 && (
          <div
            className="absolute h-10 rounded-full bg-slate-700/50 shadow-inner transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
        )}

        {/* Tab Buttons */}
        {categories.map((category, index) => (
          <button
            key={category}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "relative z-10 flex-shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 sm:px-6 sm:text-base",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
              selectedCategory === category
                ? "text-white"
                : "text-slate-400 hover:text-white",
            )}
            role="tab"
            aria-selected={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
