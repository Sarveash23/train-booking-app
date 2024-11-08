import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { seatId: string } }
) {
  try {
    const seat = await prisma.seat.update({
      where: {
        id: params.seatId,
      },
      data: {
        is_locked: true,
      },
    });

    return NextResponse.json(seat);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to lock seat' },
      { status: 500 }
    );
  }
} 