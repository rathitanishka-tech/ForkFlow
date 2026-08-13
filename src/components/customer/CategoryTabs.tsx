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
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>
          {`
            .category-tabs::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {categories.length > 0 && (
          <div
            className="absolute h-10 rounded-full bg-[#0f5b4c] shadow-inner transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
        )}

        {categories.map((category, index) => (
          <button
            key={category}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "relative z-10 shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 sm:px-6 sm:text-base",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              selectedCategory === category
                ? "text-white"
                : "text-slate-500 hover:text-slate-900",
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
