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
        departureTime: true,
        arrivalTime: true,
        vehicle: true,
        driver: true,
        operator: true,
        ticketSeller: true,
        routes: {
          select: {
            id: true,
            departureTime: true,
            arrivalTime: true,
            departureStation: true,
            arrivalStation: true,
            departureApprovedBy: true,
            arrivalApprovedBy: true,
            departureStamp: true,
            arrivalStamp: true,
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

    const responseData = {
      id: transport.id,
      departureTime: transport.departureTime,
      arrivalTime: transport.arrivalTime,
      transportNumber: transport.id.slice(0, 8),
      routes: transport.routes,
      driver: {
        name: transport.driver?.name,
        driverslicensenumber: transport.driver?.driverslicensenumber,
        rank: transport.driver?.rank,
      },
      ticketSeller: {
        name: transport.ticketSeller?.name,
      },
      operator: {
        name: transport.operator?.name,
      },
      vehicle: {
        licensePlate: transport.vehicle?.licensePlate,
      },
    };

    return NextResponse.json(
      {
        message: 'Get transport successfully',
        data: responseData,
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
