import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { trainId, seatId, userId } = await request.json();

    if (!trainId || !seatId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        user_id: userId,
        train_id: trainId,
        booking_status: 'confirmed',
        total_amount: 100.00, // Same fixed price as in summary
        BookingSeat: {
          create: {
            seat_id: seatId,
          },
        },
      },
    });

    // Update seat status from locked to booked
    await prisma.seat.update({
      where: { id: seatId },
      data: { is_locked: true }, // Keep it locked as it's now booked
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 