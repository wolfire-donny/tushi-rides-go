import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Bus, MapPin, Shield, Gift, Smartphone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: MapPin, title: "Smart Routes", desc: "Find the fastest matatu and bus routes across the city in real-time." },
  { icon: Bus, title: "Live Tracking", desc: "Track your vehicle in real-time and know exactly when it arrives." },
  { icon: Shield, title: "Secure Payments", desc: "Pay seamlessly via M-Pesa with instant confirmation and digital receipts." },
  { icon: Gift, title: "Loyalty Rewards", desc: "Earn tokens every 10 rides and redeem them for free trips." },
  { icon: Smartphone, title: "QR Tickets", desc: "Get unique QR code tickets — no paper, no hassle, just scan and board." },
];

export default function Index() {
  const { isAuthenticated } = useApp();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              🚌 Nairobi's Smartest Transit App
            </span>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight tracking-tight text-primary-foreground md:text-7xl">
              Your Ride,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Your Way
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70 md:text-xl">
              Book matatus and buses instantly. Pay with M-Pesa, track in real-time, and earn rewards on every ride with Tushi Rides.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {isAuthenticated ? (
                <Link to="/book">
                  <Button variant="hero" size="lg" className="text-base">
                    Book a Ride <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="hero" size="lg" className="text-base">
                      Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-base">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Why Tushi Rides?
            </h2>
            <p className="mt-3 text-muted-foreground">Everything you need for seamless public transport.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">Ready to Ride?</h2>
          <p className="mt-3 text-primary-foreground/80">Join thousands of Nairobi commuters using Tushi Rides daily.</p>
          <Link to={isAuthenticated ? "/book" : "/register"}>
            <Button variant="accent" size="lg" className="mt-6 text-base">
              {isAuthenticated ? "Book Now" : "Create Account"} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <span className="font-display text-sm font-semibold text-foreground">© 2026 Tushi Rides</span>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>24/7 Support</span>
            <span>Privacy Policy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
