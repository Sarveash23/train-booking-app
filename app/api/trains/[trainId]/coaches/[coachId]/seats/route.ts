import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { trainId: string; coachId: string } }
) {
  try {
    const seats = await prisma.seat.findMany({
      where: {
        coach_id: params.coachId,
      },
    });

    return NextResponse.json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seats' },
      { status: 500 }
    );
  }
} 