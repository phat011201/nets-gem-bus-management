import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const urlParts = req.url.split('/');
  const id = urlParts[urlParts.length - 1];
  if (!id) {
    return new Response(JSON.stringify({ message: 'Invalid transport ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const body = await req.json();
  const { name, address, stamp } = body;

  if (!name || !address || !stamp) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
    });
  }

  try {
    const updatedStation = await prisma.station.update({
      where: { id },
      data: {
        name,
        address,
        stamp,
      },
    });
    return new Response(
      JSON.stringify({
        message: 'Station updated successfully',
        data: updatedStation,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req: Request) {
  const urlParts = req.url.split('/');
  const id = urlParts[urlParts.length - 1];
  if (!id) {
    return new Response(JSON.stringify({ message: 'Invalid transport ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await prisma.station.delete({
      where: { id },
    });
    return new Response(
      JSON.stringify({ message: 'Station deleted successfully' }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      {
        status: 500,
      },
    );
  }
}
