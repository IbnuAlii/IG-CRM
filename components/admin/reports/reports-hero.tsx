"use client";

import {
  BarChart3,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  LineChart,
  Mail,
  Save,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatReportCurrency } from "./report-formatters";
import { ReportInsightCard } from "./report-insight-card";

export function ReportsHero({
  weeklyRevenue,
  totalJobs,
  reportsCount,
}: {
  weeklyRevenue: number;
  totalJobs: number;
  reportsCount: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-border/70 bg-card p-5 shadow-sm md:p-6">
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="gap-1.5 bg-green-600 text-white hover:bg-green-600">
              {/* <Sparkles className="h-3.5 w-3.5" /> */}
              Reports & Analytics
            </Badge>
            <Badge variant="outline" className="gap-1.5 bg-background/80">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              CSV-ready library
            </Badge>
            <Badge variant="outline" className="gap-1.5 bg-background/80">
              <Mail className="h-3.5 w-3.5" />
              Scheduled delivery mock
            </Badge>
          </div>
          <h1 className="max-w-4xl text-3xl font-semibold md:text-5xl">
            Generate revenue, operations, customer, workforce, and financial
            reports.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
            Review predefined reports, build custom reports, and prepare CSV,
            PDF, Excel, print, or scheduled email outputs described in the
            requirements.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Report
          </Button>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ReportInsightCard
          label="Weekly Revenue"
          value={formatReportCurrency(weeklyRevenue)}
          detail="+9.4% from prior period"
          icon={LineChart}
          tone="green"
        />
        <ReportInsightCard
          label="Job Volume"
          value={totalJobs}
          detail="Scheduled and completed work"
          icon={BarChart3}
          tone="blue"
        />
        <ReportInsightCard
          label="Quote Conversion"
          value="42%"
          detail="Accepted quotes to jobs"
          icon={CheckCircle2}
          tone="amber"
        />
        <ReportInsightCard
          label="Saved Reports"
          value={reportsCount}
          detail="Standard and custom library"
          icon={FileSpreadsheet}
          tone="violet"
        />
      </div>
    </section>
  );
}
