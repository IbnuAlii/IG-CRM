'use client';

import { ProtectedRoute } from '@/lib/protected-route';
import { CustomerNavigation } from '@/components/customer/customer-navigation';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['customer']}>
      <div className="flex min-h-screen flex-col bg-muted">
        <CustomerNavigation />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
