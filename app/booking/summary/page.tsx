'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';

interface BookingSummary {
  train: {
    train_number: string;
    origin: string;
    destination: string;
    departure_time: string;
    arrival_time: string;
  };
  coach: {
    coach_number: string;
  };
  seat: {
    seat_number: string;
  };
  total_amount: number;
}

export default function BookingSummaryPage() {
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const trainId = params?.get('trainId');
  const seatId = params?.get('seatId');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          `/api/booking/summary?trainId=${trainId}&seatId=${seatId}`
        );
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        toast.error('Failed to load booking summary');
      }
    };

    if (trainId && seatId) {
      fetchSummary();
    }
  }, [trainId, seatId]);

  const handleConfirmBooking = async () => {
    try {
      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainId,
          seatId,
          userId: user?.id,
        }),
      });

      if (response.ok) {
        const booking = await response.json();
        router.push(`/booking/payment/${booking.id}`);
      } else {
        toast.error('Booking confirmation failed');
      }
    } catch (error) {
      toast.error('Booking confirmation failed');
    }
  };

  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Booking Summary</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Train Details</h2>
            <p>Train Number: {summary.train.train_number}</p>
            <p>{summary.train.origin} → {summary.train.destination}</p>
            <p>Departure: {new Date(summary.train.departure_time).toLocaleString()}</p>
            <p>Arrival: {new Date(summary.train.arrival_time).toLocaleString()}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Seat Details</h2>
            <p>Coach: {summary.coach.coach_number}</p>
            <p>Seat: {summary.seat.seat_number}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Payment Details</h2>
            <p>Total Amount: ${summary.total_amount}</p>
          </div>

          <Button onClick={handleConfirmBooking} className="w-full">
            Confirm Booking
          </Button>
        </div>
      </Card>
    </div>
  );
} 