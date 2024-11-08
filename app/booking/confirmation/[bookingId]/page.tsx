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
    departure_time: string;
    arrival_time: string;
  };
  seat: {
    coach_number: string;
    seat_number: string;
  };
  total_amount: number;
  booking_status: string;
}

export default function BookingConfirmationPage() {
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

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-600">Booking Confirmed!</h1>
          <p className="text-gray-600">Booking ID: {booking.id}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Train Details</h2>
            <p>Train Number: {booking.train.train_number}</p>
            <p>{booking.train.origin} → {booking.train.destination}</p>
            <p>Departure: {new Date(booking.train.departure_time).toLocaleString()}</p>
            <p>Arrival: {new Date(booking.train.arrival_time).toLocaleString()}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Seat Details</h2>
            <p>Coach: {booking.seat.coach_number}</p>
            <p>Seat: {booking.seat.seat_number}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Payment Details</h2>
            <p>Total Amount: ${booking.total_amount}</p>
            <p>Status: {booking.booking_status}</p>
          </div>

          <div className="flex space-x-4 justify-center mt-6">
            <Button onClick={() => router.push('/home')}>
              Back to Home
            </Button>
            <Button onClick={() => router.push('/booking')}>
              Book Another Ticket
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 