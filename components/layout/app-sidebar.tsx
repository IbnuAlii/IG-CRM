'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

export interface AppSidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface AppSidebarProps {
  brand: {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    href: string;
  };
  items: AppSidebarItem[];
  footer?: React.ReactNode;
}

export function AppSidebar({ brand, items, footer }: AppSidebarProps) {
  const pathname = usePathname();
  const BrandIcon = brand.icon;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip={brand.title} className="h-12 group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11">
              <Link href={brand.href}>
                <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BrandIcon className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{brand.title}</span>
                  {brand.subtitle ? (
                    <span className="truncate text-xs text-muted-foreground">{brand.subtitle}</span>
                  ) : null}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:pt-7">
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className="h-11 text-[15px] group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11"
                    >
                      <Link href={item.href}>
                        <Icon className="size-5 group-data-[collapsible=icon]:size-5.5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
      <SidebarRail />
    </Sidebar>
  );
}
