'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { customerTones } from '@/components/customer/customer-tones';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import {
  FileText,
  Headphones,
  History,
  Home,
  LogOut,
  MapPin,
  Menu,
  Receipt,
  Sparkles,
  CalendarPlus,
  User,
} from 'lucide-react';

export function CustomerNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { href: '/customer/home', label: 'Home', icon: Home },
    { href: '/customer/active-service', label: 'Active Service', icon: MapPin },
    { href: '/customer/quotes', label: 'Quotes', icon: FileText },
    { href: '/customer/billing', label: 'Billing', icon: Receipt },
    { href: '/customer/support', label: 'Support', icon: Headphones },
    { href: '/customer/history', label: 'History', icon: History },
    { href: '/customer/account', label: 'Account', icon: User },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  const isActive = (href: string) =>
    pathname === href ||
    (href === '/customer/active-service' &&
      pathname === '/customer/active-rides');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const closeMenuOnDesktop = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };

    closeMenuOnDesktop(mediaQuery);
    mediaQuery.addEventListener('change', closeMenuOnDesktop);

    return () => {
      mediaQuery.removeEventListener('change', closeMenuOnDesktop);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1760px] items-center justify-between gap-4 px-4 2xl:px-8">
        <Link href="/customer/home" className="flex shrink-0 items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-600/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-foreground">ASuite Care</span>
            <span className="hidden text-xs text-muted-foreground sm:block">Customer Portal</span>
          </div>
        </Link>

        <nav className="hidden min-w-0 items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition",
                  active ? customerTones.navActive : customerTones.navIdle,
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button className="hidden lg:inline-flex" size="sm" asChild>
            <Link href="/customer/home">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Request Service
            </Link>
          </Button>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-muted px-2 py-1 lg:flex">
            <div className="text-right">
              <p className="text-xs font-medium text-foreground">{user?.name || 'Customer'}</p>
              <p className="text-[11px] text-muted-foreground">{user?.phone || user?.email || 'Verified account'}</p>
            </div>
            <img
              src={user?.avatar || `https://i.pravatar.cc/150?img=0`}
              alt={user?.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
          <ThemeToggle />
          <Button
            className="hidden lg:inline-flex"
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open customer navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm border-border bg-card p-0">
              <SheetHeader className="border-b border-border p-5 text-left">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <SheetTitle>ASuite Care</SheetTitle>
                    <SheetDescription>Customer Portal</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="px-5 py-4">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                  <img
                    src={user?.avatar || `https://i.pravatar.cc/150?img=0`}
                    alt={user?.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user?.name || 'Customer'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.phone || user?.email || 'Verified account'}
                    </p>
                  </div>
                </div>

                <nav className="mt-5 grid gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition",
                            active ? customerTones.navSheetActive : customerTones.navSheetIdle,
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </div>

              <SheetFooter className="border-t border-border p-5">
                <div className="flex w-full justify-end pb-2">
                  <ThemeToggle />
                </div>
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/customer/home">
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Request Service
                    </Link>
                  </Button>
                </SheetClose>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
