"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AdminJob, AdminQuote } from "@/types";
import { formatQuoteDate } from "./quote-formatters";

export function QuoteWorkflowCard({
  quote,
  linkedJob,
}: {
  quote: AdminQuote;
  linkedJob?: AdminJob;
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <h2 className="font-semibold">Workflow</h2>
      <div className="mt-4 space-y-3">
        {[
          ["Created", formatQuoteDate(quote.createdAt)],
          ["Sent", quote.status === "draft" ? "Not sent" : "Email/SMS delivery tracked"],
          ["Viewed", ["viewed", "accepted", "converted"].includes(quote.status) ? "Customer opened quote" : "Waiting"],
          ["Accepted", ["accepted", "converted"].includes(quote.status) ? "Ready to convert" : "Waiting"],
          ["Converted", linkedJob ? linkedJob.jobNumber : "No linked job"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium">{label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{value}</p>
          </div>
        ))}
      </div>
      <Button className="mt-4 w-full" disabled={quote.status !== "accepted"}>
        Convert to Job
      </Button>
    </Card>
  );
}
