import { useApp } from "@/contexts/AppContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Bus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function RoutesPage() {
  const { routes, vehicles } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Available Routes</h1>
        <p className="mt-2 text-muted-foreground">Browse all matatu and bus routes across Nairobi.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {routes.filter(r => r.active).map((route, i) => {
            const vehicle = vehicles.find(v => v.id === route.vehicleId);
            return (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{route.name}</h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{route.from}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{route.to}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-display text-lg font-bold text-primary">
                    KSh {route.fare}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {route.stops.map(stop => (
                    <span key={stop} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{stop}</span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bus className="h-4 w-4" />
                      {vehicle?.plateNumber} ({vehicle?.type})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {route.schedule.length} departures
                    </span>
                  </div>
                  <Link to={`/book?route=${route.id}`}>
                    <Button size="sm" variant="hero">Book</Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
