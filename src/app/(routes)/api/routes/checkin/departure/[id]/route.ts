import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];
    if (!id) {
      return new Response(JSON.stringify({ message: 'Invalid transport ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { departureStationId } = body;

    if (!departureStationId) {
      return new Response(
        JSON.stringify({ message: 'Missing required field' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const departureStation = await prisma.station.findUnique({
      where: { id: departureStationId },
    });

    if (!departureStation) {
      return new Response(
        JSON.stringify({ message: 'Departure station not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const updatedStationRouteStamp = await prisma.route.update({
      where: { id },
      data: {
        departureStamp: departureStation?.stamp,
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Updated successfully',
        data: updatedStationRouteStamp,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: 'Invalid transport ID',
        err: err instanceof Error ? err.message : 'Unknown error',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
