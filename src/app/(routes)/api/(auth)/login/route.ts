import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Tìm user trong database
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // Kiểm tra user có tồn tại không & mật khẩu có khớp không
    if (user && (await bcrypt.compare(password, user.password))) {
      return new Response(
        JSON.stringify({
          message: 'Login successfully',
          data: {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
            avatar: user.avatar,
            branchId: user.stationId,
          },
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
    }

    return new Response(
      JSON.stringify({
        message: 'Login failed',
        timestamp: new Date().toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      }),
      {
        status: 401,
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
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
