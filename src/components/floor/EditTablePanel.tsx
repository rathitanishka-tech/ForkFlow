import * as React from "react";
import { TableNodeData } from "./TableNode";
import { Card } from "@/components/ui/card";
import { Trash2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface EditTablePanelProps {
  table: TableNodeData;
  onChange: (updatedTable: TableNodeData) => void;
  onDelete: () => void;
}

export function EditTablePanel({ table, onChange, onDelete }: EditTablePanelProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: string | number | boolean = value;
    
    if (type === "number") {
      parsedValue = parseInt(value, 10);
    } else if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    onChange({
      ...table,
      [name]: parsedValue,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="rounded-[1.5rem] border border-border bg-card p-6 h-full flex flex-col shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#17251D] dark:text-[#F3F5F0]">Edit Table</h3>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#226B4D] bg-[#226B4D]/10 dark:text-[#4A9167] dark:bg-[#4A9167]/15 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Editing
          </div>
        </div>

        <div className="space-y-4 flex-grow">
          <div>
            <label className="block text-xs font-semibold text-[#718078] dark:text-[#A3B2A6] uppercase tracking-wider mb-1.5">
              Table Number/Name
            </label>
            <input
              type="text"
              name="number"
              value={table.number}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-[#17251D] dark:text-[#F3F5F0] focus:outline-none focus:ring-2 focus:ring-[#226B4D]/40 dark:focus:ring-[#4A9167]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#718078] dark:text-[#A3B2A6] uppercase tracking-wider mb-1.5">
              Capacity (Guests)
            </label>
            <input
              type="number"
              name="capacity"
              min="1"
              max="30"
              value={table.capacity}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-[#17251D] dark:text-[#F3F5F0] focus:outline-none focus:ring-2 focus:ring-[#226B4D]/40 dark:focus:ring-[#4A9167]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#718078] dark:text-[#A3B2A6] uppercase tracking-wider mb-1.5">
              Shape
            </label>
            <select
              name="shape"
              value={table.shape}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-[#17251D] dark:text-[#F3F5F0] focus:outline-none focus:ring-2 focus:ring-[#226B4D]/40 dark:focus:ring-[#4A9167]/40"
            >
              <option value="SQUARE">Square</option>
              <option value="ROUND">Round</option>
              <option value="RECTANGLE">Rectangle</option>
              <option value="SOFA">Sofa</option>
              <option value="BAR">Bar</option>
              <option value="OUTDOOR">Outdoor</option>
            </select>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={table.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-[#226B4D] focus:ring-[#226B4D] bg-background accent-[#226B4D] dark:accent-[#4A9167]"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-[#17251D] dark:text-[#F3F5F0]">
              Table is Active on Floor
            </label>
          </div>
        </div>

        {/* Destructive action button: Tomato red #FF6258 */}
        <div className="mt-8 pt-6 border-t border-border">
          <button
            onClick={onDelete}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FF6258]/30 bg-[#FF6258]/10 px-4 py-2.5 text-xs font-semibold text-[#FF6258] hover:bg-[#FF6258]/20 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Delete Table
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
