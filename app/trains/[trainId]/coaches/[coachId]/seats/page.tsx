'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Seat {
  id: string;
  seat_number: string;
  is_locked: boolean;
}

export default function SeatsPage() {
  const params = useParams<{ trainId: string; coachId: string }>();
  const router = useRouter();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(`/api/trains/${params.trainId}/coaches/${params.coachId}/seats`);
        if (!response.ok) {
          throw new Error('Failed to fetch seats');
        }
        const data = await response.json();
        setSeats(data);
      } catch (error) {
        console.error('Error fetching seats:', error);
        setError('Failed to load seats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [params.trainId, params.coachId]);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    // Change from booking-summary to booking
    router.push(`/trains/${params.trainId}/booking?seats=${selectedSeats.join(',')}`);
  };

  if (loading) {
    return <div className="text-center p-4">Loading seats...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Select Seats</h1>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
        {seats.map((seat) => (
          <button
            key={seat.id}
            disabled={seat.is_locked}
            onClick={() => handleSeatClick(seat.id)}
            className={`
              p-4 rounded-md text-center
              ${seat.is_locked 
                ? 'bg-gray-200 cursor-not-allowed' 
                : selectedSeats.includes(seat.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 hover:border-blue-500'
              }
            `}
          >
            {seat.seat_number}
          </button>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p className="font-semibold">Selected Seats: {selectedSeats.length}</p>
          </div>
          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 