'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';

interface Train {
  id: string;
  train_number: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string | null;
}

interface Seat {
  id: string;
  seat_number: string;
  coach_id: string;
}

export default function BookingSummaryPage() {
  const params = useParams<{ trainId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const trainId = params?.trainId;
  const [train, setTrain] = useState<Train | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedSeatIds = searchParams?.get('seats')?.split(',') || [];

  useEffect(() => {
    const fetchData = async () => {
      if (!trainId) {
        setError('Train ID is required');
        setLoading(false);
        return;
      }

      try {
        // Fetch train details
        const trainResponse = await fetch(`/api/trains/${trainId}`);
        if (!trainResponse.ok) throw new Error('Failed to fetch train details');
        const trainData = await trainResponse.json();
        setTrain(trainData);

        // Only fetch seats if there are selected seats
        if (selectedSeatIds.length > 0) {
          const seatsResponse = await fetch(`/api/trains/${trainId}/seats?ids=${selectedSeatIds.join(',')}`);
          if (!seatsResponse.ok) throw new Error('Failed to fetch seats details');
          const seatsData = await seatsResponse.json();
          setSeats(seatsData);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trainId, selectedSeatIds]);

  const handleConfirmBooking = async () => {
    if (!trainId) {
      setError('Train ID is required');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainId: trainId,
          seatIds: selectedSeatIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await response.json();
      router.push(`/bookings/${booking.id}/confirmation`);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading booking details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (!train) {
    return <div className="text-center text-red-500 p-4">Train not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Booking Summary</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Train Details</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Train Number:</span> {train.train_number}</p>
          <p><span className="font-medium">From:</span> {train.origin}</p>
          <p><span className="font-medium">To:</span> {train.destination}</p>
          <p><span className="font-medium">Departure:</span> {new Date(train.departure_date).toLocaleString()}</p>
          {train.return_date && (
            <p><span className="font-medium">Return:</span> {new Date(train.return_date).toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Selected Seats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {seats.map((seat) => (
            <div key={seat.id} className="p-3 border rounded-md">
              <p className="font-medium">Seat {seat.seat_number}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p className="font-semibold">Total Seats: {seats.length}</p>
          </div>
          <button
            onClick={handleConfirmBooking}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
} 