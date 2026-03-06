import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Clock, XCircle } from "lucide-react";

export default function MyTickets() {
  const { bookings, routes, vehicles, isAuthenticated, cancelBooking } = useApp();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Sign in to view tickets</h2>
          <Button variant="hero" className="mt-4" onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  const statusColor = (status: string) => {
    if (status === "confirmed") return "bg-primary/10 text-primary";
    if (status === "completed") return "bg-secondary text-secondary-foreground";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground">My Tickets</h1>
        <p className="mt-2 text-muted-foreground">{bookings.length} ticket(s)</p>

        <div className="mt-8 space-y-6">
          {bookings.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No tickets yet. <Button variant="link" onClick={() => navigate("/book")}>Book a ride</Button>
            </div>
          )}
          {bookings.map((booking, i) => {
            const route = routes.find(r => r.id === booking.routeId);
            const vehicle = vehicles.find(v => v.id === booking.vehicleId);
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold text-foreground">{route?.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {booking.from} <ArrowRight className="h-3 w-3" /> {booking.to}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(booking.departureTime).toLocaleString()}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Vehicle: {vehicle?.plateNumber} • Fare: <span className="font-semibold text-primary">KSh {booking.fare}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">ID: {booking.qrCode}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-xl border border-border bg-background p-3">
                      <QRCodeSVG value={booking.qrCode} size={100} />
                    </div>
                    {booking.status === "confirmed" && (
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => cancelBooking(booking.id)}>
                        <XCircle className="mr-1 h-4 w-4" /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
