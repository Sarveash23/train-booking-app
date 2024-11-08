import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: {
        train: true,
        BookingSeat: {
          include: {
            seat: {
              include: {
                coach: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: booking.id,
      train: {
        train_number: booking.train.train_number,
        origin: booking.train.origin,
        destination: booking.train.destination,
        departure_time: booking.train.departure_time,
        arrival_time: booking.train.arrival_time,
      },
      seat: {
        coach_number: booking.BookingSeat[0].seat.coach.coach_number,
        seat_number: booking.BookingSeat[0].seat.seat_number,
      },
      total_amount: booking.total_amount,
      booking_status: booking.booking_status,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch booking details' },
      { status: 500 }
    );
  }
} 