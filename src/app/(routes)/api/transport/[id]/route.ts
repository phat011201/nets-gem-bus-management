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

    const body = await req.json();
    const {
      vehicleId,
      driverId,
      ticketSellerId,
      currentStation,
      nextStation,
      departureTime,
      status,
    } = body;

    if (
      !vehicleId ||
      !driverId ||
      !ticketSellerId ||
      !currentStation ||
      !nextStation ||
      !departureTime ||
      !status
    ) {
      return new Response(
        JSON.stringify({
          message:
            'Vehicle id, driver id, ticket seller id, current station, next station, departure time and status are required',
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
        currentStation,
        nextStation,
        departureTime,
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
