import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient(); // Khởi tạo Prisma Client

export async function POST(request: Request) {
    try {
        const {name, username, password} = await request.json();

        const firtUser = await prisma.user.findMany();

        if (firtUser.length === 0) {
            await prisma.user.create({
                data: {
                    name,
                    username,
                    password: await bcrypt.hash(password, 10),
                    role: 'ADMIN',
                },
            });
            return new Response(
                JSON.stringify({
                    message: 'First user created with ADMIN role',
                    data: {
                        id: 1,
                        name: 'Admin',
                        username: 'admin',
                        role: 'ADMIN'
                    },
                    timestamp: new Date().toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    }),
                }),
                {
                    status: 201,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Kiểm tra xem user đã tồn tại chưa
        const existingUser = await prisma.user.findUnique({
            where: {username},
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({
                    message: 'Username already exists',
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const user = await prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword,
                role: 'TICKET_SELLER',
            },
        });

        return new Response(
            JSON.stringify({
                message: 'Register successful',
                data: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    role: user.role
                },
                timestamp: new Date().toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }),
            }),
            {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
            {status: 500, headers: {'Content-Type': 'application/json'}},
        );
    }
}
