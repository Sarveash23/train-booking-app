import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { trainId: string } }
) {
  try {
    const train = await prisma.train.findUnique({
      where: {
        id: params.trainId,
      },
    });

    if (!train) {
      return NextResponse.json(
        { error: 'Train not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(train);
  } catch (error) {
    console.error('Error fetching train:', error);
    return NextResponse.json(
      { error: 'Failed to fetch train details' },
      { status: 500 }
    );
  }
} 