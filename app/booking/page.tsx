'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

interface Location {
  city: string;
}

export default function BookingPage() {
  const [origins, setOrigins] = useState<Location[]>([]);
  const [destinations, setDestinations] = useState<Location[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch unique origins and destinations from the database
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/trains/locations');
        const data = await response.json();
        setOrigins(data.origins);
        setDestinations(data.destinations);
      } catch (error) {
        toast.error('Failed to load locations');
      }
    };

    fetchLocations();
  }, []);

  const handleSearch = async () => {
    if (!selectedOrigin || !selectedDestination) {
      toast.error('Please select both origin and destination');
      return;
    }

    if (selectedOrigin === selectedDestination) {
      toast.error('Origin and destination cannot be the same');
      return;
    }

    router.push(`/trains?origin=${selectedOrigin}&destination=${selectedDestination}`);
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Search Trains</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Origin</label>
            <Select onValueChange={setSelectedOrigin}>
              <SelectTrigger>
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                {origins.map((location) => (
                  <SelectItem key={location.city} value={location.city}>
                    {location.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Destination</label>
            <Select onValueChange={setSelectedDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((location) => (
                  <SelectItem key={location.city} value={location.city}>
                    {location.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSearch} className="w-full">
            Search Trains
          </Button>
        </div>
      </Card>
    </div>
  );
} 