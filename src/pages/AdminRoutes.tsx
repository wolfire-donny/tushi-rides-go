import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminRoutes() {
  const { routes, vehicles, userRole, addRoute, updateRoute, deleteRoute } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", from: "", to: "", fare: "", vehicleId: "", stops: "" });

  if (userRole !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-display text-xl text-muted-foreground">Admin access required</p>
      </div>
    );
  }

  const resetForm = () => { setForm({ name: "", from: "", to: "", fare: "", vehicleId: "", stops: "" }); setEditId(null); setShowForm(false); };

  const handleEdit = (id: string) => {
    const r = routes.find(rt => rt.id === id);
    if (!r) return;
    setForm({ name: r.name, from: r.from, to: r.to, fare: String(r.fare), vehicleId: r.vehicleId, stops: r.stops.join(", ") });
    setEditId(id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.from || !form.to || !form.fare) { toast.error("Fill in all fields"); return; }

    const routeData = {
      name: form.name,
      from: form.from,
      to: form.to,
      fare: Number(form.fare),
      vehicleId: form.vehicleId || vehicles[0]?.id || "",
      stops: form.stops.split(",").map(s => s.trim()).filter(Boolean),
      schedule: [],
      active: true,
    };

    if (editId) {
      updateRoute(editId, routeData);
      toast.success("Route updated");
    } else {
      addRoute(routeData);
      toast.success("Route added");
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteRoute(id);
    toast.success("Route deleted");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-foreground">Manage Routes</h1>
          <Button variant="hero" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="mr-1 h-4 w-4" /> Add Route
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mt-6 space-y-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-foreground">{editId ? "Edit Route" : "New Route"}</h2>
                <button type="button" onClick={resetForm}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Route Name</Label><Input className="mt-1" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Route 23 - CBD Express" /></div>
                <div><Label>Fare (KSh)</Label><Input className="mt-1" type="number" value={form.fare} onChange={e => setForm(p => ({ ...p, fare: e.target.value }))} placeholder="80" /></div>
                <div><Label>From</Label><Input className="mt-1" value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))} placeholder="Westlands" /></div>
                <div><Label>To</Label><Input className="mt-1" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))} placeholder="CBD" /></div>
              </div>
              <div><Label>Stops (comma-separated)</Label><Input className="mt-1" value={form.stops} onChange={e => setForm(p => ({ ...p, stops: e.target.value }))} placeholder="Westlands, Museum Hill, CBD" /></div>
              <div>
                <Label>Vehicle</Label>
                <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" value={form.vehicleId} onChange={e => setForm(p => ({ ...p, vehicleId: e.target.value }))}>
                  <option value="">Assign vehicle</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.plateNumber} ({v.type})</option>)}
                </select>
              </div>
              <Button type="submit" variant="hero">{editId ? "Update Route" : "Add Route"}</Button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 space-y-4">
          {routes.map(r => (
            <div key={r.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-card">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">{r.name}</h3>
                <p className="text-sm text-muted-foreground">{r.from} → {r.to} • KSh {r.fare}</p>
                <p className="text-xs text-muted-foreground">{r.stops.join(" → ")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(r.id)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
