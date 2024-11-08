import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { origin, destination, departureDate, returnDate, passengers } = await request.json()
    
    console.log('Received search params:', { origin, destination, departureDate, returnDate, passengers });

    // Create start and end of the selected date to search for trains within that day
    const searchDate = new Date(departureDate);
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
    
    console.log('Searching for trains between:', { startOfDay, endOfDay });

    const trains = await prisma.train.findMany({
      where: {
        origin: origin,
        destination: destination,
        departure_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    
    console.log('Found trains:', trains);
    
    if (trains.length === 0) {
      console.log('No trains found for the given criteria');
    }

    return NextResponse.json(trains)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search trains' }, 
      { status: 500 }
    )
  }
}