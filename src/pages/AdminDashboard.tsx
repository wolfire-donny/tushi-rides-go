import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bus, MapPin, Users, Ticket, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { routes, vehicles, bookings, userRole } = useApp();
  const navigate = useNavigate();

  if (userRole !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Admin Access Required</h2>
          <p className="mt-2 text-muted-foreground">Switch to admin role to access this page.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Active Routes", value: routes.filter(r => r.active).length, icon: MapPin, color: "text-primary" },
    { label: "Vehicles", value: vehicles.length, icon: Bus, color: "text-info" },
    { label: "Total Bookings", value: bookings.length, icon: Ticket, color: "text-accent" },
    { label: "Active Vehicles", value: vehicles.filter(v => v.status === "active").length, icon: Activity, color: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Manage your fleet, routes, and operations.</p>
          </div>
          <Button variant="hero" onClick={() => navigate("/admin/routes")}>Manage Routes</Button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent bookings */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-foreground">Recent Bookings</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Route</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fare</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 10).map(b => {
                  const route = routes.find(r => r.id === b.routeId);
                  return (
                    <tr key={b.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{b.qrCode}</td>
                      <td className="px-4 py-3 text-foreground">{route?.name}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          b.status === "confirmed" ? "bg-primary/10 text-primary" :
                          b.status === "completed" ? "bg-secondary text-secondary-foreground" :
                          "bg-destructive/10 text-destructive"
                        }`}>{b.status}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">KSh {b.fare}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicles */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-foreground">Fleet Status</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {vehicles.map(v => {
              const route = routes.find(r => r.id === v.routeId);
              return (
                <div key={v.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="flex items-center justify-between">
                    <Bus className="h-6 w-6 text-primary" />
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      v.status === "active" ? "bg-primary/10 text-primary" :
                      v.status === "maintenance" ? "bg-accent/10 text-accent" :
                      "bg-secondary text-muted-foreground"
                    }`}>{v.status}</span>
                  </div>
                  <p className="mt-3 font-display text-lg font-bold text-foreground">{v.plateNumber}</p>
                  <p className="text-sm capitalize text-muted-foreground">{v.type} • {v.capacity} seats</p>
                  <p className="mt-1 text-xs text-muted-foreground">{route?.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
