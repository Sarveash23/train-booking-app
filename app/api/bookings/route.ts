import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export async function POST(request: Request) {
  try {
    const { trainId, seatIds } = await request.json();

    // Validate input
    if (!trainId || !seatIds || seatIds.length === 0) {
      return NextResponse.json(
        { error: 'Train ID and seat IDs are required' },
        { status: 400 }
      );
    }

    // First, check if seats are already booked
    const existingSeats = await prisma.seat.findMany({
      where: {
        id: {
          in: seatIds,
        },
        is_locked: true,
      },
    });

    if (existingSeats.length > 0) {
      return NextResponse.json(
        { error: 'Some selected seats are already booked' },
        { status: 400 }
      );
    }

    // Create a test user if not exists
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phone: '1234567890',
        },
      });
    }

    // Calculate total amount
    const pricePerSeat = 100; // Example price
    const totalAmount = new Decimal(seatIds.length * pricePerSeat);

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        user_id: user.id,
        train_id: trainId,
        booking_status: 'CONFIRMED',
        total_amount: totalAmount,
        BookingSeat: {
          create: seatIds.map(seatId => ({
            seat_id: seatId,
          })),
        },
      },
      include: {
        train: true,
        BookingSeat: {
          include: {
            seat: true,
          },
        },
      },
    });

    // Lock the selected seats
    await prisma.seat.updateMany({
      where: {
        id: {
          in: seatIds,
        },
      },
      data: {
        is_locked: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 