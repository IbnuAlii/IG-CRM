"use client";

import { Download, Search, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { ManagerActionButton } from "@/components/manager/manager-action-button";
import { formatDate, formatManagerCurrency, getManagerData } from "@/components/manager/manager-data";
import { ManagerPageHeader } from "@/components/manager/manager-page-header";
import { ManagerStatCard } from "@/components/manager/manager-stat-card";
import { ManagerStatusBadge } from "@/components/manager/manager-status-badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminCustomerRecord } from "@/types";

export default function ManagerCustomersPage() {
  const { adminData } = getManagerData();
  const [query, setQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomerRecord | null>(null);
  const [dialogMode, setDialogMode] = useState<"profile" | "follow-up">("profile");
  const visibleCustomers = useMemo(
    () =>
      adminData.customers.filter((customer) =>
        [customer.name, customer.company ?? "", customer.email, customer.phone, customer.status, customer.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [adminData.customers, query],
  );
  const openJobs = adminData.customers.reduce((sum, customer) => sum + customer.openJobs, 0);
  const lifetimeValue = adminData.customers.reduce((sum, customer) => sum + customer.lifetimeValue, 0);

  return (
    <div className="space-y-8 py-6">
      <ManagerPageHeader
        badge="Customer information"
        title="Customers"
        description="View customer profiles, service context, open job counts, account value, and recent activity for manager follow-up."
        actions={
          <ManagerActionButton variant="outline" feedbackTitle="Customer overview export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Customers
          </ManagerActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerStatCard icon={UsersRound} label="Customers" value={adminData.customers.length} detail="Visible department records" />
        <ManagerStatCard icon={UsersRound} label="Open jobs" value={openJobs} detail="Across customer accounts" tone="amber" />
        <ManagerStatCard icon={UsersRound} label="Lifetime value" value={formatManagerCurrency(lifetimeValue)} detail="Manager-visible summary" tone="green" />
        <ManagerStatCard icon={UsersRound} label="VIP / active" value={adminData.customers.filter((customer) => customer.status === "vip" || customer.status === "active").length} detail="Priority accounts" tone="purple" />
      </div>

      <Card className="border-border bg-card p-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer, company, email, phone, status, or tag..." />
        </div>
      </Card>

      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-sm">
            <thead className="border-b border-border bg-muted text-left text-muted-foreground">
              <tr>
                {["Customer", "Contact", "Primary address", "Status", "Open jobs", "Lifetime value", "Last service", "Actions"].map((header) => (
                  <th key={header} className="px-4 py-3 font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleCustomers.slice(0, 12).map((customer) => {
                const primaryAddress = customer.addresses.find((address) => address.isPrimary) ?? customer.addresses[0];

                return (
                  <tr key={customer.id}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-foreground">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.company ?? customer.tags.join(", ")}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p>{customer.email}</p>
                      <p className="text-xs text-muted-foreground">{customer.phone}</p>
                    </td>
                    <td className="px-4 py-4">{primaryAddress ? `${primaryAddress.address}, ${primaryAddress.city}` : "No address"}</td>
                    <td className="px-4 py-4"><ManagerStatusBadge status={customer.status === "inactive" ? "inactive" : "active"} /></td>
                    <td className="px-4 py-4">{customer.openJobs}</td>
                    <td className="px-4 py-4 font-semibold">{formatManagerCurrency(customer.lifetimeValue)}</td>
                    <td className="px-4 py-4">{customer.lastServiceAt ? formatDate(customer.lastServiceAt) : "Not serviced"}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <ManagerActionButton
                          size="sm"
                          variant="outline"
                          feedbackTitle="Customer profile opened"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setDialogMode("profile");
                          }}
                        >
                          Profile
                        </ManagerActionButton>
                        <ManagerActionButton
                          size="sm"
                          variant="outline"
                          feedbackTitle="Customer follow-up opened"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setDialogMode("follow-up");
                          }}
                        >
                          Follow up
                        </ManagerActionButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={Boolean(selectedCustomer)} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === "profile" ? "Customer Profile" : "Customer Follow-Up"}</DialogTitle>
            <DialogDescription>
              {selectedCustomer?.name} / {selectedCustomer?.email}
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer ? (
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <CustomerMetric label="Status" value={selectedCustomer.status} />
                <CustomerMetric label="Open jobs" value={String(selectedCustomer.openJobs)} />
                <CustomerMetric label="Lifetime value" value={formatManagerCurrency(selectedCustomer.lifetimeValue)} />
              </div>
              {dialogMode === "profile" ? (
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium text-foreground">Recent activity</p>
                  <div className="mt-3 space-y-3">
                    {selectedCustomer.activity.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="rounded-lg bg-muted p-3">
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Textarea className="min-h-36" placeholder="Add manager follow-up note, owner, and next step..." />
              )}
            </div>
          ) : null}
          <DialogFooter>
            <ManagerActionButton variant="outline" feedbackTitle="Customer dialog closed" onClick={() => setSelectedCustomer(null)}>Close</ManagerActionButton>
            <ManagerActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle={dialogMode === "profile" ? "Customer review saved" : "Follow-up saved"}>
              {dialogMode === "profile" ? "Mark Reviewed" : "Save Follow-Up"}
            </ManagerActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CustomerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold capitalize text-foreground">{value}</p>
    </div>
  );
}
