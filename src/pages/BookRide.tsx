import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, CreditCard, Check } from "lucide-react";

export default function BookRide() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { routes, isAuthenticated, bookRide } = useApp();

  const preselectedRoute = searchParams.get("route") || "";
  const [selectedRouteId, setSelectedRouteId] = useState(preselectedRoute);
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState<"select" | "payment" | "done">("select");
  const [phone, setPhone] = useState("");
  const [lastBookingId, setLastBookingId] = useState("");

  const selectedRoute = useMemo(() => routes.find(r => r.id === selectedRouteId), [routes, selectedRouteId]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Please sign in to book</h2>
          <Button variant="hero" className="mt-4" onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  const handleSelectContinue = () => {
    if (!selectedRouteId || !selectedFrom || !selectedTo || !selectedTime) {
      toast.error("Please fill in all fields"); return;
    }
    setStep("payment");
  };

  const handlePayment = () => {
    if (!phone || phone.length < 10) { toast.error("Enter valid M-Pesa phone number"); return; }
    const booking = bookRide(selectedRouteId, selectedFrom, selectedTo, selectedTime);
    if (booking) {
      setLastBookingId(booking.id);
      setStep("done");
      toast.success("Ride booked! Check your QR ticket.");
    } else {
      toast.error("Booking failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Book a Ride</h1>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-2">
          {["Select Route", "M-Pesa Payment", "Confirmed"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                (step === "select" && i === 0) || (step === "payment" && i === 1) || (step === "done" && i === 2)
                  ? "bg-primary text-primary-foreground"
                  : i < (step === "select" ? 0 : step === "payment" ? 1 : 2)
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
              }`}>{i < (step === "select" ? 0 : step === "payment" ? 1 : 3) ? <Check className="h-4 w-4" /> : i + 1}</div>
              <span className="hidden text-sm sm:block">{s}</span>
              {i < 2 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-8">
          {step === "select" && (
            <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-card">
              <div>
                <Label>Route</Label>
                <select
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                  value={selectedRouteId}
                  onChange={e => { setSelectedRouteId(e.target.value); setSelectedFrom(""); setSelectedTo(""); setSelectedTime(""); }}
                >
                  <option value="">Select a route</option>
                  {routes.filter(r => r.active).map(r => (
                    <option key={r.id} value={r.id}>{r.name} — KSh {r.fare}</option>
                  ))}
                </select>
              </div>

              {selectedRoute && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>From</Label>
                      <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" value={selectedFrom} onChange={e => setSelectedFrom(e.target.value)}>
                        <option value="">Boarding point</option>
                        {selectedRoute.stops.slice(0, -1).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>To</Label>
                      <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" value={selectedTo} onChange={e => setSelectedTo(e.target.value)}>
                        <option value="">Alighting point</option>
                        {selectedRoute.stops.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>Departure Time</Label>
                    <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                      <option value="">Select time</option>
                      {selectedRoute.schedule.map(s => (
                        <option key={s.id} value={s.departureTime}>{s.departureTime} — {s.days.join(", ")}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
                    <span className="text-sm text-muted-foreground">Fare</span>
                    <span className="font-display text-2xl font-bold text-primary">KSh {selectedRoute.fare}</span>
                  </div>
                </>
              )}
              <Button variant="hero" className="w-full" onClick={handleSelectContinue}>Continue to Payment</Button>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="rounded-xl bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> {selectedFrom} <ArrowRight className="h-3 w-3" /> {selectedTo}
                </div>
                <p className="mt-1 font-display text-lg font-semibold text-foreground">{selectedRoute?.name}</p>
                <p className="text-sm text-muted-foreground">Departure: {selectedTime}</p>
              </div>
              <div>
                <Label>M-Pesa Phone Number</Label>
                <div className="relative mt-1">
                  <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground"
                    placeholder="+254712345678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">You'll receive an M-Pesa STK push to confirm payment.</p>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-accent/10 px-4 py-3">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-display text-2xl font-bold text-primary">KSh {selectedRoute?.fare}</span>
              </div>
              <Button variant="accent" className="w-full" onClick={handlePayment}>
                Pay with M-Pesa
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep("select")}>Back</Button>
            </div>
          )}

          {step === "done" && (
            <div className="space-y-6 rounded-2xl border border-border bg-card p-6 text-center shadow-card">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Booking Confirmed!</h2>
              <p className="text-muted-foreground">Your QR ticket is ready. Show it when boarding.</p>
              <Button variant="hero" onClick={() => navigate("/my-tickets")}>View My Tickets</Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
