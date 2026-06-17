"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AdminCustomerRecord } from "@/types";

export function CustomerProfileCard({
  customer,
}: {
  customer: AdminCustomerRecord;
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <h2 className="font-semibold">Profile</h2>
      <div className="mt-4 space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-muted-foreground">{customer.phone}</p>
          </div>
        </div>
        <Separator />
        {customer.addresses.map((address) => (
          <div key={address.id} className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{address.label}</p>
              <p className="text-muted-foreground">
                {address.address}, {address.city}, {address.state}
              </p>
            </div>
          </div>
        ))}
        <Separator />
        <div>
          <p className="font-medium">Notes</p>
          <p className="mt-1 text-muted-foreground">{customer.notes}</p>
        </div>
      </div>
    </Card>
  );
}
