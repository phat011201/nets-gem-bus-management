// api/transport/[id]/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  try {
    const urlParts = request.url.split('/');
    const id = urlParts[urlParts.length - 1];
    if (!id) {
      return new Response(
        JSON.stringify({
          message: 'Invalid transport ID',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    const transport = await prisma.transport.findUnique({
      where: {
        id: id,
      },
    });
    if (!transport) {
      return new Response(
        JSON.stringify({
          message: 'Transport not found',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    await prisma.transport.delete({
      where: {
        id: id,
      },
    });
    return new Response(
      JSON.stringify({
        message: 'Delete transport successfully',
        timestamp: new Date().toISOString(),
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
        message: 'Failed to delete transport',
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

export async function PUT(req: Request) {
  try {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];

    if (!id) {
      return new Response(
        JSON.stringify({
          message: 'Invalid transport ID',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const transport = await prisma.transport.findUnique({
      where: {
        id: id,
      },
    });

    if (!transport) {
      return new Response(
        JSON.stringify({
          message: 'Transport not found',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const body = await req.json();
    const {
      vehicleId,
      driverId,
      ticketSellerId,
      operatorId,
      currentStation,
      nextStation,
      departureTime,
      arrivalTime,
      status,
    } = body;

    if (
      !vehicleId ||
      !driverId ||
      !ticketSellerId ||
      !operatorId ||
      !currentStation ||
      !nextStation ||
      !departureTime ||
      !arrivalTime ||
      !status
    ) {
      return new Response(
        JSON.stringify({
          message:
            'Vehicle id, driver id, ticket seller id, operatorId, current station, next station, departure time, arrival time and status are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    const driver = await prisma.user.findUnique({
      where: { id: driverId },
    });

    const ticketSeller = await prisma.user.findUnique({
      where: { id: ticketSellerId },
    });

    const operator = await prisma.user.findUnique({
      where: { id: operatorId },
    })


    if (!vehicle || !driver || !ticketSeller || !operator) {
      return new Response(
        JSON.stringify({
          message: 'Transport, vehicle, driver, operator or ticket seller not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const parsedDepartureTime = new Date(departureTime);
    const parsedArrivalTime = new Date(arrivalTime);
    if (
      isNaN(parsedDepartureTime.getTime()) ||
      isNaN(parsedArrivalTime.getTime())
    ) {
      return new Response(
        JSON.stringify({
          message: 'Invalid departureTime or arrivalTime',
          error:
            'The provided departureTime or arrivalTime is not a valid date',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const updatedTransport = await prisma.transport.update({
      where: { id },
      data: {
        vehicleId,
        driverId,
        ticketSellerId,
        operatorId,
        currentStation,
        nextStation,
        departureTime: parsedDepartureTime,
        arrivalTime: parsedArrivalTime,
        status,
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Transport updated successfully',
        data: updatedTransport,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: 'Failed to delete transport',
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
