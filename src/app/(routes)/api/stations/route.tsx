import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const stations = await prisma.station.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        stamp: true,
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Get all stations successfully',
        data: stations,
        timestamp: new Date().toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
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

export async function POST(request: Request) {
  try {
    const { name, address, stamp } = await request.json();
    if (!name || !address || !stamp) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const newStation = await prisma.station.create({
      data: { name, address, stamp },
    });

    return new Response(
      JSON.stringify({
        message: 'Station created successfully',
        data: newStation,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: 'Failed to create station',
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
