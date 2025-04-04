import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CreateRouteDto } from '@/data/payload/create-route.request';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const routes = await prisma.route.findMany({
      select: {
        id: true,
        departureStation: {
          select: {
            id: true,
            name: true,
            stamp: true,
          },
        },
        arrivalStation: {
          select: {
            id: true,
            name: true,
            stamp: true,
          },
        },
        departureTime: true,
        arrivalTime: true,
        departureApprovedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        arrivalApprovedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        departureStamp: true,
        arrivalStamp: true,
        transport: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        departureTime: 'asc',
      },
    });

    return NextResponse.json(
      { message: 'Lấy danh sách lộ trình thành công', data: routes },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: 'Lỗi server',
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: CreateRouteDto = await req.json();
    const {
      departureStationId,
      arrivalStationId,
      departureTime,
      arrivalTime,
      departureApprovedById,
      arrivalApprovedById,
      transportId,
    } = body;

    // Kiểm tra Station tồn tại
    const departureStation = await prisma.station.findUnique({
      where: { id: departureStationId },
    });
    const arrivalStation = await prisma.station.findUnique({
      where: { id: arrivalStationId },
    });

    if (!departureStation || !arrivalStation) {
      return NextResponse.json(
        { message: 'Chi nhánh không tồn tại' },
        { status: 400 },
      );
    }

    // Kiểm tra User (người phê duyệt đi)
    const departureApprovedBy = await prisma.user.findUnique({
      where: { id: departureApprovedById },
    });
    if (!departureApprovedBy) {
      return NextResponse.json(
        { message: 'Người phê duyệt đi không tồn tại' },
        { status: 400 },
      );
    }

    // Kiểm tra User (người phê duyệt đến)
    const arrivalApprovedBy = await prisma.user.findUnique({
      where: { id: arrivalApprovedById },
    });
    if (!arrivalApprovedBy) {
      return NextResponse.json(
        { message: 'Người phê duyệt đến không tồn tại' },
        { status: 400 },
      );
    }

    // Tạo Route mới
    const newRoute = await prisma.route.create({
      data: {
        departureStationId,
        arrivalStationId,
        departureTime: new Date(departureTime),
        arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
        departureApprovedById,
        arrivalApprovedById,
        transportId: transportId,
      },
      select: {
        id: true,
        departureStationId: true,
        arrivalStationId: true,
        departureTime: true,
        arrivalTime: true,
        departureApprovedById: true,
        arrivalApprovedById: true,
        departureStamp: true,
        transportId: true,
      },
    });

    return NextResponse.json(
      { message: 'Lộ trình tạo thành công', data: newRoute },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
