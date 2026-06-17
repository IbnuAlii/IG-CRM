'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { BriefcaseBusiness } from 'lucide-react';

interface AuthPageShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthPageShell({ title, description, children }: AuthPageShellProps) {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
            aria-label="Back to login"
          >
            <BriefcaseBusiness className="w-8 h-8 text-primary" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Card className="p-6 border border-border/50">{children}</Card>
      </div>
    </div>
  );
}
