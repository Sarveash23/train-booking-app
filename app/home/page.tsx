'use client';

import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push('/booking')}>
          <h2 className="text-xl font-semibold mb-2">Book Train</h2>
          <p className="text-gray-600">Search and book train tickets</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push('/history')}>
          <h2 className="text-xl font-semibold mb-2">Booking History</h2>
          <p className="text-gray-600">View your booking history</p>
        </Card>
      </div>
    </div>
  );
} 