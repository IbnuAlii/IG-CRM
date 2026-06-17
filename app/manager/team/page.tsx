"use client";

import { Download, Search, Star, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { ManagerActionButton } from "@/components/manager/manager-action-button";
import { getManagerData } from "@/components/manager/manager-data";
import { ManagerPageHeader } from "@/components/manager/manager-page-header";
import { ManagerStatCard } from "@/components/manager/manager-stat-card";
import { ManagerStatusBadge } from "@/components/manager/manager-status-badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function ManagerTeamPage() {
  const { teamMembers } = getManagerData();
  const [query, setQuery] = useState("");
  const filteredMembers = useMemo(
    () =>
      teamMembers.filter((member) =>
        [member.name, member.email, member.role, member.skills.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, teamMembers],
  );
  const avgUtilization = Math.round(teamMembers.reduce((sum, member) => sum + member.utilization, 0) / teamMembers.length);
  const coachingActions = teamMembers.reduce((sum, member) => sum + member.openActions, 0);

  return (
    <div className="space-y-8 py-6">
      <ManagerPageHeader
        badge="Team performance"
        title="Team"
        description="Review team capacity, utilization, performance scores, ratings, skills, and coaching actions."
        actions={
          <ManagerActionButton variant="outline" feedbackTitle="Team performance export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Team
          </ManagerActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerStatCard icon={UsersRound} label="Team size" value={teamMembers.length} detail="Managers, dispatchers, technicians" />
        <ManagerStatCard icon={Star} label="Avg rating" value={(teamMembers.reduce((sum, member) => sum + member.rating, 0) / teamMembers.length).toFixed(1)} detail="Customer service quality" tone="green" />
        <ManagerStatCard icon={UsersRound} label="Utilization" value={`${avgUtilization}%`} detail="Scheduled vs capacity" tone="purple" />
        <ManagerStatCard icon={UsersRound} label="Open actions" value={coachingActions} detail="Coaching and follow-up" tone="amber" />
      </div>

      <Card className="border-border bg-card p-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search team member, role, email, or skill..." />
        </div>
      </Card>

      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="border-b border-border bg-muted text-left text-muted-foreground">
              <tr>
                {["Member", "Role", "Skills", "Capacity", "Utilization", "Completed", "Rating", "Performance", "Actions"].map((header) => (
                  <th key={header} className="px-4 py-3 font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </td>
                  <td className="px-4 py-4 capitalize">{member.role.replace("_", " ")}</td>
                  <td className="px-4 py-4">{member.skills.slice(0, 3).join(", ")}</td>
                  <td className="px-4 py-4">{member.scheduledHours}/{member.capacityHours} hrs</td>
                  <td className="px-4 py-4">
                    <div className="flex min-w-36 items-center gap-3">
                      <Progress value={member.utilization} className="h-2" />
                      <span className="w-10 font-medium">{member.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">{member.jobsCompleted}</td>
                  <td className="px-4 py-4">{member.rating.toFixed(1)}</td>
                  <td className="px-4 py-4 font-semibold">{member.performanceScore}%</td>
                  <td className="px-4 py-4">
                    <ManagerStatusBadge status={member.openActions > 0 ? "pending" : "active"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
