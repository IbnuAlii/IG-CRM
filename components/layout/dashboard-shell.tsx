"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type React from "react";
import { LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar, type AppSidebarItem } from "./app-sidebar";
import type { LucideIcon } from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
  brand: {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    href: string;
  };
  items: AppSidebarItem[];
  userLabel?: string;
}

export function DashboardShell({
  children,
  brand,
  items,
  userLabel = "User",
}: DashboardShellProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <SidebarProvider>
      <AppSidebar brand={brand} items={items} />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 min-w-0 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <div className="h-6 w-px bg-border" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{brand.title}</p>
              {brand.subtitle ? (
                <p className="truncate text-xs text-muted-foreground">
                  {brand.subtitle}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex min-w-0 shrink-0 items-center gap-3">
            <Button
              variant="outline"
              className="hidden h-9 min-w-48 justify-start gap-2 text-muted-foreground md:flex"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="h-4 w-4" />
              Search pages
              <KbdGroup className="ml-auto">
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </Button>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">
                {user?.name || "Demo User"}
              </p>
              <p className="text-xs text-muted-foreground">{userLabel}</p>
            </div>
            <img
              src={user?.avatar || "https://i.pravatar.cc/150?img=20"}
              alt={user?.name || "User avatar"}
              className="hidden sm:block w-8 h-8 rounded-full"
            />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-secondary/60 px-4 md:px-5 lg:px-6">
          <div className="mx-auto w-full max-w-[1800px] min-w-0">
            {children}
          </div>
        </main>
      </SidebarInset>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen} title="Search pages">
        <CommandInput placeholder={`Search ${brand.title} pages...`} />
        <CommandList>
          <CommandEmpty>No page found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <CommandItem
                  key={item.href}
                  value={`${item.label} ${item.href}`}
                  onSelect={() => {
                    setCommandOpen(false);
                    router.push(item.href);
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  <CommandShortcut>{item.href.replace(brand.href, "") || "/"}</CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SidebarProvider>
  );
}
