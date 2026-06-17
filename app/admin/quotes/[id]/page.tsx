"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { QuoteDetailHeader } from "@/components/admin/quotes/quote-detail-header";
import { QuoteDetailStats } from "@/components/admin/quotes/quote-detail-stats";
import { QuoteDocumentCard } from "@/components/admin/quotes/quote-document-card";
import { QuoteWorkflowCard } from "@/components/admin/quotes/quote-workflow-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

export default function AdminQuoteDetailPage() {
  const params = useParams<{ id: string }>();
  const quote = data.quotes.find((item) => item.id === params.id);

  if (!quote) {
    return (
      <div className="w-full py-4 md:py-6">
        <Button variant="ghost" asChild className="mb-3 -ml-3">
          <Link href="/admin/quotes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quotes
          </Link>
        </Button>
        <Card className="p-10 text-center">
          <p className="font-medium">Quote not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The selected quote does not exist in the mock Admin data.
          </p>
        </Card>
      </div>
    );
  }

  const customer = data.customers.find((item) => item.id === quote.customerId);
  const linkedJob = data.jobs.find((job) => job.quoteId === quote.id);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <QuoteDetailHeader quote={quote} />
      <QuoteDetailStats quote={quote} linkedJob={linkedJob} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <QuoteDocumentCard quote={quote} customer={customer} />
        <QuoteWorkflowCard quote={quote} linkedJob={linkedJob} />
      </div>
    </div>
  );
}
