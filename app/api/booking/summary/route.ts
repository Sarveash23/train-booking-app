import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trainId = searchParams.get('trainId');
    const seatId = searchParams.get('seatId');

    if (!trainId || !seatId) {
      return NextResponse.json(
        { error: 'Train ID and Seat ID are required' },
        { status: 400 }
      );
    }

    const [train, seat] = await Promise.all([
      prisma.train.findUnique({
        where: { id: trainId },
      }),
      prisma.seat.findUnique({
        where: { id: seatId },
        include: {
          coach: true,
        },
      }),
    ]);

    if (!train || !seat) {
      return NextResponse.json(
        { error: 'Train or seat not found' },
        { status: 404 }
      );
    }

    // Calculate total amount (you can implement your own pricing logic)
    const total_amount = 100; // Example fixed price

    return NextResponse.json({
      train: {
        train_number: train.train_number,
        origin: train.origin,
        destination: train.destination,
        departure_time: train.departure_time,
        arrival_time: train.arrival_time,
      },
      coach: {
        coach_number: seat.coach.coach_number,
      },
      seat: {
        seat_number: seat.seat_number,
      },
      total_amount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch booking summary' },
      { status: 500 }
    );
  }
} 