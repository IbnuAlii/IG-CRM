import { generateAdminDashboardData } from "@/lib/mock-data";
import {
  buildHRAttendanceRecords,
  buildHREmployeeRecords,
  buildHRPayrollPeriods,
  buildHRPayrollRecords,
} from "@/components/hr/hr-data";
import type { AdminCustomerRecord, AdminJob, AdminQuote } from "@/types";

export type AccountantInvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";
export type AccountantPaymentMethod = "card" | "ach" | "check" | "wire";

export interface AccountantInvoice {
  id: string;
  customerId: string;
  customerName: string;
  jobNumber: string;
  service: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: AccountantInvoiceStatus;
  method: AccountantPaymentMethod;
}

export interface AccountantPayment {
  id: string;
  invoiceId: string;
  customerName: string;
  paidAt: string;
  amount: number;
  method: AccountantPaymentMethod;
  status: "settled" | "processing" | "failed" | "refunded";
  reference: string;
}

export interface AccountantFinancialReport {
  id: string;
  name: string;
  category: "cash_flow" | "revenue" | "expense" | "payroll" | "tax";
  period: string;
  owner: string;
  lastRunAt: string;
  status: "ready" | "scheduled" | "draft";
}

export interface AccountantCustomerBilling {
  customer: AdminCustomerRecord;
  balance: number;
  lifetimeBilled: number;
  lastPaymentAt: string;
  paymentMethod: string;
  invoiceCount: number;
}

const dateForIndex = (index: number) => {
  const dates = ["2026-05-22", "2026-05-18", "2026-05-12", "2026-05-04", "2026-04-28"];
  return dates[index % dates.length];
};

function buildInvoices(jobs: AdminJob[], quotes: AdminQuote[]): AccountantInvoice[] {
  return jobs.slice(0, 8).map((job, index) => {
    const quote = quotes.find((item) => item.id === job.quoteId);
    const amount = quote?.total ?? 185 + index * 135;
    const tax = amount * 0.0825;
    const status: AccountantInvoiceStatus =
      index === 0 ? "sent" : index === 1 ? "paid" : index === 2 ? "overdue" : index === 3 ? "draft" : "paid";

    return {
      id: `INV-2026-${String(510 + index).padStart(4, "0")}`,
      customerId: job.customerId,
      customerName: job.customerName,
      jobNumber: job.jobNumber,
      service: job.serviceType,
      issueDate: dateForIndex(index),
      dueDate: index === 2 ? "2026-05-20" : "2026-06-05",
      amount,
      tax,
      total: amount + tax,
      status,
      method: index % 3 === 0 ? "ach" : index % 3 === 1 ? "card" : "check",
    };
  });
}

function buildPayments(invoices: AccountantInvoice[]): AccountantPayment[] {
  return invoices
    .filter((invoice) => invoice.status === "paid" || invoice.status === "overdue")
    .map((invoice, index) => ({
      id: `PAY-${String(9000 + index)}`,
      invoiceId: invoice.id,
      customerName: invoice.customerName,
      paidAt: invoice.status === "paid" ? dateForIndex(index + 1) : "Pending",
      amount: invoice.status === "paid" ? invoice.total : 0,
      method: invoice.method,
      status: invoice.status === "paid" ? "settled" : "failed",
      reference: invoice.status === "paid" ? `stripe_${invoice.id.toLowerCase()}` : "retry-required",
    }));
}

function buildReports(): AccountantFinancialReport[] {
  return [
    {
      id: "fin-report-1",
      name: "Revenue vs expense",
      category: "revenue",
      period: "May 2026",
      owner: "Finance",
      lastRunAt: "2026-05-22 09:20 AM",
      status: "ready",
    },
    {
      id: "fin-report-2",
      name: "Cash flow forecast",
      category: "cash_flow",
      period: "Next 30 days",
      owner: "Finance",
      lastRunAt: "2026-05-21 04:10 PM",
      status: "scheduled",
    },
    {
      id: "fin-report-3",
      name: "Payroll tax summary",
      category: "tax",
      period: "May 18 - May 31, 2026",
      owner: "Payroll",
      lastRunAt: "2026-05-21 02:45 PM",
      status: "ready",
    },
    {
      id: "fin-report-4",
      name: "Department labor cost",
      category: "payroll",
      period: "Current pay period",
      owner: "Payroll",
      lastRunAt: "Draft",
      status: "draft",
    },
  ];
}

export function getAccountantData() {
  const adminData = generateAdminDashboardData();
  const employees = buildHREmployeeRecords(adminData.employees);
  const attendanceRecords = buildHRAttendanceRecords(employees);
  const payrollPeriods = buildHRPayrollPeriods();
  const payrollPeriod = payrollPeriods[0];
  const payrollRecords = buildHRPayrollRecords({
    employees,
    attendanceRecords,
    period: payrollPeriod,
  });
  const invoices = buildInvoices(adminData.jobs, adminData.quotes);
  const payments = buildPayments(invoices);
  const reports = buildReports();
  const customerBilling: AccountantCustomerBilling[] = adminData.customers.slice(0, 6).map((customer, index) => {
    const customerInvoices = invoices.filter((invoice) => invoice.customerId === customer.id);
    const lifetimeBilled = customerInvoices.reduce((sum, invoice) => sum + invoice.total, 0) || customer.lifetimeValue;
    const balance = customerInvoices
      .filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.total, 0);

    return {
      customer,
      balance,
      lifetimeBilled,
      lastPaymentAt: dateForIndex(index + 2),
      paymentMethod: index % 2 === 0 ? "Visa 4242" : "ACH ending 7731",
      invoiceCount: Math.max(1, customerInvoices.length),
    };
  });

  return {
    adminData,
    employees,
    attendanceRecords,
    payrollPeriods,
    payrollPeriod,
    payrollRecords,
    invoices,
    payments,
    reports,
    customerBilling,
  };
}

export function formatAccountantCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatAccountantDecimalCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function getInvoiceStatusLabel(status: AccountantInvoiceStatus) {
  const labels: Record<AccountantInvoiceStatus, string> = {
    draft: "Draft",
    sent: "Sent",
    paid: "Paid",
    overdue: "Overdue",
    void: "Void",
  };

  return labels[status];
}
