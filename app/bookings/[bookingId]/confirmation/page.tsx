'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Booking {
  id: string;
  total_amount: number;
  booking_status: string;
  created_at: string;
  train: {
    train_number: string;
    origin: string;
    destination: string;
    departure_date: string;
  };
  BookingSeat: Array<{
    seat: {
      seat_number: string;
    };
  }>;
}

export default function BookingConfirmationPage() {
  const params = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.bookingId}`);
        if (!response.ok) throw new Error('Failed to fetch booking details');
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (params.bookingId) {
      fetchBooking();
    }
  }, [params.bookingId]);

  if (loading) {
    return <div className="text-center p-4">Loading booking details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (!booking) {
    return <div className="text-center text-red-500 p-4">Booking not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-100 border border-green-400 rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
          <p className="text-green-700">Your booking has been successfully confirmed.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Booking ID:</span> {booking.id}</p>
            <p><span className="font-medium">Status:</span> {booking.booking_status}</p>
            <p><span className="font-medium">Total Amount:</span> ${booking.total_amount}</p>
            <p><span className="font-medium">Booked On:</span> {new Date(booking.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Journey Details</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Train Number:</span> {booking.train.train_number}</p>
            <p><span className="font-medium">From:</span> {booking.train.origin}</p>
            <p><span className="font-medium">To:</span> {booking.train.destination}</p>
            <p><span className="font-medium">Departure:</span> {new Date(booking.train.departure_date).toLocaleString()}</p>
            <p><span className="font-medium">Seats:</span> {booking.BookingSeat.map(bs => bs.seat.seat_number).join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 