import { create } from 'zustand';
import { User, Customer, Driver, Ride, SupportTicket, PromotionCode } from '@/types';
import { generateMockData } from './mock-data';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

interface RideState {
  rides: Ride[];
  currentRide: Ride | null;
  setRides: (rides: Ride[]) => void;
  setCurrentRide: (ride: Ride | null) => void;
  addRide: (ride: Ride) => void;
  updateRide: (id: string, updates: Partial<Ride>) => void;
  getRideById: (id: string) => Ride | undefined;
}

interface DriverState {
  drivers: Driver[];
  currentDriver: Driver | null;
  setDrivers: (drivers: Driver[]) => void;
  setCurrentDriver: (driver: Driver | null) => void;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  getDriverById: (id: string) => Driver | undefined;
  updateDriverLocation: (id: string, lat: number, lng: number) => void;
}

interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  setCustomers: (customers: Customer[]) => void;
  setCurrentCustomer: (customer: Customer | null) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
}

interface AnalyticsState {
  metrics: any;
  setMetrics: (metrics: any) => void;
}

interface SupportState {
  tickets: SupportTicket[];
  addTicket: (ticket: SupportTicket) => void;
  updateTicket: (id: string, updates: Partial<SupportTicket>) => void;
  getTicketById: (id: string) => SupportTicket | undefined;
}

interface PromotionState {
  promotions: PromotionCode[];
  setPromotions: (promotions: PromotionCode[]) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

// Ride Store
export const useRideStore = create<RideState>((set, get) => ({
  rides: [],
  currentRide: null,
  setRides: (rides) => set({ rides }),
  setCurrentRide: (ride) => set({ currentRide: ride }),
  addRide: (ride) => set({ rides: [...get().rides, ride] }),
  updateRide: (id, updates) =>
    set({
      rides: get().rides.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      currentRide:
        get().currentRide?.id === id
          ? { ...get().currentRide!, ...updates }
          : get().currentRide,
    }),
  getRideById: (id) => get().rides.find((r) => r.id === id),
}));

// Driver Store
export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: [],
  currentDriver: null,
  setDrivers: (drivers) => set({ drivers }),
  setCurrentDriver: (driver) => set({ currentDriver: driver }),
  updateDriver: (id, updates) =>
    set({
      drivers: get().drivers.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      currentDriver:
        get().currentDriver?.id === id
          ? { ...get().currentDriver!, ...updates }
          : get().currentDriver,
    }),
  getDriverById: (id) => get().drivers.find((d) => d.id === id),
  updateDriverLocation: (id, lat, lng) => {
    set({
      drivers: get().drivers.map((d) =>
        d.id === id ? { ...d, currentLocation: { latitude: lat, longitude: lng } } : d
      ),
      currentDriver:
        get().currentDriver?.id === id
          ? {
              ...get().currentDriver!,
              currentLocation: { latitude: lat, longitude: lng },
            }
          : get().currentDriver,
    });
  },
}));

// Customer Store
export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  currentCustomer: null,
  setCustomers: (customers) => set({ customers }),
  setCurrentCustomer: (customer) => set({ currentCustomer: customer }),
  updateCustomer: (id, updates) =>
    set({
      customers: get().customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      currentCustomer:
        get().currentCustomer?.id === id
          ? { ...get().currentCustomer!, ...updates }
          : get().currentCustomer,
    }),
}));

// Analytics Store
export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  metrics: {},
  setMetrics: (metrics) => set({ metrics }),
}));

// Support Store
export const useSupportStore = create<SupportState>((set, get) => ({
  tickets: [],
  addTicket: (ticket) => set({ tickets: [...get().tickets, ticket] }),
  updateTicket: (id, updates) =>
    set({
      tickets: get().tickets.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }),
  getTicketById: (id) => get().tickets.find((t) => t.id === id),
}));

// Promotion Store
export const usePromotionStore = create<PromotionState>((set) => ({
  promotions: [],
  setPromotions: (promotions) => set({ promotions }),
}));

// Initialize stores with mock data
export const initializeStores = () => {
  const mockData = generateMockData();
  
  useCustomerStore.setState({ customers: mockData.customers });
  useDriverStore.setState({ drivers: mockData.drivers });
  useRideStore.setState({ rides: mockData.rides });
  useSupportStore.setState({ tickets: mockData.tickets });
  usePromotionStore.setState({ promotions: mockData.promotions });
};
