"use client";

import { useTransition, useState } from "react";
import { createRestaurantAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PREDEFINED_ITEMS = [
  { name: "Paneer Butter Masala", description: "Rich tomato gravy with fresh paneer cubes.", price: 12.99, preparationTime: 20, isVeg: true, spiceLevel: "MILD", category: "Main Course" },
  { name: "Vegetable Biryani", description: "Aromatic basmati rice cooked with fresh vegetables and spices.", price: 14.99, preparationTime: 25, isVeg: true, spiceLevel: "MEDIUM", category: "Main Course" },
  { name: "Margherita Pizza", description: "Classic pizza with fresh basil and mozzarella.", price: 11.99, preparationTime: 15, isVeg: true, spiceLevel: "NONE", category: "Pizza" },
  { name: "Dal Makhani", description: "Slow-cooked black lentils in a creamy, rich gravy.", price: 9.99, preparationTime: 20, isVeg: true, spiceLevel: "MILD", category: "Main Course" },
  { name: "Garlic Naan", description: "Freshly baked Indian bread topped with minced garlic and butter.", price: 3.99, preparationTime: 10, isVeg: true, spiceLevel: "NONE", category: "Breads" },
  { name: "Mango Lassi", description: "Sweet and thick yogurt drink blended with fresh mangoes.", price: 4.99, preparationTime: 5, isVeg: true, spiceLevel: "NONE", category: "Beverages" }
];

export default function OnboardingPage() {
  const [isPending, startTransition] = useTransition();
  const [selectedPredefined, setSelectedPredefined] = useState<string[]>(PREDEFINED_ITEMS.map(i => i.name));
  const [customItems, setCustomItems] = useState<any[]>([]);
  
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");
  
  const handleTogglePredefined = (name: string) => {
    setSelectedPredefined(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };
  
  const handleAddCustom = () => {
    if (!customItemName || !customItemPrice) {
      toast.error("Please provide both name and price for the custom item.");
      return;
    }
    const newItem = {
      name: customItemName,
      price: parseFloat(customItemPrice),
      description: "",
      preparationTime: 15,
      isVeg: true,
      spiceLevel: "NONE",
      category: "Other"
    };
    setCustomItems(prev => [...prev, newItem]);
    setCustomItemName("");
    setCustomItemPrice("");
  };

  const handleRemoveCustom = (index: number) => {
    setCustomItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (formData: FormData) => {
    const finalItems = [
      ...PREDEFINED_ITEMS.filter(i => selectedPredefined.includes(i.name)),
      ...customItems
    ];
    formData.append("menuItems", JSON.stringify(finalItems));
    
    startTransition(async () => {
      try {
        const result = await createRestaurantAction(formData);
        if (result?.error) {
          toast.error(result.error);
        }
      } catch (err) {
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <Card className="w-full max-w-xl bg-card border-border shadow-xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Welcome to ForkFlow
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Let&apos;s set up your first restaurant and initial menu.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">1. Restaurant Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. The Rustic Spoon"
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select name="propertyType" defaultValue="LEASED" required>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNED">Owned</SelectItem>
                    <SelectItem value="LEASED">Leased</SelectItem>
                    <SelectItem value="RENTED">Rented</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tableCount">Number of Tables</Label>
                <Input
                  id="tableCount"
                  name="tableCount"
                  type="number"
                  min="1"
                  max="50"
                  defaultValue="10"
                  required
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">2. Initial Menu Items</h3>
            <p className="text-sm text-muted-foreground">Select the predefined vegetarian items you want to start with.</p>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_ITEMS.map(item => (
                <Badge
                  key={item.name}
                  variant={selectedPredefined.includes(item.name) ? "default" : "outline"}
                  className="cursor-pointer py-1.5 px-3 text-sm transition-all"
                  onClick={() => handleTogglePredefined(item.name)}
                >
                  {item.name}
                </Badge>
              ))}
            </div>

            <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
              <p className="text-sm font-medium mb-3">Add Custom Item (Optional)</p>
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="space-y-1.5 flex-1 w-full">
                  <Label htmlFor="custom-name" className="text-xs">Item Name</Label>
                  <Input 
                    id="custom-name" 
                    value={customItemName} 
                    onChange={e => setCustomItemName(e.target.value)} 
                    placeholder="e.g. Pasta" 
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5 w-full sm:w-28">
                  <Label htmlFor="custom-price" className="text-xs">Price ($)</Label>
                  <Input 
                    id="custom-price" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={customItemPrice} 
                    onChange={e => setCustomItemPrice(e.target.value)} 
                    placeholder="12.99" 
                    className="bg-background"
                  />
                </div>
                <Button type="button" variant="secondary" onClick={handleAddCustom} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </div>

              {customItems.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Your Custom Items</p>
                  {customItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-background p-2 rounded border text-sm">
                      <span>{item.name} <span className="text-muted-foreground ml-2">${item.price}</span></span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCustom(index)} className="h-6 w-6 p-0 text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Create Restaurant"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
