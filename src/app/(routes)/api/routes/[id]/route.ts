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
    const { departureStationId, arrivalStationId, departureTime, arrivalTime } =
      body;

    if (
      !departureStationId ||
      !arrivalStationId ||
      !departureTime ||
      !arrivalTime
    ) {
      return new Response(
        JSON.stringify({ message: 'Thiếu thông tin bắt buộc' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const departureDate = new Date(departureTime);
    const arrivalDate = new Date(arrivalTime);

    if (isNaN(departureDate.getTime()) || isNaN(arrivalDate.getTime())) {
      return new Response(
        JSON.stringify({ message: 'Thời gian không hợp lệ' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Kiểm tra Station tồn tại
    const [departureStation, arrivalStation] = await Promise.all([
      prisma.station.findUnique({ where: { id: departureStationId } }),
      prisma.station.findUnique({ where: { id: arrivalStationId } }),
    ]);

    if (!departureStation || !arrivalStation) {
      return new Response(
        JSON.stringify({ message: 'Chi nhánh không tồn tại' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const updatedRoute = await prisma.route.update({
      where: { id },
      data: {
        departureStationId,
        arrivalStationId,
        departureTime: departureDate,
        arrivalTime: arrivalDate,
      },
    });

    return new Response(
      JSON.stringify({ message: 'Cập nhật thành công', data: updatedRoute }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: 'Server error',
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
