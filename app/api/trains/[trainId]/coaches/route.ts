import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { trainId: string } }
) {
  try {
    const coaches = await prisma.coach.findMany({
      where: {
        train_id: params.trainId,
      },
      include: {
        seats: true,
      },
    });

    console.log('Found coaches:', coaches);

    return NextResponse.json(coaches);
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coaches' },
      { status: 500 }
    );
  }
} 