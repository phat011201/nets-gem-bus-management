import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transports = await prisma.transport.findMany({
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
    
    if (transports.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'Transport Exist',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const transportRoutes = transports.map((transport, index) => ({
      ...transport,
      serialNumber: (index + 1).toString().padStart(7, '0'),
    }));

    return new Response(
      JSON.stringify({
        message: 'Get All Transport Route',
        data: transportRoutes,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: 'Failed to fetch stations',
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
