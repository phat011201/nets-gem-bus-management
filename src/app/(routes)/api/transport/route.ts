import {PrismaClient} from '@prisma/client';

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
                        status: true,
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
                status: true,
            },
            orderBy: {
                departureTime: 'asc',
            },
        });

        return new Response(
            JSON.stringify({
                message: 'Get all transports successfully',
                data: transports,
                timestamp: new Date().toISOString(),
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: 'Failed to fetch transports',
                error: error instanceof Error ? error.message : 'Unknown error',
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
        const body = await request.json();
        const {
            vehicleId,
            driverId,
            ticketSellerId,
            currentStation,
            nextStation,
            departureTime,
            arrivalTime,
            operatorId,
        } = body;

        // Kiểm tra các trường bắt buộc
        if (!vehicleId || !driverId || !ticketSellerId || !operatorId || !currentStation || !nextStation || !departureTime || !arrivalTime) {
            return new Response(
                JSON.stringify({
                    message: 'Missing required fields',
                    error: 'All fields are required: vehicleId, driverId, operatorId, ticketSellerId, currentStation, nextStation, departureTime, arrivalTime',
                }),
                {status: 400, headers: {'Content-Type': 'application/json'}}
            );
        }

        // Kiểm tra và chuyển đổi departureTime thành đối tượng Date hợp lệ
        const parsedDepartureTime = new Date(departureTime);
        const parsedArrivalTime = new Date(arrivalTime);
        if (isNaN(parsedDepartureTime.getTime()) || isNaN(parsedArrivalTime.getTime())) {
            return new Response(
                JSON.stringify({
                    message: 'Invalid departureTime or arrivalTime',
                    error: 'The provided departureTime or arrivalTime is not a valid date'
                }),
                {status: 400, headers: {'Content-Type': 'application/json'}}
            );
        }

        // Tạo transport mới
        const newTransport = await prisma.transport.create({
            data: {
                vehicleId,
                driverId,
                ticketSellerId,
                currentStation,
                nextStation,
                departureTime: parsedDepartureTime,
                arrivalTime: parsedArrivalTime,
                operatorId,
                status: 'PENDING',
            },
        });

        return new Response(
            JSON.stringify({
                message: 'Transport created successfully',
                data: newTransport,
                timestamp: new Date().toISOString(),
            }),
            {
                status: 201,
                headers: {'Content-Type': 'application/json'},
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({message: 'Failed to create transport', error: error instanceof Error ? error.message : 'Unknown error',}),
            {status: 500, headers: {'Content-Type': 'application/json'}}
        );
    }
}
