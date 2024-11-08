'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BookingDetails {
  id: string;
  train: {
    train_number: string;
    origin: string;
    destination: string;
  };
  total_amount: number;
}

export default function PaymentPage() {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId as string;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`/api/booking/${bookingId}`);
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        toast.error('Failed to load booking details');
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handlePayment = async () => {
    try {
      const response = await fetch(`/api/booking/${bookingId}/pay`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Payment successful!');
        router.push(`/booking/confirmation/${bookingId}`);
      } else {
        toast.error('Payment failed');
      }
    } catch (error) {
      toast.error('Payment failed');
    }
  };

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Payment</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <p>Booking ID: {booking.id}</p>
            <p>Train: {booking.train.train_number}</p>
            <p>{booking.train.origin} → {booking.train.destination}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Amount to Pay</h2>
            <p className="text-2xl font-bold">${booking.total_amount}</p>
          </div>

          <Button onClick={handlePayment} className="w-full">
            Pay Now
          </Button>
        </div>
      </Card>
    </div>
  );
} 