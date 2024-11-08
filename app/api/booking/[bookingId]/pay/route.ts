import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const booking = await prisma.booking.update({
      where: { id: params.bookingId },
      data: {
        booking_status: 'paid',
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: 'Payment failed' },
      { status: 500 }
    );
  }
} 