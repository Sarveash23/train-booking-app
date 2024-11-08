'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Coach {
  id: string;
  coach_number: string;
  train_id: string;
  seats: Array<{
    id: string;
    seat_number: string;
    is_locked: boolean;
  }>;
}

export default function TrainCoachesPage() {
  const params = useParams<{ trainId: string }>();
  const router = useRouter();
  const trainId = params?.trainId ?? '';
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trainId) {
      setError('Train ID is required');
      setLoading(false);
      return;
    }
    
    const fetchCoaches = async () => {
      try {
        console.log('Fetching coaches for train:', trainId);
        const response = await fetch(`/api/trains/${trainId}/coaches`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch coaches');
        }
        
        const data = await response.json();
        console.log('Received coaches data:', data);
        setCoaches(data);
      } catch (error) {
        console.error('Error fetching coaches:', error);
        setError('Failed to load coaches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, [trainId]);

  const handleSelectSeats = (coachId: string) => {
    router.push(`/trains/${trainId}/coaches/${coachId}/seats`);
  };

  if (loading) {
    return <div className="text-center p-4">Loading coaches...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Select a Coach</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">Coach {coach.coach_number}</h2>
            <p className="text-gray-600 mb-4">Available Seats: {coach.seats.filter(seat => !seat.is_locked).length}</p>
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => handleSelectSeats(coach.id)}
            >
              Select Seats
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 