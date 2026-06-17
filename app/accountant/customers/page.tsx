"use client";

import { Download, Mail, Phone, Search, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { AccountantActionButton } from "@/components/accountant/accountant-action-button";
import { formatAccountantDecimalCurrency, getAccountantData } from "@/components/accountant/accountant-data";
import { AccountantPageHeader } from "@/components/accountant/accountant-page-header";
import { AccountantStatCard } from "@/components/accountant/accountant-stat-card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AccountantCustomerBillingPage() {
  const { customerBilling } = getAccountantData();
  const [query, setQuery] = useState("");
  const visibleCustomers = useMemo(
    () =>
      customerBilling.filter((item) =>
        [item.customer.name, item.customer.email, item.customer.phone, item.paymentMethod]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [customerBilling, query],
  );
  const balance = customerBilling.reduce((sum, item) => sum + item.balance, 0);
  const lifetime = customerBilling.reduce((sum, item) => sum + item.lifetimeBilled, 0);

  return (
    <div className="space-y-8 py-6">
      <AccountantPageHeader
        badge="Customer billing"
        title="Customer Billing"
        description="Review customer balances, lifetime billed value, saved payment method references, and billing contact actions."
        actions={
          <AccountantActionButton variant="outline" feedbackTitle="Customer billing export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Customers
          </AccountantActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AccountantStatCard icon={UsersRound} label="Billing profiles" value={customerBilling.length} detail="Customers visible to finance" />
        <AccountantStatCard icon={UsersRound} label="Open balance" value={formatAccountantDecimalCurrency(balance)} detail="Needs payment follow-up" tone="amber" />
        <AccountantStatCard icon={UsersRound} label="Lifetime billed" value={formatAccountantDecimalCurrency(lifetime)} detail="Across visible profiles" tone="green" />
        <AccountantStatCard icon={UsersRound} label="Payment methods" value="2 types" detail="Card and ACH references" tone="purple" />
      </div>

      <Card className="border-border bg-card p-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer billing profiles..." />
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        {visibleCustomers.map((item) => (
          <Card key={item.customer.id} className="border-border bg-card p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{item.customer.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.customer.company ?? "Residential customer"}</p>
                <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-700" /> {item.customer.email}</span>
                  <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-700" /> {item.customer.phone}</span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className={item.balance > 0 ? "text-2xl font-semibold text-amber-700" : "text-2xl font-semibold text-emerald-700"}>
                  {formatAccountantDecimalCurrency(item.balance)}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 border-t border-border pt-5 md:grid-cols-3">
              <Metric label="Lifetime billed" value={formatAccountantDecimalCurrency(item.lifetimeBilled)} />
              <Metric label="Invoices" value={String(item.invoiceCount)} />
              <Metric label="Payment method" value={item.paymentMethod} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <AccountantActionButton size="sm" variant="outline" feedbackTitle="Billing statement opened">Statement</AccountantActionButton>
              <AccountantActionButton size="sm" variant="outline" feedbackTitle="Payment reminder queued">Send Reminder</AccountantActionButton>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}
