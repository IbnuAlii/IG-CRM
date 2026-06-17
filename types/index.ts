// User Roles
export type UserRole =
  | 'customer'
  | 'driver'
  | 'dispatcher'
  | 'manager'
  | 'hr_officer'
  | 'fleet_manager'
  | 'accountant'
  | 'admin'
  | 'superadmin';

// Customer & User Types
export interface User {
  id: string;
  email?: string;
  phone: string;
  name: string;
  role: UserRole;
  avatar?: string;
  city?: string;
  createdAt: Date;
}

export interface Customer extends User {
  role: 'customer';
  savedAddresses: SavedAddress[];
  paymentMethods: PaymentMethod[];
  ridePreferences: RidePreferences;
  rating: number;
  totalRides: number;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export interface SavedAddress {
  id: string;
  label: 'home' | 'work' | 'other';
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

export interface RidePreferences {
  musicPreference?: 'quiet' | 'music';
  temperature?: 'cold' | 'cool' | 'warm' | 'hot';
  conversationLevel?: 'quiet' | 'normal' | 'chatty';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'cash';
  name: string;
  isDefault: boolean;
  last4?: string;
  expiryDate?: string;
}

// Driver Types
export interface Driver extends User {
  role: 'driver';
  licenseNumber: string;
  licenseExpiry: string;
  vehicleId: string;
  vehicle: Vehicle;
  status: 'offline' | 'online' | 'on-ride' | 'on-break';
  currentLocation: GeoLocation;
  rating: number;
  totalRides: number;
  earnings: {
    today: number;
    week: number;
    month: number;
  };
  bankAccount?: {
    accountHolder: string;
    accountNumber: string;
    routingNumber: string;
  };
  documents: DriverDocument[];
  acceptanceRate: number;
  cancellationRate: number;
  onTimePercentage: number;
}

export interface Vehicle {
  id: string;
  driverId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  registrationNumber: string;
  insuranceExpiry: string;
  mileage: number;
  type: 'economy' | 'premium' | 'xl';
  seats: number;
  ac: boolean;
  wifi: boolean;
  usb: boolean;
}

export interface DriverDocument {
  id: string;
  type: 'license' | 'insurance' | 'registration' | 'background-check';
  status: 'pending' | 'verified' | 'expired' | 'rejected';
  expiryDate: string;
  url?: string;
}

// Admin & SuperAdmin Types
export interface Admin extends User {
  role: 'admin';
  city: string;
  department?: string;
  permissions: Permission[];
}

export interface SuperAdmin extends User {
  role: 'superadmin';
  permissions: Permission[];
}

export type Permission = 
  | 'manage_rides'
  | 'manage_drivers'
  | 'manage_customers'
  | 'manage_support'
  | 'view_analytics'
  | 'manage_pricing'
  | 'manage_promotions'
  | 'manage_vehicles'
  | 'manage_cities';

// Geo Location
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: Date;
}

// Ride Types
export interface Ride {
  id: string;
  customerId: string;
  customer: Customer;
  driverId?: string;
  driver?: Driver;
  pickupLocation: GeoLocation & { address: string };
  dropoffLocation: GeoLocation & { address: string };
  status: 'requested' | 'accepted' | 'picked-up' | 'in-progress' | 'completed' | 'cancelled';
  rideType: 'economy' | 'premium' | 'xl';
  fare: Fare;
  scheduledFor?: Date;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  route?: Route;
  notes?: string;
  feedback?: RideFeedback;
}

export interface Fare {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgePricingMultiplier: number;
  discount: number;
  total: number;
  currency: string;
}

export interface Route {
  distance: number; // in km
  duration: number; // in minutes
  eta?: Date;
  waypoints: GeoLocation[];
}

export interface RideFeedback {
  driverId: string;
  customerId: string;
  rideId: string;
  driverRating: number;
  rideRating: number;
  comments?: string;
  reportedIssues?: string[];
  createdAt: Date;
}

// Support Types
export interface SupportTicket {
  id: string;
  userId: string;
  type: 'safety' | 'lost-item' | 'billing' | 'ride-issue' | 'driver-issue' | 'other';
  subject: string;
  description: string;
  rideId?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: TicketMessage[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  attachment?: string;
  createdAt: Date;
}

// Promotion & Pricing Types
export interface PromotionCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  maxUses?: number;
  currentUses: number;
  validFrom: Date;
  validUntil: Date;
  minRideAmount?: number;
  maxDiscount?: number;
  applicable_ride_types: string[];
  active: boolean;
}

export interface SurgePricing {
  id: string;
  city: string;
  rideType: string;
  multiplier: number;
  activeFrom: Date;
  reason: 'high_demand' | 'low_supply' | 'event' | 'weather';
}

// Analytics Types
export interface RideMetrics {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  averageRating: number;
  totalEarnings: number;
  averageRideTime: number;
  averageRideDistance: number;
}

export interface DriverMetrics extends RideMetrics {
  acceptanceRate: number;
  cancellationRate: number;
  onTimePercentage: number;
  totalHoursWorked: number;
}

// Multi-Tenant
export interface Tenant {
  id: string;
  name: string;
  city: string;
  timezone: string;
  baseUrl: string;
  status: 'active' | 'trial' | 'suspended';
  createdAt: Date;
}

// CRM SaaS Super Admin Types
export type TenantStatus = 'active' | 'trial' | 'pending' | 'suspended' | 'cancelled';

export type SubscriptionPlan = 'basic' | 'professional' | 'enterprise';

export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'suspended' | 'cancelled';

export type TenantRegistrationStatus = 'pending' | 'approved' | 'rejected';

export type SystemStatus = 'operational' | 'degraded' | 'down';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface CrmTenant {
  id: string;
  name: string;
  subdomain: string;
  status: TenantStatus;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  billingEmail: string;
  adminName: string;
  adminEmail: string;
  usersCount: number;
  createdAt: Date;
  trialEndsAt?: Date;
}

export interface TenantRegistration {
  id: string;
  companyName: string;
  adminName: string;
  adminEmail: string;
  requestedPlan: SubscriptionPlan;
  status: TenantRegistrationStatus;
  submittedAt: Date;
}

export interface CrmSubscription {
  id: string;
  tenantId: string;
  tenantName: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  monthlyAmount: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export interface SystemHealthMetric {
  apiStatus: SystemStatus;
  databaseStatus: SystemStatus;
  websocketStatus: SystemStatus;
  avgResponseTimeMs: number;
  errorRate: number;
  uptime: number;
  checkedAt: Date;
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  createdAt: Date;
  resolved: boolean;
}

export interface SuperAdminDashboardData {
  tenants: CrmTenant[];
  registrations: TenantRegistration[];
  subscriptions: CrmSubscription[];
  systemHealth: SystemHealthMetric;
  alerts: SystemAlert[];
  revenueTrend: Array<{
    month: string;
    revenue: number;
    tenants: number;
  }>;
}

// CRM Admin Module Types
export type AdminCustomerStatus = 'new' | 'active' | 'inactive' | 'vip' | 'do_not_contact';

export type AdminQuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'converted';

export type AdminTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type AdminTicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type AdminJobStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';

export type AdminJobPriority = 'low' | 'normal' | 'high' | 'emergency';

export type AdminEmployeeRole =
  | 'admin'
  | 'manager'
  | 'dispatcher'
  | 'technician'
  | 'hr_officer'
  | 'fleet_manager'
  | 'accountant';

export type AdminEmployeeStatus = 'active' | 'on_leave' | 'inactive';

export interface AdminCustomerAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  isPrimary: boolean;
}

export interface AdminCustomerActivity {
  id: string;
  type: 'job' | 'quote' | 'ticket' | 'communication';
  title: string;
  description: string;
  happenedAt: Date;
}

export interface AdminCustomerRecord {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  status: AdminCustomerStatus;
  tags: string[];
  addresses: AdminCustomerAddress[];
  notes: string;
  lifetimeValue: number;
  openJobs: number;
  lastServiceAt?: Date;
  createdAt: Date;
  activity: AdminCustomerActivity[];
}

export interface AdminQuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
}

