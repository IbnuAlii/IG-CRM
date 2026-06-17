'use client';

import Link from 'next/link';
import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const { toast } = useToast();

  const handleResend = () => {
    toast({
      title: 'Verification email queued',
      description: 'In production this sends a fresh verification link.',
    });
  };

  return (
    <AuthPageShell title="Verify Email" description="Confirm the account email before entering the system.">
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-semibold">Email verification required</h2>
          <p className="text-sm text-muted-foreground mt-1">
            New users should verify their email address before the backend grants dashboard access.
          </p>
        </div>
        <div className="rounded-lg border border-border p-4 text-left">
          <p className="text-sm font-medium">Demo status</p>
          <p className="text-sm text-muted-foreground mt-1">
            Awaiting verification link confirmation from email.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleResend}>Resend verification email</Button>
          <Button variant="outline" asChild>
            <Link href="/login">Back to login</Link>
          </Button>
        </div>
      </div>
    </AuthPageShell>
  );
}
