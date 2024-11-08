import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids')?.split(',') || [];

  try {
    const seats = await prisma.seat.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seats details' },
      { status: 500 }
    );
  }
} 