export interface AdminQuote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  status: AdminQuoteStatus;
  validUntil: Date;
  createdAt: Date;
  subtotal: number;
  tax: number;
  total: number;
  lineItems: AdminQuoteLineItem[];
  assignedTo: string;
}

export interface AdminTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  status: AdminTicketStatus;
  priority: AdminTicketPriority;
  assignedTo: string;
  openedAt: Date;
  slaDueAt: Date;
  resolutionHours?: number;
}

export interface AdminJob {
  id: string;
  jobNumber: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  description: string;
  status: AdminJobStatus;
  priority: AdminJobPriority;
  technicianId?: string;
  technicianName?: string;
  scheduledStart: Date;
  estimatedDurationMinutes: number;
  address: string;
  quoteId?: string;
  recurring: boolean;
  specialInstructions?: string;
}

export interface AdminEmployee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminEmployeeRole;
  status: AdminEmployeeStatus;
  skills: string[];
  capacityHours: number;
  scheduledHours: number;
  jobsCompleted: number;
  rating: number;
  currentLocation?: string;
}

export interface AdminReport {
  id: string;
  name: string;
  category: 'revenue' | 'operations' | 'customers' | 'workforce' | 'finance';
  description: string;
  lastRunAt: Date;
  schedule: 'manual' | 'daily' | 'weekly' | 'monthly';
}

export interface AdminDashboardData {
  customers: AdminCustomerRecord[];
  quotes: AdminQuote[];
  tickets: AdminTicket[];
  jobs: AdminJob[];
  employees: AdminEmployee[];
  reports: AdminReport[];
  revenueTrend: Array<{
    date: string;
    revenue: number;
    jobs: number;
  }>;
}

// Auth Context
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
