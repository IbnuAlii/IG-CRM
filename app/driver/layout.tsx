'use client';

import { ProtectedRoute } from '@/lib/protected-route';
import { DriverNavigation } from '@/components/driver/driver-navigation';

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['driver']}>
      <div className="flex min-h-screen flex-col bg-muted">
        <DriverNavigation />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
