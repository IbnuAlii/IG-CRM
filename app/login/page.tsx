"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import {
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  Calculator,
  Truck,
  Shield,
  UserCheck,
  UsersRound,
  Wrench,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("customer");

  const handleLogin = async (e: React.FormEvent, role: string) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const roleRoutes: Record<string, string> = {
        customer: "/customer/home",
        driver: "/driver/dashboard",
        dispatcher: "/dispatcher/dashboard",
        manager: "/manager/dashboard",
        hr_officer: "/hr/dashboard",
        fleet_manager: "/fleet/dashboard",
        accountant: "/accountant/dashboard",
        admin: "/admin/dashboard",
        superadmin: "/superadmin/dashboard",
      };

      if (
        role === "admin" ||
        role === "superadmin" ||
          role === "hr_officer" ||
          role === "manager" ||
          role === "fleet_manager" ||
          role === "accountant"
      ) {
        toast({
          title: "2FA required",
          description:
            "Privileged accounts must complete two-factor authentication.",
        });
        router.push(
          `/two-factor?role=${role}&identifier=${encodeURIComponent(identifier)}&redirect=${encodeURIComponent(roleRoutes[role])}`,
        );
        return;
      }

      await login(identifier, password, role);
      toast({
        title: "Success",
        description: `Logged in as ${role}`,
      });

      router.push(roleRoutes[role] || "/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-background to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <BriefcaseBusiness className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            CRM Enterprise SaaS
          </h1>
          <p className="text-muted-foreground">
            Unified operations platform for field service teams
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 border border-border/50 backdrop-blur-sm">
          <Tabs
            defaultValue="customer"
            className="w-full"
            onValueChange={setSelectedRole}
          >
            <TabsList className="mb-6 flex h-auto w-full justify-start gap-1 overflow-x-auto p-1">
              <TabsTrigger value="customer" className="shrink-0 text-xs">
                <Building2 className="h-4 w-4" />
                <span>Customer</span>
              </TabsTrigger>
              <TabsTrigger value="driver" className="shrink-0 text-xs">
                <Wrench className="h-4 w-4" />
                <span>driver</span>
              </TabsTrigger>
              <TabsTrigger value="dispatcher" className="shrink-0 text-xs">
                <CalendarClock className="h-4 w-4" />
                <span>Dispatch</span>
              </TabsTrigger>
              <TabsTrigger value="manager" className="shrink-0 text-xs">
                <BriefcaseBusiness className="h-4 w-4" />
                <span>Manager</span>
              </TabsTrigger>
              <TabsTrigger value="hr_officer" className="shrink-0 text-xs">
                <UsersRound className="h-4 w-4" />
                <span>HR</span>
              </TabsTrigger>
              <TabsTrigger value="fleet_manager" className="shrink-0 text-xs">
                <Truck className="h-4 w-4" />
                <span>Fleet</span>
              </TabsTrigger>
              <TabsTrigger value="accountant" className="shrink-0 text-xs">
                <Calculator className="h-4 w-4" />
                <span>Accounting</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="shrink-0 text-xs">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </TabsTrigger>
              <TabsTrigger value="superadmin" className="shrink-0 text-xs">
                <UserCheck className="h-4 w-4" />
                <span>Super</span>
              </TabsTrigger>
            </TabsList>

            {/* Customer Login */}
            <TabsContent value="customer" className="space-y-4">
              <form
                onSubmit={(e) => handleLogin(e, "customer")}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone or Email
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter phone or email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login as Customer"
                  )}
                </Button>
              </form>
              <p className="text-sm text-center text-muted-foreground">
                Demo: Use any credentials
              </p>
            </TabsContent>

            {/* Driver Login */}
            <TabsContent value="driver" className="space-y-4">
              <form
                onSubmit={(e) => handleLogin(e, "driver")}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1234567890"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login as Field User"
                  )}
                </Button>
              </form>
              <p className="text-sm text-center text-muted-foreground">
                Demo: Use any credentials
              </p>
            </TabsContent>

            {/* Dispatcher Login */}
            <TabsContent value="dispatcher" className="space-y-4">
              <form
                onSubmit={(e) => handleLogin(e, "dispatcher")}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="dispatcher@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login as Dispatcher"
                  )}
                </Button>
              </form>
              <p className="text-sm text-center text-muted-foreground">
                Demo: Use any credentials
              </p>
            </TabsContent>

            {/* Manager Login */}
            <TabsContent value="manager" className="space-y-4">
              <form
                onSubmit={(e) => handleLogin(e, "manager")}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="manager@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login as Manager"
                  )}
                </Button>
              </form>
              <p className="text-sm text-center text-muted-foreground">
                Demo: Use any credentials
              </p>
            </TabsContent>

            {/* HR Officer Login */}
            <TabsContent value="hr_officer" className="space-y-4">
              <form
                onSubmit={(e) => handleLogin(e, "hr_officer")}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="hr@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login as HR Officer"
                  )}
                </Button>
              </form>
              <p className="text-sm text-center text-muted-foreground">
                Demo: Use any credentials
              </p>
            </TabsContent>

            {/* Fleet Manager Login */}
            <TabsContent value="fleet_manager" className="space-y-4">
              <form
                onSubmit={(e) => handleLogin(e, "fleet_manager")}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="fleet@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login as Fleet Manager"
                  )}
                </Button>
              </form>
              <p className="text-sm text-center text-muted-foreground">
                Demo: Use any credentials
              </p>
            </TabsContent>

            {/* Accountant Login */}
            <TabsContent value="accountant" className="space-y-4">
              <form
                onSubmit={(e) => handleLogin(e, "accountant")}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="accounting@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login as Accountant"
                  )}
                </Button>
              </form>
              <p className="text-sm text-center text-muted-foreground">
                Demo: Use any credentials
              </p>
            </TabsContent>

            {/* Admin Login */}
            <TabsContent value="admin" className="space-y-4">
              <form
                onSubmit={(e) => handleLogin(e, "admin")}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login as Admin"
                  )}
                </Button>
              </form>
              <p className="text-sm text-center text-muted-foreground">
                Demo: Use any credentials
              </p>
            </TabsContent>

            {/* SuperAdmin Login */}
            <TabsContent value="superadmin" className="space-y-4">
              <form
                onSubmit={(e) => handleLogin(e, "superadmin")}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="superadmin@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login as SuperAdmin"
                  )}
                </Button>
              </form>
              <p className="text-sm text-center text-muted-foreground">
                Demo: Use any credentials
              </p>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <p className="text-sm text-center text-muted-foreground mt-6">
          Demo Platform - All credentials work - No backend required
          <br />
          <Link
            href="/verify-email"
            className="font-medium text-primary hover:underline"
          >
            Need email verification?
          </Link>
        </p>
      </div>
    </div>
  );
}
