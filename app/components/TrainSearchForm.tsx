'use client';

import React, { useState, useEffect } from 'react';
import { Train } from '@prisma/client';

interface TrainSearchFormProps {
  onSearch: (trains: Train[]) => void;
}

export default function TrainSearchForm({ onSearch }: TrainSearchFormProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/trains/locations');
        if (!response.ok) throw new Error('Failed to fetch locations');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleSearch = async () => {
    if (!origin || !destination || !departureDate) {
      alert('Please fill in all required fields (Origin, Destination, and Departure Date)');
      return;
    }

    console.log('Search button clicked');
    console.log('Form data:', { origin, destination, departureDate, returnDate, passengers });
    
    try {
      const response = await fetch('/api/trains/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origin, destination, departureDate, returnDate, passengers }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch trains: ${response.status}`);
      }

      const data = await response.json();
      console.log('Search response data:', data);
      
      if (Array.isArray(data)) {
        onSearch(data);
      } else {
        console.error('Unexpected response format:', data);
        onSearch([]);
      }
    } catch (error) {
      console.error('Error searching trains:', error);
      onSearch([]);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Origin</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Destination</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Return Date (Optional)</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
          <input
            type="number"
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Search Trains
        </button>
      </div>
    </div>
  );
}