import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];
    if (!id) {
      return new Response(JSON.stringify({ message: 'Invalid transport ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const transport = await prisma.transport.findUnique({
      where: { id },
      select: {
        id: true,
        vehicle: {
          select: {
            id: true,
            licensePlate: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            rank: true,
            driverslicensenumber: true,
          },
        },
        ticketSeller: {
          select: {
            id: true,
            name: true,
          },
        },
        operator: {
          select: {
            id: true,
            name: true,
          },
        },
        currentStation: true,
        nextStation: true,
        departureTime: true,
        arrivalTime: true,
        routes: {
          select: {
            id: true,
            departureStation: {
              select: {
                id: true,
                name: true,
              },
            },
            arrivalStation: {
              select: {
                id: true,
                name: true,
              },
            },
            departureTime: true,
            arrivalTime: true,
            departureStamp: true,
            arrivalStamp: true,
            departureApprovedBy: {
              select: {
                id: true,
                name: true,
              },
            },
            arrivalApprovedBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!transport) {
      return NextResponse.json(
        { error: 'Transport not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: 'Get transport successfully',
        data: transport,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 },
    );
  }
}
