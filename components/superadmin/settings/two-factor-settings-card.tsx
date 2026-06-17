'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, ShieldCheck } from 'lucide-react';

const backupCodes = ['A8K2-M19Q', 'P4Z7-L61C', 'R9H3-X20B', 'T6N1-V84M'];

export function TwoFactorSettingsCard() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(true);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const handleVerify = () => {
    if (code.length !== 6) {
      toast({
        title: 'Code required',
        description: 'Enter the six digit authenticator code to verify setup.',
        variant: 'destructive',
      });
      return;
    }

    setEnabled(true);
    toast({
      title: '2FA verified',
      description: 'The authenticator app is ready for this account.',
    });
  };

  const handleDisable = () => {
    if (!password.trim()) {
      toast({
        title: 'Password required',
        description: 'Confirm your password before disabling 2FA.',
        variant: 'destructive',
      });
      return;
    }

    setEnabled(false);
    setPassword('');
    toast({
      title: '2FA disabled',
      description: 'In production this should trigger an audit log entry.',
    });
  };

  return (
    <Card className="border-border/70 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold">Account 2FA Setup</h2>
            <p className="text-sm text-muted-foreground">Authenticator app setup, backup codes, and recovery control.</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            enabled
              ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900'
              : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900'
          }
        >
          {enabled ? 'Enabled' : 'Not enabled'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-5 mt-5">
        <div className="rounded-lg border border-border/70 bg-muted/40 p-4 text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-md border border-border bg-background">
            <KeyRound className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-3">QR code placeholder</p>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background p-4 shadow-xs">
            <div>
              <p className="text-sm font-medium">Require 2FA on this Super Admin account</p>
              <p className="text-sm text-muted-foreground">Privileged login will ask for a TOTP code after password entry.</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="setup-code">Verify authenticator code</Label>
            <InputOTP id="setup-code" maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button variant="outline" size="sm" onClick={handleVerify}>
              Verify setup
            </Button>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Backup codes</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {backupCodes.map((backupCode) => (
                <code key={backupCode} className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
                  {backupCode}
                </code>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="disable-2fa-password">Disable with password confirmation</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="disable-2fa-password"
                type="password"
                placeholder="Current password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Button variant="destructive" onClick={handleDisable}>
                Disable 2FA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
