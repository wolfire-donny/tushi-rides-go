import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Loyalty() {
  const { user, isAuthenticated } = useApp();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Sign in to view rewards</h2>
          <Button variant="hero" className="mt-4" onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  const ridesUntilReward = 10 - (user.rideCount % 10);
  const progress = ((user.rideCount % 10) / 10) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-lg px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Loyalty Rewards</h1>
        <p className="mt-2 text-muted-foreground">Ride more, earn more. Every 10 rides = 1 reward token!</p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-card"
        >
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
              <Gift className="h-10 w-10 text-accent" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-foreground">{user.name}</h2>
            <p className="text-muted-foreground">Tushi Loyalty Member</p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl bg-primary/5 p-4">
              <p className="font-display text-3xl font-bold text-primary">{user.rideCount}</p>
              <p className="text-xs text-muted-foreground">Total Rides</p>
            </div>
            <div className="rounded-xl bg-accent/10 p-4">
              <p className="font-display text-3xl font-bold text-accent">{user.loyaltyTokens}</p>
              <p className="text-xs text-muted-foreground">Tokens</p>
            </div>
            <div className="rounded-xl bg-info/10 p-4">
              <p className="font-display text-3xl font-bold text-info">{ridesUntilReward}</p>
              <p className="text-xs text-muted-foreground">Rides to Next</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to next token</span>
              <span className="font-medium text-primary">{user.rideCount % 10}/10</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full gradient-primary"
              />
            </div>
          </div>

          {/* Ride dots */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  i < (user.rideCount % 10)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i < (user.rideCount % 10) ? <Star className="h-4 w-4" /> : i + 1}
              </div>
            ))}
          </div>

          {user.loyaltyTokens > 0 && (
            <div className="mt-8 rounded-xl bg-accent/10 p-4 text-center">
              <Zap className="mx-auto h-6 w-6 text-accent" />
              <p className="mt-2 font-display text-lg font-semibold text-foreground">
                You have {user.loyaltyTokens} reward token{user.loyaltyTokens > 1 ? "s" : ""}!
              </p>
              <p className="text-sm text-muted-foreground">Redeem for a free ride on your next booking.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
