import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import {
  Bus, MapPin, Ticket, Gift, LayoutDashboard, LogOut, Menu, X, UserCircle, Shield,
} from "lucide-react";

export default function AppNavbar() {
  const { isAuthenticated, user, userRole, logout, switchRole } = useApp();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: "/routes", label: "Routes", icon: MapPin },
    { to: "/book", label: "Book", icon: Ticket },
    { to: "/my-tickets", label: "My Tickets", icon: Bus },
    { to: "/loyalty", label: "Loyalty", icon: Gift },
  ];

  const adminItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/routes", label: "Manage Routes", icon: MapPin },
    { to: "/admin/vehicles", label: "Vehicles", icon: Bus },
  ];

  const activeItems = userRole === "admin" ? [...navItems, ...adminItems] : navItems;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Tushi Rides" className="h-9 w-9" />
          <span className="font-display text-xl font-bold text-foreground">Tushi Rides</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {isAuthenticated && activeItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              {userRole === "passenger" ? (
                <Button variant="ghost" size="sm" onClick={() => switchRole("admin")}>
                  <Shield className="mr-1 h-4 w-4" /> Admin
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => switchRole("passenger")}>
                  <UserCircle className="mr-1 h-4 w-4" /> Passenger
                </Button>
              )}
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/register"><Button variant="hero" size="sm">Sign Up</Button></Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          {isAuthenticated ? (
            <>
              {activeItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium ${
                    isActive(item.to) ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">{user?.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { switchRole(userRole === "admin" ? "passenger" : "admin"); setMenuOpen(false); }}
                  >
                    {userRole === "admin" ? "Passenger" : "Admin"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { logout(); setMenuOpen(false); }}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                <Button variant="hero" className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
