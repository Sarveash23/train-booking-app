import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { trainId: string; coachId: string } }
) {
  try {
    const coach = await prisma.coach.findFirst({
      where: {
        id: params.coachId,
        train_id: params.trainId,
      },
    });

    if (!coach) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(coach);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch coach details' },
      { status: 500 }
    );
  }
} 