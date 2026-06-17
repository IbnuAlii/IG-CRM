export type CustomerServiceStatus =
  | "scheduled"
  | "technician_en_route"
  | "in_progress"
  | "completed"
  | "awaiting_approval";

export interface CustomerAppointment {
  id: string;
  service: string;
  status: CustomerServiceStatus;
  scheduledFor: string;
  arrivalWindow: string;
  technician: {
    name: string;
    rating: number;
    avatar: string;
    phone: string;
  };
  address: string;
  issue: string;
  estimate: number;
  progress: number;
}

export interface CustomerQuote {
  id: string;
  title: string;
  amount: number;
  status: "pending" | "approved" | "expired";
  validUntil: string;
  summary: string;
  lineItems: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export interface CustomerInvoice {
  id: string;
  service: string;
  amount: number;
  status: "paid" | "due";
  date: string;
}

export interface CustomerLocation {
  id: string;
  label: string;
  address: string;
  type: "home" | "office" | "site";
}

export interface CustomerTicket {
  id: string;
  subject: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "waiting_on_customer" | "resolved";
  createdAt: string;
  lastUpdate: string;
  description: string;
}

export interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  channel: "email" | "sms" | "portal";
  sentAt: string;
  read: boolean;
}

export interface CustomerPortalData {
  appointments: CustomerAppointment[];
  quotes: CustomerQuote[];
  invoices: CustomerInvoice[];
  locations: CustomerLocation[];
  tickets: CustomerTicket[];
  notifications: CustomerNotification[];
}

export function getCustomerPortalData(): CustomerPortalData {
  return {
    appointments: [
      {
        id: "JOB-1104",
        service: "HVAC diagnostic visit",
        status: "technician_en_route",
        scheduledFor: "2026-05-22T14:30:00",
        arrivalWindow: "2:30 PM - 3:00 PM",
        technician: {
          name: "Nora Kim",
          rating: 4.9,
          avatar: "https://i.pravatar.cc/150?img=32",
          phone: "+1 (212) 555-0184",
        },
        address: "456 Park Ave, New York, NY",
        issue: "Unit is cycling frequently and cooling unevenly.",
        estimate: 185,
        progress: 62,
      },
      {
        id: "JOB-1098",
        service: "Preventive maintenance",
        status: "completed",
        scheduledFor: "2026-05-12T10:00:00",
        arrivalWindow: "10:00 AM - 11:00 AM",
        technician: {
          name: "Ethan Brooks",
          rating: 4.8,
          avatar: "https://i.pravatar.cc/150?img=12",
          phone: "+1 (212) 555-0166",
        },
        address: "123 Main St, New York, NY",
        issue: "Seasonal maintenance and filter replacement.",
        estimate: 240,
        progress: 100,
      },
      {
        id: "JOB-1089",
        service: "Electrical troubleshooting",
        status: "awaiting_approval",
        scheduledFor: "2026-05-04T09:30:00",
        arrivalWindow: "9:30 AM - 10:30 AM",
        technician: {
          name: "Caleb Reed",
          rating: 4.7,
          avatar: "https://i.pravatar.cc/150?img=53",
          phone: "+1 (212) 555-0198",
        },
        address: "100 Central Park W, New York, NY",
        issue: "Panel upgrade quote requested after inspection.",
        estimate: 1480,
        progress: 85,
      },
    ],
    quotes: [
      {
        id: "Q-2048",
        title: "Electrical panel upgrade",
        amount: 1480,
        status: "pending",
        validUntil: "2026-06-02",
        summary: "Panel replacement, grounding cleanup, labeled circuit schedule, and safety verification.",
        lineItems: [
          { name: "Panel replacement labor", quantity: 1, price: 820 },
          { name: "Breaker kit and materials", quantity: 1, price: 510 },
          { name: "Permit and inspection prep", quantity: 1, price: 150 },
        ],
      },
      {
        id: "Q-2031",
        title: "Annual care plan",
        amount: 540,
        status: "approved",
        validUntil: "2026-12-31",
        summary: "Two preventive maintenance visits, priority scheduling, and waived diagnostic fee.",
        lineItems: [
          { name: "Spring tune-up", quantity: 1, price: 180 },
          { name: "Fall tune-up", quantity: 1, price: 180 },
          { name: "Priority care membership", quantity: 1, price: 180 },
        ],
      },
    ],
    invoices: [
      {
        id: "INV-8831",
        service: "Preventive maintenance",
        amount: 240,
        status: "paid",
        date: "2026-05-12",
      },
      {
        id: "INV-8794",
        service: "Emergency drain clearing",
        amount: 320,
        status: "paid",
        date: "2026-04-28",
      },
    ],
    locations: [
      {
        id: "loc_1",
        label: "Home",
        address: "123 Main St, New York, NY",
        type: "home",
      },
      {
        id: "loc_2",
        label: "Office",
        address: "456 Park Ave, New York, NY",
        type: "office",
      },
      {
        id: "loc_3",
        label: "Rental property",
        address: "100 Central Park W, New York, NY",
        type: "site",
      },
    ],
    tickets: [
      {
        id: "TCK-5102",
        subject: "Need weekend appointment options",
        priority: "medium",
        status: "open",
        createdAt: "2026-05-21T15:20:00",
        lastUpdate: "Dispatch is checking Saturday availability.",
        description: "Customer prefers a weekend follow-up for panel quote review.",
      },
      {
        id: "TCK-5069",
        subject: "Invoice copy request",
        priority: "low",
        status: "resolved",
        createdAt: "2026-05-13T09:10:00",
        lastUpdate: "Invoice INV-8831 was emailed and added to billing history.",
        description: "Customer requested a PDF copy for reimbursement.",
      },
    ],
    notifications: [
      {
        id: "note_1",
        title: "Technician en route",
        message: "Nora Kim is on the way for JOB-1104.",
        channel: "sms",
        sentAt: "2026-05-22T14:08:00",
        read: false,
      },
      {
        id: "note_2",
        title: "Quote ready",
        message: "Electrical panel upgrade quote Q-2048 is awaiting approval.",
        channel: "email",
        sentAt: "2026-05-21T11:40:00",
        read: false,
      },
      {
        id: "note_3",
        title: "Payment received",
        message: "Invoice INV-8831 has been paid successfully.",
        channel: "portal",
        sentAt: "2026-05-12T16:12:00",
        read: true,
      },
    ],
  };
}

export function formatCustomerPortalDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatCustomerPortalDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatCustomerPortalCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
