// App-wide types and mock data store

export type UserRole = "passenger" | "admin" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  rideCount: number;
  loyaltyTokens: number;
}

export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  stops: string[];
  fare: number;
  vehicleId: string;
  schedule: Schedule[];
  active: boolean;
}

export interface Schedule {
  id: string;
  departureTime: string;
  arrivalTime: string;
  days: string[];
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: "matatu" | "bus";
  capacity: number;
  routeId: string;
  currentLocation?: { lat: number; lng: number };
  status: "active" | "maintenance" | "idle";
}

export interface Booking {
  id: string;
  userId: string;
  routeId: string;
  vehicleId: string;
  from: string;
  to: string;
  departureTime: string;
  fare: number;
  status: "confirmed" | "cancelled" | "completed";
  paymentMethod: "mpesa";
  paymentStatus: "pending" | "paid" | "failed";
  qrCode: string;
  createdAt: string;
}

// Mock data
export const mockRoutes: Route[] = [
  {
    id: "r1",
    name: "Route 23 - CBD Express",
    from: "Westlands",
    to: "CBD",
    stops: ["Westlands", "Museum Hill", "University Way", "CBD"],
    fare: 80,
    vehicleId: "v1",
    schedule: [
      { id: "s1", departureTime: "06:00", arrivalTime: "06:45", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      { id: "s2", departureTime: "07:00", arrivalTime: "07:45", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      { id: "s3", departureTime: "08:00", arrivalTime: "08:45", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
      { id: "s4", departureTime: "17:00", arrivalTime: "17:50", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      { id: "s5", departureTime: "18:00", arrivalTime: "18:50", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
    ],
    active: true,
  },
  {
    id: "r2",
    name: "Route 45 - Thika Road",
    from: "CBD",
    to: "Thika Town",
    stops: ["CBD", "Pangani", "Roysambu", "Kasarani", "Ruiru", "Thika Town"],
    fare: 150,
    vehicleId: "v2",
    schedule: [
      { id: "s6", departureTime: "05:30", arrivalTime: "07:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
      { id: "s7", departureTime: "09:00", arrivalTime: "10:30", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      { id: "s8", departureTime: "14:00", arrivalTime: "15:30", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      { id: "s9", departureTime: "18:30", arrivalTime: "20:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    ],
    active: true,
  },
  {
    id: "r3",
    name: "Route 58 - Mombasa Road",
    from: "CBD",
    to: "JKIA Airport",
    stops: ["CBD", "Industrial Area", "South B", "Athi River", "JKIA Airport"],
    fare: 200,
    vehicleId: "v3",
    schedule: [
      { id: "s10", departureTime: "04:00", arrivalTime: "05:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      { id: "s11", departureTime: "06:00", arrivalTime: "07:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      { id: "s12", departureTime: "12:00", arrivalTime: "13:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      { id: "s13", departureTime: "20:00", arrivalTime: "21:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    ],
    active: true,
  },
  {
    id: "r4",
    name: "Route 11 - Ngong Road",
    from: "CBD",
    to: "Karen",
    stops: ["CBD", "Hurlingham", "Kilimani", "Ngong Road", "Karen"],
    fare: 100,
    vehicleId: "v4",
    schedule: [
      { id: "s14", departureTime: "06:30", arrivalTime: "07:30", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      { id: "s15", departureTime: "08:00", arrivalTime: "09:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
      { id: "s16", departureTime: "17:30", arrivalTime: "18:30", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    ],
    active: true,
  },
];

export const mockVehicles: Vehicle[] = [
  { id: "v1", plateNumber: "KDA 234X", type: "matatu", capacity: 14, routeId: "r1", status: "active", currentLocation: { lat: -1.2634, lng: 36.8083 } },
  { id: "v2", plateNumber: "KCB 912M", type: "bus", capacity: 50, routeId: "r2", status: "active", currentLocation: { lat: -1.2821, lng: 36.8219 } },
  { id: "v3", plateNumber: "KDG 555P", type: "bus", capacity: 50, routeId: "r3", status: "active", currentLocation: { lat: -1.3189, lng: 36.9275 } },
  { id: "v4", plateNumber: "KCA 101Z", type: "matatu", capacity: 33, routeId: "r4", status: "maintenance", currentLocation: { lat: -1.2921, lng: 36.7831 } },
];

export const mockUser: User = {
  id: "u1",
  name: "James Mwangi",
  email: "james@example.com",
  phone: "+254712345678",
  role: "passenger",
  rideCount: 8,
  loyaltyTokens: 0,
};

export const mockBookings: Booking[] = [
  {
    id: "b1",
    userId: "u1",
    routeId: "r1",
    vehicleId: "v1",
    from: "Westlands",
    to: "CBD",
    departureTime: "2026-03-06T07:00:00",
    fare: 80,
    status: "completed",
    paymentMethod: "mpesa",
    paymentStatus: "paid",
    qrCode: "TUSHI-B1-2026",
    createdAt: "2026-03-05T22:00:00",
  },
  {
    id: "b2",
    userId: "u1",
    routeId: "r2",
    vehicleId: "v2",
    from: "CBD",
    to: "Thika Town",
    departureTime: "2026-03-07T09:00:00",
    fare: 150,
    status: "confirmed",
    paymentMethod: "mpesa",
    paymentStatus: "paid",
    qrCode: "TUSHI-B2-2026",
    createdAt: "2026-03-06T10:00:00",
  },
];

// Generate a unique booking ID
export function generateBookingId(): string {
  return `TUSHI-${Date.now().toString(36).toUpperCase()}`;
}

// Generate a QR code string
export function generateQRCode(bookingId: string): string {
  return `${bookingId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
