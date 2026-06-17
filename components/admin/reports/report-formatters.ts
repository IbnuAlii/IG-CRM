import type { AdminReport } from "@/types";

export const reportCategoryLabels: Record<AdminReport["category"], string> = {
  revenue: "Revenue",
  operations: "Operations",
  customers: "Customers",
  workforce: "Workforce",
  finance: "Finance",
};

export const reportCategoryColors: Record<AdminReport["category"], string> = {
  revenue: "#10b981",
  operations: "#2563eb",
  customers: "#06b6d4",
  workforce: "#f59e0b",
  finance: "#8b5cf6",
};

export function formatReportDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatReportCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
