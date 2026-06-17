'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MailCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Enter your account email to receive a reset link.',
        variant: 'destructive',
      });
      return;
    }

    setSent(true);
    toast({
      title: 'Reset link queued',
      description: 'In production this sends a time-limited email reset link.',
    });
  };

  return (
    <AuthPageShell title="Reset Password" description="Request a secure email link to recover your account.">
      {sent ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
            <MailCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold">Check your email</h2>
            <p className="text-sm text-muted-foreground mt-1">
              We prepared a reset link for {email}. The link should expire after the configured security window.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/reset-password">Open demo reset page</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email address</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Remembered it?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      )}
    </AuthPageShell>
  );
}
