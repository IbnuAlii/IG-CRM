"use client";

import { ReportBuilderAndPreview } from "@/components/admin/reports/report-builder-and-preview";
import { ReportCharts } from "@/components/admin/reports/report-charts";
import { ReportFilters } from "@/components/admin/reports/report-filters";
import { ReportLibrary } from "@/components/admin/reports/report-library";
import { ReportsHero } from "@/components/admin/reports/reports-hero";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

export default function AdminReportsPage() {
  const weeklyRevenue = data.revenueTrend.reduce(
    (total, day) => total + day.revenue,
    0,
  );
  const totalJobs = data.revenueTrend.reduce((total, day) => total + day.jobs, 0);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <ReportsHero
        weeklyRevenue={weeklyRevenue}
        totalJobs={totalJobs}
        reportsCount={data.reports.length}
      />
      <ReportFilters />
      <ReportCharts data={data} weeklyRevenue={weeklyRevenue} />
      <ReportBuilderAndPreview data={data} />
      <ReportLibrary reports={data.reports} />
    </div>
  );
}
