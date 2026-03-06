import { useApp } from "@/contexts/AppContext";
import { Bus } from "lucide-react";

export default function AdminVehicles() {
  const { vehicles, routes, userRole } = useApp();

  if (userRole !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-display text-xl text-muted-foreground">Admin access required</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Vehicle Fleet</h1>
        <p className="mt-2 text-muted-foreground">All registered matatus and buses with their assigned routes.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {vehicles.map(v => {
            const route = routes.find(r => r.id === v.routeId);
            return (
              <div key={v.id} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <Bus className="h-8 w-8 text-primary" />
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    v.status === "active" ? "bg-primary/10 text-primary" :
                    v.status === "maintenance" ? "bg-accent/10 text-accent" :
                    "bg-secondary text-muted-foreground"
                  }`}>{v.status}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-foreground">{v.plateNumber}</h3>
                <p className="capitalize text-muted-foreground">{v.type} • {v.capacity} seats</p>
                <p className="mt-2 text-sm text-muted-foreground">Route: {route?.name || "Unassigned"}</p>
                <p className="text-xs text-muted-foreground">ID: {v.id}</p>
                {v.currentLocation && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    📍 {v.currentLocation.lat.toFixed(4)}, {v.currentLocation.lng.toFixed(4)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
