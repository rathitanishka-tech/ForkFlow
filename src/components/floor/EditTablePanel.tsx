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
          <h3 className="text-xl font-semibold text-foreground">Edit Table</h3>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Editing
          </div>
        </div>

        <div className="space-y-5 flex-grow">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Table Number/Name
            </label>
            <input
              type="text"
              name="number"
              value={table.number}
              onChange={handleChange}
              className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              min="1"
              max="30"
              value={table.capacity}
              onChange={handleChange}
              className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Shape
            </label>
            <select
              name="shape"
              value={table.shape}
              onChange={handleChange}
              className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="SQUARE">Square</option>
              <option value="ROUND">Round</option>
              <option value="RECTANGLE">Rectangle</option>
              <option value="SOFA">Sofa</option>
              <option value="BAR">Bar</option>
              <option value="OUTDOOR">Outdoor</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={table.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary bg-secondary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-foreground">
              Table is Active
            </label>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <button
            onClick={onDelete}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete Table
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
