'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth-context';
import { Activity, BarChart3, Bell, Building2, CreditCard, FileClock, LogOut, Menu, Settings, ShieldCheck } from 'lucide-react';

export function SuperAdminNavigation() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/superadmin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/superadmin/tenants', label: 'Tenants', icon: Building2 },
    { href: '/superadmin/registrations', label: 'Registrations', icon: FileClock },
    { href: '/superadmin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { href: '/superadmin/system-health', label: 'System Health', icon: Activity },
    { href: '/superadmin/logs', label: 'Logs', icon: Bell },
    { href: '/superadmin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/superadmin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">CRM Super Admin</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">CRM Super Admin</span>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="hidden sm:flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name || 'SuperAdmin'}</p>
              <p className="text-xs text-muted-foreground">Platform Owner</p>
            </div>
            <img
              src={user?.avatar || `https://i.pravatar.cc/150?img=20`}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
