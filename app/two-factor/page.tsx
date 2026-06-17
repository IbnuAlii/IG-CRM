'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck } from 'lucide-react';

const defaultRedirectByRole: Record<string, string> = {
  admin: '/admin/dashboard',
  accountant: '/accountant/dashboard',
  fleet_manager: '/fleet/dashboard',
  hr_officer: '/hr/dashboard',
  manager: '/manager/dashboard',
  superadmin: '/superadmin/dashboard',
};

export default function TwoFactorPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [identifier, setIdentifier] = useState('superadmin@example.com');
  const [role, setRole] = useState('superadmin');
  const [redirectTo, setRedirectTo] = useState('/superadmin/dashboard');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedRole = params.get('role') || 'superadmin';
    setRole(requestedRole);
    setIdentifier(params.get('identifier') || `${requestedRole}@example.com`);
    setRedirectTo(params.get('redirect') || defaultRedirectByRole[requestedRole] || '/');
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (code.length !== 6) {
      toast({
        title: '2FA code required',
        description: 'Enter the six digit authenticator code.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await login(identifier, code, role);
      toast({
        title: '2FA verified',
        description: 'Secure session created for this demo.',
      });
      router.push(redirectTo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell title="Two-Factor Authentication" description="Enter your TOTP code to finish privileged login.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{identifier}</p>
              <p className="text-sm text-muted-foreground">Role: {role}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="two-factor-code">
            Authenticator code
          </label>
          <InputOTP id="two-factor-code" maxLength={6} value={code} onChange={setCode} containerClassName="justify-center">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-center text-xs text-muted-foreground">Demo accepts any six digits.</p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify and continue'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Lost your device?{' '}
          <Link href="/forgot-password" className="font-medium text-primary hover:underline">
            Start account recovery
          </Link>
        </p>
      </form>
    </AuthPageShell>
  );
}
