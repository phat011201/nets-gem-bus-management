import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Lấy danh sách phương tiện kèm theo thông tin vận chuyển
        const vehicles = await prisma.vehicle.findMany({
            select: {
                id: true,
                licensePlate: true,
                status: true,
                transports: {
                    select: {
                        driver: true,
                        operator: true,
                        ticketSeller: true,
                        currentStation: true,
                        nextStation: true,
                    },
                },
            },
        });

        // Chuyển đổi dữ liệu để phù hợp với format yêu cầu
        const formattedVehicles = vehicles.map((vehicle) => {
            const transport = vehicle.transports[0] || {};
            return {
                id: vehicle.id,
                licensePlate: vehicle.licensePlate,
                driver: transport.driver || null,
                operator: transport.operator || null,
                ticketSeller: transport.ticketSeller || null,
                currentStation: transport.currentStation || null,
                nextStation: transport.nextStation || null,
                status: vehicle.status,
            };
        });

        return new Response(
            JSON.stringify({
                message: 'Get all vehicles successfully',
                data: formattedVehicles,
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
                message: 'Failed to fetch vehicles',
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
        const {licensePlate, status} = await request.json();

        if (!licensePlate || !status) {
            return new Response(
                JSON.stringify({message: 'License plate and status are required'}),
                {status: 400, headers: {'Content-Type': 'application/json'}}
            );
        }

        const newVehicle = await prisma.vehicle.create({
            data: {licensePlate, status},
        });

        return new Response(
            JSON.stringify({
                message: 'Vehicle created successfully',
                data: newVehicle,
                timestamp: new Date().toISOString(),
            }),
            {
                status: 201,
                headers: {'Content-Type': 'application/json'},
            },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: 'Failed to create vehicle',
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
                status: 500,
                headers: {'Content-Type': 'application/json'},
            },
        );
    }
}

export async function PUT(request: Request) {
    try {
        const {id, licensePlate, status} = await request.json();

        if (!id || !licensePlate || !status) {
            return new Response(
                JSON.stringify({message: 'ID, license plate and status are required'}),
                {status: 400, headers: {'Content-Type': 'application/json'}}
            );
        }

        const updatedVehicle = await prisma.vehicle.update({
            where: {id},
            data: {licensePlate, status},
        });

        return new Response(
            JSON.stringify({
                message: 'Vehicle updated successfully',
                data: updatedVehicle,
                timestamp: new Date().toISOString(),
            }),
            {
                status: 200,
                headers: {'Content-Type': 'application/json'},
            },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: 'Failed to update vehicle',
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
                status: 500,
                headers: {'Content-Type': 'application/json'},
            },
        );
    }
}