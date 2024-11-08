'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TrainSearchForm from '../components/TrainSearchForm';
import { Train } from '@prisma/client';

export default function TrainBookingPage() {
  const [availableTrains, setAvailableTrains] = useState<Train[]>([]);
  const router = useRouter();

  const handleSearch = (trains: Train[]) => {
    console.log('Received trains in page component:', trains);
    setAvailableTrains(trains);
  };

  const handleBookNow = (trainId: string) => {
    console.log('Booking train:', trainId);
    router.push(`/trains/${trainId}/coaches`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Train Booking</h1>
      
      <TrainSearchForm onSearch={handleSearch} />

      {availableTrains.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Available Trains ({availableTrains.length})</h2>
          <div className="space-y-4">
            {availableTrains.map((train) => (
              <div
                key={train.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{train.train_number}</h3>
                    <p className="text-gray-600">
                      {train.origin} → {train.destination}
                    </p>
                    <p className="text-sm text-gray-500">
                      Departure: {new Date(train.departure_date).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Return: {train.return_date ? new Date(train.return_date).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => handleBookNow(train.id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          Search for trains to see available options
        </p>
      )}
    </div>
  );
} 