"use client";

import * as React from "react";
import { Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  preparationTime: number;
  spiceLevel: string;
  isVeg: boolean;
  isAvailable: boolean;
  image?: string;
  description?: string;
}

const CATEGORIES = [
  "Starters",
  "Main Course",
  "Breads",
  "Rice & Biryani",
  "Desserts",
  "Beverages",
  "Soups",
  "Salads",
  "Sides",
  "Other"
];

const SPICE_LEVELS = ["NONE", "MILD", "MEDIUM", "HOT", "VERY_HOT"];

const PREDEFINED_ITEMS = [
  { name: "Paneer Butter Masala", category: "Main Course", price: 12.99, preparationTime: 20, spiceLevel: "MEDIUM", isVeg: true, image: "/images/menu/paneer_butter_masala_1787421655976.jpg", description: "Rich and creamy curry made with paneer, spices, onions, tomatoes and cashews." },
  { name: "Veg Biryani", category: "Rice & Biryani", price: 14.99, preparationTime: 25, spiceLevel: "MEDIUM", isVeg: true, image: "/images/menu/veg_biryani_1787421668704.jpg", description: "Aromatic basmati rice cooked with mixed vegetables and special biryani spices." },
  { name: "Margherita Pizza", category: "Main Course", price: 11.99, preparationTime: 15, spiceLevel: "NONE", isVeg: true, image: "/images/menu/margherita_pizza_1787421680276.jpg", description: "Classic pizza with tomato sauce, fresh mozzarella, and basil." },
  { name: "Dal Makhani", category: "Main Course", price: 9.99, preparationTime: 18, spiceLevel: "MILD", isVeg: true, image: "/images/menu/dal_makhani_1787421693424.jpg", description: "Slow-cooked black lentils and kidney beans with butter and cream." },
  { name: "Garlic Naan", category: "Breads", price: 3.99, preparationTime: 10, spiceLevel: "NONE", isVeg: true, image: "/images/menu/garlic_naan_1787421707528.jpg", description: "Soft and fluffy Indian flatbread topped with minced garlic and cilantro." },
  { name: "Mango Lassi", category: "Beverages", price: 4.99, preparationTime: 5, spiceLevel: "NONE", isVeg: true, image: "/images/menu/mango_lassi_1787421719291.jpg", description: "Refreshing yogurt-based drink blended with sweet mangoes." }
];

export default function MenuManagementPage() {
  const [items, setItems] = React.useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    category: "",
    price: "",
    preparationTime: "",
    spiceLevel: "NONE",
    isVeg: true,
    image: "",
    description: "",
  });

  const fetchMenuItems = async () => {
    try {
      const res = await fetch("/api/menu?limit=100");
      if (!res.ok) throw new Error("Failed to fetch menu items");
      const data = await res.json();
      setItems(data.data || []);
    } catch {
      toast.error("Could not load menu items");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMenuItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.preparationTime || !formData.image) {
      toast.error("Please fill in all required fields (including Image URL)");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          preparationTime: parseInt(formData.preparationTime, 10),
          spiceLevel: formData.spiceLevel,
          isVeg: formData.isVeg,
          image: formData.image,
          description: formData.description || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create menu item");
      }

      toast.success("Menu item added successfully");
      setIsAddModalOpen(false);
      setFormData({
        name: "", category: "", price: "", preparationTime: "", spiceLevel: "NONE", isVeg: true, image: "", description: ""
      });
      fetchMenuItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = async (item: typeof PREDEFINED_ITEMS[0]) => {
    // Only add if not already in the list
    if (items.some(existing => existing.name === item.name)) {
      toast.error(`${item.name} is already in your menu!`);
      return;
    }
    
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create menu item");
      }

      toast.success(`${item.name} added successfully!`);
      fetchMenuItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      toast.success("Item deleted");
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      toast.error("Could not delete item");
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle availability");
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
        )
      );
      toast.success("Availability updated");
    } catch {
      toast.error("Could not update availability");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-[1.6rem] border border-border bg-card px-5 py-5 shadow-xl sm:flex-row sm:items-center sm:px-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">Menu Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">Add, edit, and organize your restaurant&apos;s menu items.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground px-1">Quick Add Popular Items</h2>
        <div className="flex overflow-x-auto pb-4 gap-4 snap-x no-scrollbar">
          {PREDEFINED_ITEMS.map((item) => (
            <div key={item.name} className="flex-none w-64 snap-start bg-card border border-border rounded-[1.5rem] overflow-hidden shadow-md flex flex-col group transition hover:shadow-xl hover:border-primary/50">
              <div className="h-40 overflow-hidden relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-3 left-4 text-white font-bold text-lg">{item.name}</p>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-semibold">${item.price}</span>
                    <Badge variant="secondary" className="text-xs bg-secondary/50">{item.category}</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" onClick={() => handleQuickAdd(item)}>
                  <Plus className="h-4 w-4 mr-2" /> Quick Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-card shadow-lg p-6 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No menu items found. Add your first item!</p>
          </div>
        ) : (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="pb-3 font-semibold px-4">Item</th>
                <th className="pb-3 font-semibold px-4">Category</th>
                <th className="pb-3 font-semibold px-4">Price</th>
                <th className="pb-3 font-semibold px-4">Status</th>
                <th className="pb-3 font-semibold px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover bg-muted" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.spiceLevel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{item.category}</td>
                  <td className="py-4 px-4 font-medium">${item.price.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className={item.isAvailable ? "border-emerald-500/50 text-emerald-500" : "border-red-500/50 text-red-500"}>
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleToggleAvailability(item.id)}>
                        Toggle
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[1.5rem] bg-card p-6 border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Add Menu Item</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Garlic Naan" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(val) => handleSelectChange("category", val)} required>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleInputChange} placeholder="9.99" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prep Time (mins)</Label>
                  <Input name="preparationTime" type="number" min="1" value={formData.preparationTime} onChange={handleInputChange} placeholder="15" required />
                </div>
                
                <div className="space-y-2">
                  <Label>Spice Level</Label>
                  <Select value={formData.spiceLevel} onValueChange={(val) => handleSelectChange("spiceLevel", val)} required>
                    <SelectTrigger><SelectValue placeholder="Select Spice" /></SelectTrigger>
                    <SelectContent>
                      {SPICE_LEVELS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image URL (Required)</Label>
                <Input name="image" type="url" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" required />
                <p className="text-xs text-muted-foreground">Provide a direct link to the food image.</p>
              </div>

              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Input name="description" value={formData.description} onChange={handleInputChange} placeholder="A delicious item..." />
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Item"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
