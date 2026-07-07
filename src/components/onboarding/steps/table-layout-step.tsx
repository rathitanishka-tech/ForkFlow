"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type PanInfo } from "framer-motion";
import { toast } from "sonner";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useOnboardingStore,
  type Floor,
  type Table,
} from "@/lib/onboarding-store";
import { Plus } from "lucide-react";

function TableComponent({
  table,
  onUpdate,
}: {
  table: Table;
  onUpdate: (table: Table, newPosition: { x: number; y: number }) => void;
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(
        _event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo,
      ) =>
        onUpdate(table, {
          x: table.x + info.offset.x,
          y: table.y + info.offset.y,
        })
      }
      className="absolute flex h-20 w-20 cursor-grab flex-col items-center justify-center rounded-lg bg-neutral-200 shadow active:cursor-grabbing"
      style={{ x: table.x, y: table.y, rotate: table.rotation }}
    >
      <div className="text-sm font-semibold text-neutral-800">
        T{table.number}
      </div>
      <div className="text-xs text-neutral-600">{table.seats} seats</div>
    </motion.div>
  );
}

function FloorPlan({
  floor,
  onUpdateTable,
  onAddTable,
}: {
  floor: Floor;
  onUpdateTable: (table: Table) => void;
  onAddTable: (floorId: string) => void;
}) {
  const handleTableUpdate = async (
    table: Table,
    newPosition: { x: number; y: number },
  ) => {
    const originalTable = { ...table };
    const updatedTable = { ...table, x: newPosition.x, y: newPosition.y };

    // Optimistic UI update
    onUpdateTable(updatedTable);

    // Autosave to backend
    try {
      const response = await fetch(`/api/tables/${table.backendId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xPosition: updatedTable.x,
          yPosition: updatedTable.y,
        }),
      });

      if (!response.ok) throw new Error("Failed to save table position.");
      toast.success(`Table ${table.number} position saved.`);
    } catch (error) {
      toast.error(`Could not save Table ${table.number}. Reverting.`);
      // Revert on failure
      onUpdateTable(originalTable);
    }
  };

  return (
    <div className="relative h-125 w-full rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50">
      <div className="absolute bottom-2 right-2">
        <Button onClick={() => onAddTable(floor.id)}>
          <Plus className="mr-2 h-4 w-4" /> Add Table
        </Button>
      </div>
      {floor.tables.map((table) => (
        <TableComponent
          key={table.id}
          table={table}
          onUpdate={handleTableUpdate}
        />
      ))}
    </div>
  );
}

export function TableLayoutStep() {
  const router = useRouter();
  const { floors, updateState } = useOnboardingStore();
  const [seats, setSeats] = useState(4);

  const handleNext = () => {
    router.push(`/onboarding?step=5`);
  };

  const updateTableInStore = (updatedTable: Table) => {
    const newFloors = floors.map((floor) => ({
      ...floor,
      tables: floor.tables.map((t) =>
        t.id === updatedTable.id ? updatedTable : t,
      ),
    }));
    updateState({ floors: newFloors });
  };

  const addTableToStore = async (floorId: string) => {
    const floor = floors.find((f) => f.id === floorId);
    if (!floor || !floor.backendId) {
      toast.error("Please save the floor first.");
      return;
    }

    try {
      const response = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ floorId: floor.backendId, seats }),
      });
      if (!response.ok) throw new Error("Failed to create table.");
      const newTableData = await response.json();

      const newTable: Table = {
        id: `table-${Date.now()}`,
        backendId: newTableData.id,
        number: newTableData.number,
        seats: newTableData.seats,
        x: 50,
        y: 50,
        rotation: 0,
      };

      const newFloors = floors.map((f) =>
        f.id === floorId ? { ...f, tables: [...f.tables, newTable] } : f,
      );
      updateState({ floors: newFloors });
      toast.success(`Table ${newTable.number} added to ${floor.name}.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not add table.",
      );
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Table Layout</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={floors[0]?.id} className="w-full">
          <div className="flex items-end justify-between">
            <TabsList>
              {floors.map((floor) => (
                <TabsTrigger key={floor.id} value={floor.id}>
                  {floor.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-2">
              <Label htmlFor="seats" className="text-sm">
                New Table Seats
              </Label>
              <Input
                id="seats"
                type="number"
                className="w-20"
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value, 10) || 2)}
                min="1"
              />
            </div>
          </div>
          {floors.map((floor) => (
            <TabsContent key={floor.id} value={floor.id} className="mt-4">
              <FloorPlan
                floor={floor}
                onUpdateTable={updateTableInStore}
                onAddTable={addTableToStore}
              />
            </TabsContent>
          ))}
        </Tabs>
        <StepNavigation currentStep={4} totalSteps={5} onNext={handleNext} />
      </CardContent>
    </Card>
  );
}
