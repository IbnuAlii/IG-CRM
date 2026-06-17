"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { QuoteFilters } from "@/components/admin/quotes/quote-filters";
import { QuoteRegister } from "@/components/admin/quotes/quote-register";
import { QuoteStats } from "@/components/admin/quotes/quote-stats";
import { QuoteWorkflowDialog } from "@/components/admin/quotes/quote-workflow-dialog";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";
import type { AdminQuote } from "@/types";

const data = generateAdminDashboardData();

export default function AdminQuotesPage() {
  const [status, setStatus] = useState("all");
  const [dialogMode, setDialogMode] = useState<"create" | "send" | "convert">("create");
  const [selectedQuote, setSelectedQuote] = useState<AdminQuote | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const quotes = data.quotes;
  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => status === "all" || quote.status === status);
  }, [quotes, status]);

  const openQuoteDialog = (
    quote: AdminQuote,
    mode: "send" | "convert",
  ) => {
    setDialogMode(mode);
    setSelectedQuote(quote);
  };

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Quotes"
        description="Create branded estimates, track customer approval, and convert accepted quotes into schedulable jobs."
        actions={
          <Button
            onClick={() => {
              setDialogMode("create");
              setCreateOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Quote
          </Button>
        }
      />

      <QuoteStats quotes={quotes} />
      <QuoteFilters status={status} setStatus={setStatus} />
      <QuoteRegister
        quotes={filteredQuotes}
        onSend={(quote) => openQuoteDialog(quote, "send")}
        onConvert={(quote) => openQuoteDialog(quote, "convert")}
      />

      <QuoteWorkflowDialog
        quote={selectedQuote}
        mode={dialogMode}
        open={!!selectedQuote}
        onClose={() => {
          setSelectedQuote(null);
        }}
      />
      {createOpen ? (
        <QuoteWorkflowDialog
          quote={null}
          mode="create"
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      ) : null}
    </div>
  );
}
