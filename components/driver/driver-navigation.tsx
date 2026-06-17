"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarClock,
  Home,
  LogOut,
  Menu,
  Radio,
  Route,
  TrendingUp,
  User,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { technicianProfile } from "./technician-utils";

const navigationItems = [
  { href: "/driver/dashboard", label: "Dashboard", icon: Home },
  { href: "/driver/jobs", label: "My Jobs", icon: BriefcaseBusiness },
  { href: "/driver/schedule", label: "Schedule", icon: CalendarClock },
  { href: "/driver/route", label: "Route", icon: Route },
  { href: "/driver/performance", label: "Performance", icon: TrendingUp },
  { href: "/driver/profile", label: "Profile", icon: User },
];

export function DriverNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string) =>
    pathname === href ||
    (href === "/driver/jobs" && pathname.startsWith("/driver/jobs/"));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1760px] items-center gap-3 px-4 2xl:px-8">
        <Link href="/driver/dashboard" className="flex shrink-0 items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Wrench className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <p className="font-semibold leading-tight text-foreground">ASuite Field</p>
            <p className="text-xs text-muted-foreground">Technician Portal</p>
          </div>
        </Link>

        <nav className="ml-4 hidden min-w-0 flex-1 items-center gap-1 lg:flex">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-blue-50 hover:text-blue-700",
                  active && "bg-blue-50 text-blue-700",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Badge className="hidden bg-emerald-100 text-emerald-700 hover:bg-emerald-100 md:inline-flex">
            <Radio className="mr-1 h-3.5 w-3.5" />
            GPS live
          </Badge>
          <div className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 md:flex">
            <div className="text-right">
              <p className="text-sm font-medium leading-tight text-foreground">
                {user?.name || "Ethan Brooks"}
              </p>
              <p className="text-xs text-muted-foreground">{technicianProfile.location}</p>
            </div>
            <img
              src={user?.avatar || "https://i.pravatar.cc/150?img=12"}
              alt={user?.name || "Technician"}
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open technician navigation">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[340px] max-w-[92vw] flex-col p-0">
              <SheetHeader className="border-b border-border p-5 text-left">
                <SheetTitle className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white">
                    <Wrench className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base">ASuite Field</span>
                    <span className="block text-xs font-normal text-muted-foreground">Technician Portal</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="border-b border-border p-5">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <img
                    src={user?.avatar || "https://i.pravatar.cc/150?img=12"}
                    alt={user?.name || "Technician"}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{user?.name || "Ethan Brooks"}</p>
                    <p className="text-xs text-muted-foreground">{technicianProfile.title}</p>
                  </div>
                </div>
              </div>
              <nav className="flex-1 space-y-1 p-5">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-blue-50 hover:text-blue-700",
                          active && "bg-blue-600 text-white hover:bg-blue-700 hover:text-white",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="border-t border-border p-5 space-y-3">
                <div className="flex justify-end">
                  <ThemeToggle />
                </div>
                <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
