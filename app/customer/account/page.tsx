"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileText,
  Globe,
  Grid2X2,
  Headphones,
  Home,
  Info,
  KeyRound,
  Laptop,
  Link as LinkIcon,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Monitor,
  Moon,
  MoreHorizontal,
  PenLine,
  Phone,
  Plus,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Trash2,
  User,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { CustomerActionButton } from "@/components/customer/customer-action-button";
import { customerTones } from "@/components/customer/customer-tones";
import {
  formatCustomerPortalCurrency,
  getCustomerPortalData,
} from "@/components/customer/customer-data";

const data = getCustomerPortalData();

const paymentRows = [
  ["May 15, 2024", "INV-2024-0515", "Managed Backup - Monthly", "$129.00", "Paid"],
  ["Apr 15, 2024", "INV-2024-0415", "Managed Backup - Monthly", "$129.00", "Paid"],
  ["Mar 15, 2024", "INV-2024-0315", "Managed Backup - Monthly", "$129.00", "Paid"],
  ["Feb 15, 2024", "INV-2024-0215", "Managed Backup - Monthly", "$129.00", "Paid"],
  ["Jan 15, 2024", "INV-2024-0115", "Managed Backup - Monthly", "$129.00", "Processing"],
];

const siteRows = [
  {
    label: "Home",
    badge: "Default",
    address: "123 Main St\nNew York, NY 10001",
    access: "Weekdays 9AM - 5PM",
    lastService: "May 12, 2024",
    status: "Active",
    icon: Home,
    tone: customerTones.icon.blue,
  },
  {
    label: "Office",
    badge: "Office",
    address: "456 Park Ave\nNew York, NY 10022",
    access: "Weekdays 8AM - 6PM",
    lastService: "Apr 28, 2024",
    status: "Active",
    icon: Building2,
    tone: customerTones.icon.emerald,
  },
  {
    label: "Rental Property",
    badge: "Other",
    address: "100 Central Park W\nNew York, NY 10023",
    access: "Weekends 10AM - 4PM",
    lastService: "Mar 15, 2024",
    status: "Inactive",
    icon: Home,
    tone: customerTones.icon.violet,
  },
];

