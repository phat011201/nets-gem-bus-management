import { ROLE } from '@/data/data';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: 'ADMIN',
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        role: true,
        rank: true,
        driverslicensenumber: true,
        signature: true,
        station: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!users) {
      return new Response(
        JSON.stringify({
          message: 'No users found',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const allUsers = users?.map(
      (user: {
        id: string;
        name: string | null;
        username: string;
        avatar: string | null;
        role: ROLE | null;
        rank: string | null;
        driverslicensenumber: string | null;
        signature: string | null;
        station: {
          name: string;
        } | null;
      }) => {
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          rank: user.rank,
          driverslicensenumber: user.driverslicensenumber,
          role: user.role,
          station: {
            name: user.station ? user.station.name : null,
          },
          signature: user.signature,
        };
      },
    );

    return new Response(
      JSON.stringify({
        message: 'Get all users successfully',
        data: allUsers,
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
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Failed to get users',
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

export async function PUT(req: Request) {
  try {
    // Parse body request để lấy ID và các dữ liệu cần cập nhật
    const { id, name, username, avatar, role, signature, rank, driverslicensenumber} = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({
          message: 'User ID is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Cập nhật thông tin người dùng trong cơ sở dữ liệu
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        username,
        avatar,
        rank,
        driverslicensenumber,
        role,
        signature,
      },
    });

    // Trả về kết quả sau khi cập nhật
    return new Response(
      JSON.stringify({
        message: 'User updated successfully',
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          username: updatedUser.username,
          avatar: updatedUser.avatar,
          rank: updatedUser.rank,
          driverslicensenumber: updatedUser.driverslicensenumber,
          role: updatedUser.role,
          signature: updatedUser.signature,
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
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Failed to update user',
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
