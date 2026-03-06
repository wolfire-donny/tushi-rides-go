import React, { createContext, useContext, useState, useCallback } from "react";
import {
  User, Route, Vehicle, Booking, UserRole,
  mockUser, mockRoutes, mockVehicles, mockBookings,
  generateBookingId, generateQRCode,
} from "@/lib/store";

interface AppContextType {
  user: User | null;
  routes: Route[];
  vehicles: Vehicle[];
  bookings: Booking[];
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, password: string) => boolean;
  logout: () => void;
  bookRide: (routeId: string, from: string, to: string, departureTime: string) => Booking | null;
  cancelBooking: (bookingId: string) => void;
  addRoute: (route: Omit<Route, "id">) => void;
  updateRoute: (id: string, updates: Partial<Route>) => void;
  deleteRoute: (id: string) => void;
  switchRole: (role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("passenger");

  const login = useCallback((email: string, _password: string) => {
    // Mock auth
    setUser({ ...mockUser, email });
    setIsAuthenticated(true);
    return true;
  }, []);

  const register = useCallback((name: string, email: string, phone: string, _password: string) => {
    setUser({ ...mockUser, id: `u-${Date.now()}`, name, email, phone, rideCount: 0, loyaltyTokens: 0 });
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setUserRole("passenger");
  }, []);

  const bookRide = useCallback((routeId: string, from: string, to: string, departureTime: string): Booking | null => {
    if (!user) return null;
    const route = routes.find(r => r.id === routeId);
    if (!route) return null;

    const bookingId = generateBookingId();
    const newBooking: Booking = {
      id: bookingId,
      userId: user.id,
      routeId,
      vehicleId: route.vehicleId,
      from,
      to,
      departureTime,
      fare: route.fare,
      status: "confirmed",
      paymentMethod: "mpesa",
      paymentStatus: "paid",
      qrCode: generateQRCode(bookingId),
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update ride count & loyalty
    const newRideCount = user.rideCount + 1;
    const earnedToken = newRideCount % 10 === 0;
    setUser(prev => prev ? {
      ...prev,
      rideCount: newRideCount,
      loyaltyTokens: prev.loyaltyTokens + (earnedToken ? 1 : 0),
    } : null);

    return newBooking;
  }, [user, routes]);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" as const } : b));
  }, []);

  const addRoute = useCallback((route: Omit<Route, "id">) => {
    const newRoute: Route = { ...route, id: `r-${Date.now()}` };
    setRoutes(prev => [...prev, newRoute]);
  }, []);

  const updateRoute = useCallback((id: string, updates: Partial<Route>) => {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const deleteRoute = useCallback((id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUserRole(role);
    if (user) setUser(prev => prev ? { ...prev, role } : null);
  }, [user]);

  return (
    <AppContext.Provider value={{
      user, routes, vehicles, bookings, isAuthenticated, userRole,
      login, register, logout, bookRide, cancelBooking,
      addRoute, updateRoute, deleteRoute, switchRole,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
