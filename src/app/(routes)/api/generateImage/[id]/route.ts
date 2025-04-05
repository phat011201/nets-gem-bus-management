import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id' }), {
        status: 400,
      });
    }

    const transports = await prisma.transport.findMany({
      select: {
        id: true,
        vehicle: {
          select: {
            id: true,
            licensePlate: true,
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
        routes: {
          select: {
            id: true,
            departureStation: {
              select: {
                id: true,
                name: true,
              },
            },
            arrivalStation: {
              select: {
                id: true,
                name: true,
              },
            },
            departureTime: true,
            arrivalTime: true,
            departureStamp: true,
            arrivalStamp: true,
            departureApprovedBy: {
              select: {
                id: true,
                name: true,
              },
            },
            arrivalApprovedBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const index = transports.findIndex((transport) => transport.id === id);
    if (index === -1) {
      return new Response(JSON.stringify({ message: 'Not Found' }), {
        status: 404,
      });
    }

    const transport = transports[index];

    const convertTime = (time: string) => {
      const date = new Date(time);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const date = new Date(transport.departureTime);
    const dateTransport = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    // Generate the PDF from HTML
    const htmlContent = `
  <html>
    <head>
      <title>Transport Report</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body style="font-family: Times New Roman, Times, serif">
      <div class="min-h-screen rounded-2xl border border-gray-200 bg-white p-7">
        <div class="mx-auto w-full max-w-[1130px] text-center">
          <div class="mb-5">
            <div class="flex justify-between items-center mb-5">
              <p class="text-2xl text-center font-bold">
                Công ty CP vận tải ô tô <br /> Lâm đồng <br /> *****
              </p>
              <p class="font-bold text-2xl">
                Số: <span class="text-blue-600 font-semibold">${(index + 1)
                  .toString()
                  .padStart(7, '0')}</span>
              </p>
            </div>

            <div class="flex flex-col justify-center items-center mb-5 gap-5">
              <h1 class="font-black text-4xl">LỆNH VẬN CHUYỂN XE BUÝT</h1>
              <h2 class="font-semibold text-2xl">
                Tuyến: <span class="text-blue-600">${
                  transport.currentStation
                } - ${transport.nextStation}</span>
              </h2>
              <h2 class="font-semibold text-2xl">
                GIÁM ĐỐC CÔNG TY CẤP CHO XE <span class="text-blue-600">${
                  transport.vehicle.licensePlate
                }</span>
              </h2>
            </div>

            <div class="flex flex-col items-start mb-5">
              <p class="text-xl text-center font-semibold">
                Họ và tên lái xe: <span class="text-blue-600">${
                  transport.driver.name
                }</span>;
                Số giấy phép lái xe: <span class="text-blue-600">${
                  transport.driver.driverslicensenumber
                }</span>;
                Hạng: <span class="text-blue-600">${
                  transport.driver.rank
                }</span>
              </p>
              <p class="text-xl text-center font-semibold">
                Nhân viên bán vé: <span class="text-blue-600 font-semibold">${
                  transport.ticketSeller.name
                }</span>
              </p>
              <p class="text-xl text-start font-semibold">
                Ngày vận doanh: <span class="text-blue-600 font-semibold">
                  Từ ${date.getHours()} giờ ${date.getMinutes()} phút tại ${
      transport.currentStation
    } đến 18 giờ 15 phút tại ${transport.nextStation} ngày ${dateTransport}
                </span>
              </p>
              <div class="flex items-start justify-between w-full">
                <h3 class="font-semibold text-xl pb-24 pt-3">Người nhận lệnh</h3>
                <h3 class="font-semibold text-xl pb-24 pt-3">Người giao lệnh</h3>
                <h3 class="font-semibold flex flex-col text-xl pt-3">
                  GIÁM ĐỐC CÔNG TY
                  <span class="text-blue-600 font-semibold pt-36">Nguyễn Văn Tình</span>
                </h3>
              </div>
            </div>

            <table class="w-full text-left border border-gray-200">
              <thead>
                <tr class="bg-gray-100">
                  <th class="text-center border border-gray-200 p-2">Lượt</th>
                  <th class="text-center border border-gray-200 p-2">Bến đi</th>
                  <th class="text-center border border-gray-200 p-2">Giờ đi</th>
                  <th class="text-center border border-gray-200 p-2">Điều hành xác nhận</th>
                  <th class="text-center border border-gray-200 p-2">Bến đến</th>
                  <th class="text-center border border-gray-200 p-2">Giờ đến</th>
                  <th class="text-center border border-gray-200 p-2">Điều hành xác nhận</th>
                </tr>
              </thead>
              <tbody>
                ${transport.routes
                  .map(
                    (route, idx) => `
                  <tr class="bg-inherit">
                    <td class="text-center border border-gray-200 p-2">${
                      idx + 1
                    }</td>
                    <td class="text-center border border-gray-200 p-2">${
                      route.departureStation.name
                    }</td>
                    <td class="text-center border border-gray-200 p-2">${convertTime(
                      route.departureTime.toString(),
                    )}</td>
                    <td class="flex justify-center items-center text-center border border-gray-200 p-2">
                      ${
                        route.departureStamp
                          ? `<img src="${route.departureStamp}" class="w-40 h-20 rounded object-contain" />`
                          : `<p class="text-red-500 font-semibold">Chưa xác nhận</p>`
                      }
                    </td>
                    <td class="text-center border border-gray-200 p-2">${
                      route.arrivalStation.name
                    }</td>
                    <td class="text-center border border-gray-200 p-2">${convertTime(
                      route.arrivalTime.toString(),
                    )}</td>
                    <td class="flex justify-center border border-gray-200 p-2">
                      ${
                        route.arrivalStamp
                          ? `<img src="${route.arrivalStamp}" class="w-40 h-20 rounded object-contain" />`
                          : `<p class="text-red-500 font-semibold">Chưa xác nhận</p>`
                      }
                    </td>
                  </tr>
                `,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const imageBuffer = await page.screenshot({ type: 'png', fullPage: true });

    await browser.close();

    // Send the image as the response
    return new Response(
      JSON.stringify({
        message: 'Image generated successfully',
        data: Buffer.from(imageBuffer).toString('base64'),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': 'attachment; filename=document.png',
        },
      },
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500 },
    );
  }
}
