import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');

  try {
    const trains = await prisma.train.findMany({
      where: {
        origin: {
          contains: origin || '',
        },
        destination: {
          contains: destination || '',
        },
        departure_date: date
          ? {
              gte: new Date(date),
              lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
            }
          : undefined,
      },
    });

    return NextResponse.json(trains);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trains' },
      { status: 500 }
    );
  }
} 