export default function AccountPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={customerTones.page}>
      <div className="mx-auto w-full max-w-[1760px] space-y-6 px-4 py-4 2xl:px-8">
        <Card className="border-border bg-card p-7 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={user?.avatar || "https://i.pravatar.cc/150?img=0"}
                  alt={user?.name || "Demo User"}
                  className="h-28 w-28 rounded-full object-cover"
                />
                <div className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white">
                  <Camera className="h-4 w-4" />
                </div>
              </div>
              <div>
                <Badge className={`mb-3 ${customerTones.badge.success}`}>
                  Verified Customer
                </Badge>
                <h1 className="text-4xl font-semibold tracking-normal text-foreground">
                  {user?.name || "Demo User"}
                </h1>
                <p className="mt-2 text-base text-muted-foreground">
                  Manage your profile, payment methods, and account security.
                </p>
              </div>
            </div>
            <AccountMeta icon={Calendar} label="Member since" value="May 10, 2024" />
            <AccountMeta icon={ShieldCheck} label="Customer ID" value="CUST-2024-15678" />
            <CustomerActionButton
              variant="outline"
              className={customerTones.outlineAction}
              feedbackTitle="Profile edit mode updated"
              onClick={() => setIsEditing(!isEditing)}
            >
              <PenLine className="mr-2 h-4 w-4" />
              {isEditing ? "Save Profile" : "Edit Profile"}
            </CustomerActionButton>
          </div>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 overflow-hidden rounded-lg border border-border bg-card p-0 shadow-sm md:grid-cols-5">
            {[
              ["profile", "Profile", User],
              ["payments", "Payments", CreditCard],
              ["sites", "Sites", MapPin],
              ["preferences", "Preferences", Grid2X2],
              ["security", "Security", LockKeyhole],
            ].map(([value, label, Icon]) => {
              const IconComponent = Icon as LucideIcon;
              return (
                <TabsTrigger
                  key={value as string}
                  value={value as string}
                  className={customerTones.tabActive}
                >
                  <IconComponent className="h-4 w-4" />
                  {label as string}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="profile" className="space-y-8">
            <ProfileTab isEditing={isEditing} userName={user?.name} userEmail={user?.email} />
          </TabsContent>
          <TabsContent value="payments" className="space-y-8">
            <PaymentsTab />
          </TabsContent>
          <TabsContent value="sites" className="space-y-8">
            <SitesTab />
          </TabsContent>
          <TabsContent value="preferences" className="space-y-8">
            <PreferencesTab />
          </TabsContent>
          <TabsContent value="security" className="space-y-8">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProfileTab({
  isEditing,
  userName,
  userEmail,
}: {
  isEditing: boolean;
  userName?: string;
  userEmail?: string;
}) {
  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border bg-card p-7 shadow-sm">
          <SectionHeader
            icon={User}
            title="Personal Information"
            description="Your personal details and contact information."
          />
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <VerifiedInput label="Full name" value={userName || "Demo User"} disabled={!isEditing} />
            <VerifiedInput label="Email" value={userEmail || "abukarmacalin08@gmail.com"} disabled={!isEditing} />
            <VerifiedInput label="Phone" value="+1 (212) 555-0173" disabled={!isEditing} />
            <SelectField label="Preferred contact method" value="Email" />
          </div>
        </Card>
        <Card className="border-border bg-card p-7 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Additional Information</h2>
          <div className="mt-6 grid gap-5">
            <PlainInput icon={Calendar} label="Date of birth" value="May 10, 1990" />
            <SelectField label="Time zone" value="(GMT-05:00) Eastern Time (US & Canada)" />
            <SelectField label="Language" value="English (US)" />
          </div>
        </Card>
      </div>
      <QuickAccountActions />
    </>
  );
}

function PaymentsTab() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={CreditCard} label="Total paid" value="$2,856.00" detail="All time" tone="green" />
        <MetricCard icon={CreditCard} label="Outstanding balance" value="$129.00" detail="Due by Jun 15, 2024" tone="orange" />
        <MetricCard icon={CreditCard} label="Saved methods" value="2" detail="1 default" tone="blue" />
        <MetricCard icon={RefreshCw} label="Autopay status" value="Enabled" detail="Next charge on Jun 15, 2024" tone="green" arrow />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="space-y-6">
          <Card className="border-border bg-card p-7 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <SectionHeader icon={CreditCard} title="Payment methods" description="Manage your saved payment methods." compact />
              <CustomerActionButton variant="outline" className={customerTones.outlineAction} feedbackTitle="Payment method setup opened">
                <Plus className="mr-2 h-4 w-4" />
                Add payment method
              </CustomerActionButton>
            </div>
            <PaymentMethodRow brand="VISA" title="Visa •••• 4242" expires="Expires 06/27" isDefault />
            <PaymentMethodRow brand="MC" title="Mastercard •••• 8888" expires="Expires 11/26" />
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <LockKeyhole className="h-4 w-4" />
              Your payment information is encrypted and secure.
            </p>
          </Card>

          <Card className="overflow-hidden border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-start sm:justify-between">
              <SectionHeader icon={ReceiptText} title="Recent payments & invoices" description="View your recent transactions and download receipts." compact />
              <CustomerActionButton variant="outline" className={customerTones.outlineAction} feedbackTitle="Invoices opened">
                View all invoices
              </CustomerActionButton>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-muted-foreground">
                  <tr>
                    {["Date", "Invoice / Reference", "Description", "Amount", "Status", "Actions"].map((header) => (
                      <th key={header} className="px-5 py-3 font-medium">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paymentRows.map((row) => (
                    <tr key={row[1]}>
                      <td className="px-5 py-3 font-medium text-foreground">{row[0]}</td>
                      <td className="px-5 py-3 text-foreground">{row[1]}</td>
                      <td className="px-5 py-3 text-foreground">{row[2]}</td>
                      <td className="px-5 py-3 font-medium text-foreground">{row[3]}</td>
                      <td className="px-5 py-3">
                        <Badge className={row[4] === "Paid" ? customerTones.badge.success : customerTones.badge.info}>
                          {row[4]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-3 text-blue-700">
                          <CustomerActionButton variant="link" className={`h-auto px-0 ${customerTones.link}`} feedbackTitle="Receipt prepared">
                            Download receipt
                          </CustomerActionButton>
                          <CustomerActionButton variant="link" className={`h-auto px-0 ${customerTones.link}`} feedbackTitle="Invoice opened">
                            View invoice
                          </CustomerActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-border py-4 text-center text-sm text-muted-foreground">
              Showing 5 of 12 transactions
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border bg-card p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <SectionHeader icon={MapPin} title="Billing address" description="" compact />
              <CustomerActionButton variant="link" className={`h-auto px-0 ${customerTones.link}`} feedbackTitle="Billing address edit opened">
                Edit
              </CustomerActionButton>
            </div>
            <div className="mt-4 space-y-1 text-sm leading-6 text-foreground">
              <p>Demo User</p>
              <p>1234 Innovation Drive, Suite 500</p>
              <p>Austin, TX 78701</p>
              <p>United States</p>
              <p className="pt-2">(512) 555-0173</p>
            </div>
          </Card>

          <Card className="border-border bg-card p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <SectionHeader icon={RefreshCw} title="Autopay & billing preferences" description="" compact />
              <Switch defaultChecked />
            </div>
            <p className="mt-4 font-semibold text-emerald-700">Autopay is enabled</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We&apos;ll automatically charge your default payment method for recurring invoices and any outstanding balance.
            </p>
          </Card>

          <Card className="border-border bg-card p-7 shadow-sm">
            <SectionHeader icon={ShieldCheck} title="Secure payments, always" description="" compact />
            <div className="mt-5 space-y-3">
              {[
                "All transactions are encrypted using 256-bit SSL",
                "We never store your full card details",
                "PCI DSS compliant infrastructure",
              ].map((item) => (
                <p key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </p>
              ))}
            </div>
            <div className="mt-6">
              <p className="font-semibold text-foreground">Need help with a payment?</p>
              <p className="text-sm text-muted-foreground">Our support team is here to help.</p>
              <CustomerActionButton className="mt-3" variant="outline" feedbackTitle="Support opened">
                <Headphones className="mr-2 h-4 w-4" />
                Contact Support
              </CustomerActionButton>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function SitesTab() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={MapPin} label="Total saved sites" value="3" detail="Across all locations" tone="blue" />
        <MetricCard icon={Home} label="Default site" value="Home" detail="Primary address" tone="green" />
        <MetricCard icon={Building2} label="Active service locations" value="2" detail="Receiving service" tone="purple" />
        <MetricCard icon={FileText} label="Saved access notes" value="3" detail="Across your sites" tone="orange" />
        <Card className="hidden xl:block border-transparent bg-transparent shadow-none" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.7fr]">
        <Card className="border-border bg-card p-7 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Saved Service Sites</h2>
              <p className="text-sm text-muted-foreground">Manage your saved locations for faster service scheduling.</p>
            </div>
            <CustomerActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="New site form opened">
              <Plus className="mr-2 h-4 w-4" />
              Add New Site
            </CustomerActionButton>
          </div>
          <div className="space-y-3">
            {siteRows.map((site, index) => {
              const Icon = site.icon;
              return (
                <div key={site.label} className={index === 0 ? "rounded-lg border border-blue-200 border-l-4 border-l-blue-600 p-5" : "rounded-lg border border-border p-5"}>
                  <div className="grid gap-4 xl:grid-cols-[1fr_220px_180px_auto] xl:items-center">
                    <div className="flex gap-4">
                      <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-lg ${site.tone}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-foreground">{site.label}</h3>
                          <Badge variant="outline">{site.badge}</Badge>
                        </div>
                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-muted-foreground">{site.address}</p>
                      </div>
                    </div>
                    <SiteInfo icon={Clock} label="Preferred access" value={site.access} />
                    <SiteInfo icon={Calendar} label="Last service" value={site.lastService} />
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={site.status === "Active" ? customerTones.badge.success : "bg-muted text-muted-foreground hover:bg-muted"}>
                        {site.status}
                      </Badge>
                      <CustomerActionButton variant="link" className={`h-auto px-0 ${customerTones.link}`} feedbackTitle={`${site.label} edit opened`}>
                        <PenLine className="mr-1 h-4 w-4" />
                        Edit
                      </CustomerActionButton>
                      <CustomerActionButton variant="link" className={`h-auto px-0 ${customerTones.link}`} feedbackTitle={`${site.label} details opened`}>
                        <Eye className="mr-1 h-4 w-4" />
                        View Details
                      </CustomerActionButton>
                      <CustomerActionButton variant="link" className={`h-auto px-0 ${customerTones.link}`} feedbackTitle={`${site.label} menu opened`}>
                        <MoreHorizontal className="mr-1 h-4 w-4" />
                        More
                      </CustomerActionButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <CustomerActionButton variant="link" className={`mt-5 w-full ${customerTones.link}`} feedbackTitle="All sites opened">
            View all sites
            <ChevronRight className="ml-2 h-4 w-4" />
          </CustomerActionButton>
        </Card>

        <div className="space-y-6">
          <Card className="border-border bg-card p-7 shadow-sm">
            <div className="flex items-start justify-between">
              <SectionHeader icon={Home} title="Site Details" description="" compact />
              <Badge className={customerTones.badge.success}>Default</Badge>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Home</h3>
            <p className="text-sm text-muted-foreground">123 Main St, New York, NY 10001</p>
            <div className="mt-5 space-y-4 border-t border-border pt-5 text-sm">
              {[
                ["Contact person", "Demo User", User],
                ["Phone", "+1 (212) 555-0173", Phone],
                ["Preferred technician", "Any available technician", Wrench],
                ["Access instructions", "Call or text upon arrival.", FileText],
                ["Gate / entry note", "Front door code: 2468#", LockKeyhole],
                ["Service notes", "Dog in house. Please be mindful.", MessageSquare],
              ].map(([label, value, Icon]) => {
                const IconComponent = Icon as LucideIcon;
                return (
                  <div key={label as string} className="grid grid-cols-[1fr_1.4fr] gap-4">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <IconComponent className="h-4 w-4" />
                      {label as string}
                    </p>
                    <p className="text-foreground">{value as string}</p>
                  </div>
                );
              })}
            </div>
            <CustomerActionButton variant="link" className={`mt-4 h-auto px-0 ${customerTones.link}`} feedbackTitle="Site edit opened">
              <PenLine className="mr-2 h-4 w-4" />
              Edit site details
            </CustomerActionButton>
          </Card>

          <Card className="border-border bg-card p-7 shadow-sm">
            <SectionHeader icon={ShieldCheck} title="Service Coverage & Preferences" description="" compact />
            <div className="mt-5 space-y-4 text-sm">
              <div className="grid grid-cols-[1fr_1.4fr] gap-4">
                <p className="text-muted-foreground">Preferred service categories</p>
                <div className="flex flex-wrap gap-2">
                  {["HVAC", "Electrical", "Plumbing"].map((item) => (
                    <Badge key={item} className={customerTones.badge.info}>{item}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-[1fr_1.4fr] gap-4">
                <p className="text-muted-foreground">Notification preference</p>
                <p>Email and SMS</p>
              </div>
              <div className="grid grid-cols-[1fr_1.4fr] gap-4">
                <p className="text-muted-foreground">Service priority</p>
                <p>Standard</p>
              </div>
            </div>
            <div className={`mt-5 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-200 ${customerTones.surface.success}`}>
              Primary service address for scheduling and billing
            </div>
          </Card>
        </div>
      </div>

      <Card className="border-border bg-card p-7 shadow-sm">
        <div className="grid gap-6 xl:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div className="flex gap-5">
            <div className={`grid h-20 w-20 place-items-center rounded-xl ${customerTones.icon.blue}`}>
              <LockKeyhole className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Site management protection</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your saved addresses, access instructions, and site preferences are encrypted and stored securely. Only you and our authorized team can access this information to provide safe and efficient service.
              </p>
            </div>
          </div>
          <ProtectionMini icon={LockKeyhole} title="Encrypted storage" detail="Bank-level encryption" />
          <ProtectionMini icon={ShieldCheck} title="Access controlled" detail="Authorized team only" />
          <ProtectionMini icon={ShieldCheck} title="Privacy assured" detail="We never share your data" />
        </div>
      </Card>
    </>
  );
}

function PreferencesTab() {
  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
        <PreferencePanel
          icon={Bell}
          title="Communication Preferences"
          description="Choose how you want to receive general communications."
          items={[
            ["Email notifications", "Receive important updates via email", Mail, true],
            ["SMS notifications", "Receive text message updates", MessageSquare, true],
            ["Phone call updates", "Receive important updates via phone call", Phone, false],
            ["Marketing emails", "Receive offers, promotions, and marketing emails", Mail, false],
            ["Product updates", "Get notified about new features and improvements", Grid2X2, true],
          ]}
        />
        <PreferencePanel
          icon={Bell}
          title="Service Notifications"
          description="Stay informed about your service and support activities."
          items={[
            ["Appointment reminders", "Reminders before scheduled appointments", Calendar, true],
            ["Technician en route alerts", "Get notified when technician is on the way", Users, true],
            ["Quote ready notifications", "When your service quotes are ready", FileText, true],
            ["Invoice & payment confirmations", "Confirmations for invoices and payments", ReceiptText, true],
            ["Support ticket updates", "Updates on your support tickets", Info, true],
          ]}
        />
        <Card className="border-border bg-card p-7 shadow-sm">
          <SectionHeader icon={Clock} title="Notification Frequency" description="Choose how often you want to receive non-urgent updates." compact />
          <div className="mt-6 overflow-hidden rounded-lg border border-border">
            {[
              ["Instant", "Receive notifications as they happen"],
              ["Daily summary", "Get a summary of all updates once per day"],
              ["Weekly summary", "Get a summary of all updates once per week"],
            ].map(([title, detail], index) => (
              <label key={title} className="flex gap-4 border-b border-border p-4 last:border-b-0">
                <input type="radio" name="frequency" defaultChecked={index === 0} className="mt-1" />
                <span>
                  <span className="block font-semibold text-foreground">{title}</span>
                  <span className="text-sm text-muted-foreground">{detail}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Critical alerts and appointment reminders are always sent instantly.
          </p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-border bg-card p-7 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <SectionHeader icon={Moon} title="Quiet Hours" description="Set times when you don't want to receive notifications." compact />
            <label className="flex items-center gap-3 text-sm">
              <Switch defaultChecked />
              Enable quiet hours
            </label>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SelectField label="Start time" value="10:00 PM" />
            <SelectField label="End time" value="7:00 AM" />
            <SelectField label="Time zone" value="(GMT-05:00) Eastern Time (US & Canada)" />
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            You won&apos;t receive non-critical notifications during quiet hours.
          </p>
        </Card>

        <Card className="border-border bg-card p-7 shadow-sm">
          <SectionHeader icon={Grid2X2} title="Experience Preferences" description="Customize your experience in the customer portal." compact />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <SelectField label="Preferred language" value="English (US)" />
            <SelectField label="Time zone" value="(GMT-05:00) Eastern Time (US & Canada)" />
            <SelectField label="Date format" value="MM/DD/YYYY" />
            <SelectField label="Theme" value="System theme" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Theme will match your device settings.</p>
        </Card>
      </div>

      <Card className={`border-emerald-200 p-7 shadow-sm ${customerTones.surface.success}`}>
        <div className="flex items-center gap-5">
          <div className={`grid h-16 w-16 place-items-center rounded-full ${customerTones.icon.emerald}`}>
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Your preferences are protected</h2>
            <p className="mt-1 text-muted-foreground">
              All your preferences are securely saved and encrypted. You can update them anytime, and your changes will take effect immediately.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}

function SecurityTab() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={LockKeyhole} label="Password status" value="Strong" detail="Last changed 30 days ago" tone="green" />
        <MetricCard icon={ShieldCheck} label="Two-factor authentication" value="Enabled" detail="Active protection" tone="green" />
        <MetricCard icon={Users} label="Active sessions" value="2" detail="Across 2 devices" tone="blue" />
        <MetricCard icon={Monitor} label="Trusted devices" value="4" detail="Recognized devices" tone="purple" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.85fr]">
        <div className="space-y-6">
          <Card className="border-border bg-card p-7 shadow-sm">
            <SectionHeader icon={ShieldCheck} title="Security Settings" description="Manage your account security and authentication preferences." compact />
            <div className="mt-6 divide-y divide-border">
              {[
                ["Password", "••••••••••••••••", "Last changed 30 days ago", "Change", LockKeyhole],
                ["Two-factor authentication", "Add an extra layer of security to your account.", "Enabled", "Manage", ShieldCheck],
                ["Login alerts", "Get notified about new sign-ins to your account.", "", "toggle", Bell],
                ["Recovery email", "abukarmacalin08@gmail.com", "", "Update", Mail],
                ["Backup codes", "Use backup codes to sign in if you lose access to your authenticator.", "8 codes available", "View", KeyRound],
              ].map(([label, detail, meta, action, Icon]) => {
                const IconComponent = Icon as LucideIcon;
                return (
                  <div key={label as string} className="grid gap-4 py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                    <div className="flex gap-4">
                      <div className={`grid h-10 w-10 place-items-center rounded-md ${customerTones.icon.blue}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{label as string}</p>
                        <p className="text-sm text-muted-foreground">{detail as string}</p>
                      </div>
                    </div>
                    <p className={meta === "Enabled" ? "text-sm font-semibold text-emerald-700" : "text-sm text-muted-foreground"}>{meta as string}</p>
                    {action === "toggle" ? (
                      <Switch defaultChecked />
                    ) : (
                      <CustomerActionButton variant="outline" size="sm" feedbackTitle={`${action} opened`}>
                        {action as string}
                      </CustomerActionButton>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="border-border bg-card p-7 shadow-sm">
            <SectionHeader icon={ShieldCheck} title="Account Protection" description="Your security is our priority. We use industry-standard measures to keep your account safe." compact />
            <div className="mt-6 grid gap-5 md:grid-cols-4">
              {[
                ["Encrypted protection", "All account data is encrypted using bank-level security."],
                ["Suspicious activity monitoring", "We continuously monitor for unusual account activity."],
                ["Secure sign-in", "Multi-layer authentication protects your account."],
                ["Privacy protection", "Your data is private and never shared with third parties."],
              ].map(([title, detail]) => (
                <div key={title} className="border-l border-border pl-5 first:border-l-0 first:pl-0">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-600" />
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border bg-card p-7 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <SectionHeader icon={Users} title="Active Sessions" description="" compact />
              <CustomerActionButton variant="link" className={`h-auto px-0 ${customerTones.link}`} feedbackTitle="All sessions opened">
                View all sessions
              </CustomerActionButton>
            </div>
            <SessionRow icon={Monitor} title="Chrome on macOS" detail="Austin, TX, United States / IP: 98.188.24.123" status="Current" date="May 15, 2024 10:30 AM" />
            <SessionRow icon={Smartphone} title="Safari on iPhone" detail="Austin, TX, United States / IP: 98.188.24.124" status="Recent" date="May 15, 2024 9:15 AM" />
            <SessionRow icon={Monitor} title="Edge on Windows" detail="Dallas, TX, United States / IP: 73.21.45.67" status="Recent" date="May 14, 2024 4:22 PM" />
            <CustomerActionButton variant="link" className={`mt-3 w-full ${customerTones.link}`} feedbackTitle="Other sessions signed out">
              Sign out all other sessions
            </CustomerActionButton>
          </Card>

          <Card className="border-border bg-card p-7 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <SectionHeader icon={Laptop} title="Trusted Devices" description="" compact />
              <CustomerActionButton variant="link" className={`h-auto px-0 ${customerTones.link}`} feedbackTitle="Devices opened">
                Manage devices
              </CustomerActionButton>
            </div>
            <DeviceRow icon={Laptop} title="MacBook Pro (This device)" detail="macOS 14.4 / Chrome 124" status="Current" date="May 15, 2024" />
            <DeviceRow icon={Smartphone} title="iPhone 14 Pro" detail="iOS 17.4 / Safari" date="May 15, 2024" />
            <DeviceRow icon={Monitor} title="Windows Desktop" detail="Windows 11 / Edge 124" date="May 14, 2024" />
          </Card>

          <Card className={`border-red-200 p-7 shadow-sm ${customerTones.surface.danger}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-red-700">
                  <ShieldCheck className="h-5 w-5" />
                  Danger Zone
                </h2>
                <p className="mt-2 text-sm text-red-600">Once you delete your account, there is no going back.</p>
              </div>
              <CustomerActionButton className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/50" variant="outline" feedbackTitle="Delete account flow opened">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </CustomerActionButton>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function QuickAccountActions() {
  return (
    <Card className="mt-6 border-border bg-card p-5 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[1fr_repeat(4,0.85fr)]">
        <div className="flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-lg ${customerTones.icon.blue}`}>
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Quick Account Actions</p>
            <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
          </div>
        </div>
        {[
          ["Download My Data", "Export your account data", Download, customerTones.icon.blue],
          ["Delete Account", "Permanently delete account", Trash2, customerTones.icon.red],
          ["Linked Accounts", "Manage third-party logins", LinkIcon, customerTones.icon.blue],
          ["Help & Resources", "FAQs and support articles", Headphones, customerTones.icon.blue],
        ].map(([title, detail, Icon, tone]) => {
          const IconComponent = Icon as LucideIcon;
          return (
            <CustomerActionButton key={title as string} variant="outline" className="h-auto justify-between p-4" feedbackTitle={`${title} opened`}>
              <span className="flex items-center gap-3 text-left">
                <span className={`grid h-10 w-10 place-items-center rounded-md ${tone as string}`}>
                  <IconComponent className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">{title as string}</span>
                  <span className="text-sm font-normal text-muted-foreground">{detail as string}</span>
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CustomerActionButton>
          );
        })}
      </div>
    </Card>
  );
}

function AccountMeta({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="text-sm">
      <p className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
  compact,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={
          compact
            ? `grid h-10 w-10 place-items-center rounded-lg ${customerTones.icon.blue}`
            : `grid h-14 w-14 place-items-center rounded-lg ${customerTones.icon.blue}`
        }
      >
        <Icon className={compact ? "h-5 w-5" : "h-7 w-7"} />
      </div>
      <div>
        <h2 className={compact ? "text-lg font-semibold text-foreground" : "text-2xl font-semibold text-foreground"}>{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  );
}

function VerifiedInput({ label, value, disabled }: { label: string; value: string; disabled: boolean }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <div className="relative">
        <Input value={value} readOnly disabled={disabled} className="h-12 pr-10" />
        <CheckCircle2 className="absolute right-3 top-3.5 h-5 w-5 text-emerald-600" />
      </div>
    </div>
  );
}

function PlainInput({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
        <Input value={value} readOnly className="h-12 pl-10" />
      </div>
    </div>
  );
}

function SelectField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <Select defaultValue="value">
        <SelectTrigger className="h-12">
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="value">{value}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone?: "green" }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={tone === "green" ? "font-semibold text-emerald-600" : "font-semibold text-foreground"}>{value}</span>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
  arrow,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: "green" | "orange" | "blue" | "purple";
  arrow?: boolean;
}) {
  const toneClass = {
    green: customerTones.icon.emerald,
    orange: customerTones.icon.orange,
    blue: customerTones.icon.blue,
    purple: customerTones.icon.violet,
  }[tone];

  return (
    <Card className="border-border bg-card p-7 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className={`grid h-16 w-16 place-items-center rounded-full ${toneClass}`}>
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-muted-foreground">{label}</p>
            <p className={tone === "orange" ? "mt-1 text-2xl font-semibold text-orange-600" : tone === "green" && value === "Enabled" ? "mt-1 text-2xl font-semibold text-emerald-600" : "mt-1 text-2xl font-semibold text-foreground"}>{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
          </div>
        </div>
        {arrow ? <ChevronRight className="h-5 w-5 text-muted-foreground" /> : null}
      </div>
    </Card>
  );
}

function PaymentMethodRow({
  brand,
  title,
  expires,
  isDefault,
}: {
  brand: string;
  title: string;
  expires: string;
  isDefault?: boolean;
}) {
  return (
    <div className="grid gap-4 border-t border-border py-4 md:grid-cols-[70px_1fr_160px_130px_110px_auto] md:items-center">
      <div className="rounded-md border border-border px-2 py-1 text-center font-bold text-blue-700">{brand}</div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{expires}</p>
      <p className="text-sm text-muted-foreground">Demo User</p>
      {isDefault ? <Badge className={customerTones.badge.success}>Default</Badge> : <span />}
      <div className="flex flex-wrap gap-4 text-sm">
        <CustomerActionButton variant="link" className={`h-auto px-0 ${customerTones.link}`} feedbackTitle="Payment method edit opened">Edit</CustomerActionButton>
        {!isDefault ? <CustomerActionButton variant="link" className={`h-auto px-0 ${customerTones.link}`} feedbackTitle="Default method updated">Set default</CustomerActionButton> : null}
        <CustomerActionButton variant="link" className="h-auto px-0 text-red-600" feedbackTitle="Payment method remove opened">Remove</CustomerActionButton>
      </div>
    </div>
  );
}

function SiteInfo({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="mt-0.5 h-4 w-4 text-blue-700" />
      <div>
        <p className="text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ProtectionMini({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`grid h-10 w-10 place-items-center rounded-md ${customerTones.icon.blue}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function PreferencePanel({
  icon,
  title,
  description,
  items,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  items: [string, string, LucideIcon, boolean][];
}) {
  return (
    <Card className="border-border bg-card p-7 shadow-sm">
      <SectionHeader icon={icon} title={title} description={description} compact />
      <div className="mt-5 divide-y divide-border">
        {items.map(([itemTitle, detail, ItemIcon, enabled]) => (
          <div key={itemTitle} className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-muted text-muted-foreground">
                <ItemIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{itemTitle}</p>
                <p className="text-sm text-muted-foreground">{detail}</p>
              </div>
            </div>
            <Switch defaultChecked={enabled} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function SessionRow({ icon: Icon, title, detail, status, date }: { icon: LucideIcon; title: string; detail: string; status: string; date: string }) {
  return (
    <div className="grid gap-3 border-t border-border py-3 md:grid-cols-[1fr_auto] md:items-center">
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-md ${customerTones.icon.blue}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{detail}</p>
        </div>
      </div>
      <div className="text-right">
        <Badge className={status === "Current" ? customerTones.badge.success : customerTones.badge.info}>{status}</Badge>
        <p className="mt-1 text-sm text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}

function DeviceRow({ icon: Icon, title, detail, status, date }: { icon: LucideIcon; title: string; detail: string; status?: string; date: string }) {
  return (
    <div className="grid gap-3 border-t border-border py-3 md:grid-cols-[1fr_auto] md:items-center">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{detail}</p>
        </div>
      </div>
      <div className="text-right">
        {status ? <Badge className={customerTones.badge.success}>{status}</Badge> : null}
        <p className="mt-1 text-sm text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}
