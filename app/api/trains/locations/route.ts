import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get unique origins and destinations from the trains table
    const origins = await prisma.train.findMany({
      select: {
        origin: true,
      },
      distinct: ['origin'],
    });

    const destinations = await prisma.train.findMany({
      select: {
        destination: true,
      },
      distinct: ['destination'],
    });

    // Combine locations without using Set
    const allLocations = [
      ...origins.map(o => o.origin),
      ...destinations.map(d => d.destination)
    ];
    
    // Remove duplicates and sort
    const locations = Array.from(new Set(allLocations)).sort();

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
} 