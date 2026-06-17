"use client";

import { useState } from "react";
import {
  CalendarPlus,
  Camera,
  CheckCircle,
  Clock3,
  FileCheck,
  IdCard,
  Mail,
  Phone,
  Shield,
  Truck,
  User,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { TechnicianActionButton } from "@/components/driver/technician-action-button";
import { TechnicianPageHeader } from "@/components/driver/technician-page-header";
import {
  getTechnicianData,
  technicianDocuments,
  technicianLeaveBalances,
  technicianProfile,
  technicianTimeLog,
} from "@/components/driver/technician-utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function TechnicianProfilePage() {
  const { user } = useAuth();
  const { technician } = getTechnicianData();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1760px] space-y-8 px-4 py-6 2xl:px-8">
      <TechnicianPageHeader
        badge="Employee profile"
        title="Technician Profile"
        description="Manage personal contact details, service skills, certifications, assigned vehicle, and leave requests."
        actions={
          <TechnicianActionButton
            variant={isEditing ? "default" : "outline"}
            className={isEditing ? "bg-blue-600 hover:bg-blue-700" : ""}
            feedbackTitle={isEditing ? "Profile changes saved" : "Profile edit enabled"}
            onClick={() => setIsEditing((value) => !value)}
          >
            <User className="mr-2 h-4 w-4" />
            {isEditing ? "Save Profile" : "Edit Profile"}
          </TechnicianActionButton>
        }
      />

      <Card className="border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="relative">
            <img
              src={user?.avatar || "https://i.pravatar.cc/150?img=12"}
              alt={user?.name || "Technician"}
              className="h-28 w-28 rounded-full object-cover"
            />
            <div className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-white">
              <Camera className="h-4 w-4" />
            </div>
          </div>
          <div>
            <Badge className="mb-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              Active field technician
            </Badge>
            <h2 className="text-3xl font-semibold text-foreground">
              {technician?.name || user?.name || "Ethan Brooks"}
            </h2>
            <p className="mt-1 text-muted-foreground">{technicianProfile.title}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {technician?.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  <Wrench className="mr-1 h-3.5 w-3.5" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-2 text-sm">
            <ProfileMeta icon={IdCard} label="Employee ID" value={technicianProfile.employeeId} />
            <ProfileMeta icon={Truck} label="Vehicle" value={technicianProfile.vehicle} />
            <ProfileMeta icon={Shield} label="Status" value="GPS and attendance active" />
          </div>
        </div>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 overflow-hidden rounded-lg border border-border bg-card p-0 shadow-sm md:grid-cols-4">
          {[
            ["personal", "Personal"],
            ["skills", "Skills & Docs"],
            ["leave", "Leave"],
            ["security", "Security"],
          ].map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-12 cursor-pointer rounded-none border-0 border-b-2 border-transparent bg-card shadow-none hover:bg-blue-50 hover:text-blue-700 data-[state=active]:border-blue-600 data-[state=active]:bg-card data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
            <Card className="border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field label="Full name" value={technician?.name || user?.name || "Ethan Brooks"} disabled={!isEditing} />
                <Field label="Email" value={technician?.email || user?.email || technicianProfile.email} disabled={!isEditing} />
                <Field label="Phone" value={technician?.phone || user?.phone || technicianProfile.phone} disabled={!isEditing} />
                <Field label="Current location" value={technician?.currentLocation || technicianProfile.location} disabled />
                <Field label="Home base" value={technicianProfile.homeBase} disabled />
                <Field label="Shift" value={technicianProfile.shift} disabled />
              </div>
            </Card>

            <Card className="border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">Emergency & Vehicle</h2>
              <div className="mt-6 space-y-4">
                <Field label="Emergency contact" value={technicianProfile.emergencyContact} disabled={!isEditing} />
                <Field label="Assigned vehicle" value={technicianProfile.vehicle} disabled />
                <Field label="License plate" value={technicianProfile.licensePlate} disabled />
                <Textarea defaultValue="Prefers text updates for non-urgent dispatch messages." disabled={!isEditing} />
              </div>
            </Card>
          </div>

          <Card className="border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-blue-700" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Attendance History</h2>
                <p className="text-sm text-muted-foreground">Clock events, GPS verification, and field activity captured for payroll.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <AttendanceMetric label="Clock in" value="7:54 AM" />
              <AttendanceMetric label="Worked today" value="6h 18m" />
              <AttendanceMetric label="Overtime week" value="1h 20m" />
              <AttendanceMetric label="GPS checks" value="4 verified" />
            </div>
            <div className="mt-5 grid gap-3">
              {technicianTimeLog.map((item) => (
                <div key={item.label} className="grid gap-2 rounded-lg border border-border p-4 md:grid-cols-[140px_1fr] md:items-center">
                  <div>
                    <p className="font-semibold text-foreground">{item.time}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card className="border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Skills & Certifications</h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {technicianDocuments.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">Expires {doc.expires}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    <CheckCircle className="mr-1 h-3.5 w-3.5" />
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <Card className="border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">Leave Balance</h2>
              <div className="mt-5 grid gap-3">
                {technicianLeaveBalances.map((balance) => (
                  <div key={balance.label} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <span className="text-muted-foreground">{balance.label}</span>
                    <span className="font-semibold text-foreground">{balance.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">Request Leave</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field label="Leave type" value="Vacation" disabled={false} />
                <Field label="Start date" value="2026-06-04" disabled={false} />
                <Field label="End date" value="2026-06-05" disabled={false} />
                <Field label="Manager" value="Sofia Bennett" disabled />
              </div>
              <Textarea className="mt-5" placeholder="Add notes for manager review" />
              <TechnicianActionButton className="mt-5 bg-blue-600 hover:bg-blue-700" feedbackTitle="Leave request submitted">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Submit Leave Request
              </TechnicianActionButton>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Account Security</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <SecurityItem label="Password" value="Changed 30 days ago" />
              <SecurityItem label="Two-factor authentication" value="Enabled" />
              <SecurityItem label="Active sessions" value="2 devices" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value, disabled }: { label: string; value: string; disabled: boolean }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <Input value={value} readOnly disabled={disabled} />
    </div>
  );
}

function ProfileMeta({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <Icon className="h-4 w-4 text-blue-700" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function SecurityItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <Shield className="mb-3 h-5 w-5 text-blue-700" />
      <p className="font-semibold text-foreground">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{value}</p>
    </div>
  );
}

function AttendanceMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
