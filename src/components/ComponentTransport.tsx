/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAPI } from '@/hooks/useAPI';
import PageBreadcrumb from './common/PageBreadCrumb';
import { useEffect, useState } from 'react';
import { ITransport } from '@/data/data';
import ComponentCard from './common/ComponentCard';
import Button from './ui/button/Button';

export default function ComponentTransport() {
  const { fetchData } = useAPI<unknown, ITransport[]>();
  const [dataToday, setDataToday] = useState<ITransport | null>(null);

  useEffect(() => {
    fetchData('/api/routes/transport', 'GET')
      .then((res) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredData = res?.data?.find((item: ITransport) => {
          const departureDate = new Date(item.departureTime);
          departureDate.setHours(0, 0, 0, 0);
          return departureDate.getTime() === today.getTime();
        });

        setDataToday(filteredData || null);
      })
      .catch((err) => console.error('Fetch Error:', err));
  }, []);

  const convertTime = (time: string) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const date = dataToday?.departureTime
    ? new Date(dataToday.departureTime)
    : null;
  const dateTransport = date
    ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    : '';

  const { fetchData: fetchImage } = useAPI<unknown, string>();

  const handlePrintImage = async () => {
    try {
      await fetchImage(`/api/generateImage/${dataToday?.id}`, 'POST') // Gọi API POST để lấy dữ liệu
        .then((data) => {
          // Kiểm tra dữ liệu trả về có chứa ảnh (base64) không
          if (data && data.data) {
            const base64Data = data.data; // Dữ liệu base64 trả về từ server

            // Chuyển base64 thành Blob
            const byteCharacters = atob(base64Data); // Giải mã base64 thành chuỗi byte
            const byteArrays = [];

            for (
              let offset = 0;
              offset < byteCharacters.length;
              offset += 1024
            ) {
              const slice = byteCharacters.slice(offset, offset + 1024);
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }

            // Tạo Blob từ byteArrays
            const blob = new Blob(byteArrays, { type: 'image/png' });

            // Tạo URL tạm thời từ Blob
            const blobUrl = URL.createObjectURL(blob);

            // Tạo thẻ <a> để tải ảnh
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'transport_image.png'; // Đặt tên file khi tải về
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Giải phóng bộ nhớ sau khi tải ảnh
            URL.revokeObjectURL(blobUrl);
          } else {
            console.error('Không có dữ liệu ảnh');
          }
        });
    } catch (err) {
      console.error('Fetch Image Error:', err);
    }
  };

  return (
    <>
      <div>
        <PageBreadcrumb pageTitle="Home Page" />
        <ComponentCard
          title={
            <Button onClick={handlePrintImage}>In phiếu vận chuyển</Button>
          }
        >
          <div
            className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12"
            style={{ fontFamily: 'Times New Roman, Times, serif' }}
          >
            <div className="mx-auto w-full max-w-[1130px] text-center">
              {dataToday ? (
                <div>
                  <div className={`flex justify-between items-center mb-5`}>
                    <p className="text-2xl text-center font-bold">
                      Công ty CP vận tải ô tô <br /> Lâm đồng <br /> *****
                    </p>
                    <p className={`font-bold text-2xl`}>
                      Số:{' '}
                      <span className="text-blue-600 font-semibold">
                        {dataToday.serialNumber}
                      </span>
                    </p>
                  </div>
                  <div
                    className={`flex flex-col justify-center items-center mb-5 gap-5`}
                  >
                    <h1 className={`font-black text-4xl`}>
                      LỆNH VẬN CHUYỂN XE BUÝT
                    </h1>
                    <h2 className={`font-semibold text-2xl`}>
                      Tuyến:{' '}
                      <span className={`text-blue-600`}>
                        {dataToday.currentStation} - {dataToday.nextStation}
                      </span>
                    </h2>
                    <h2 className={`font-semibold text-2xl`}>
                      GIÁM ĐỐC CÔNG TY CẤP CHO XE{' '}
                      <span className={`text-blue-600`}>
                        {dataToday.vehicle.licensePlate}
                      </span>
                    </h2>
                  </div>
                  <div className={`flex flex-col items-start mb-5`}>
                    <p className="text-xl text-center font-semibold">
                      Họ và tên lái xe:{' '}
                      <span className={`text-blue-600`}>
                        {dataToday.driver.name}
                      </span>
                      ; Số giấy phép lái xe:{' '}
                      <span className={`text-blue-600`}>
                        {dataToday.driver.driverslicensenumber}
                      </span>
                      ; Hạng:{' '}
                      <span className={`text-blue-600`}>
                        {dataToday.driver.rank}
                      </span>
                    </p>
                    <p className="text-xl text-center font-semibold">
                      Nhân viên bán vé:{' '}
                      <span className="text-blue-600 font-semibold">
                        {dataToday.ticketSeller.name}
                      </span>
                    </p>
                    <p className="text-xl text-start font-semibold">
                      Ngày vận doanh:{' '}
                      <span className="text-blue-600 font-semibold">
                        Từ {date?.getHours()} giờ {date?.getMinutes()} phút tại{' '}
                        {dataToday.currentStation} đến 18 giờ 15 phút tại{' '}
                        {dataToday.nextStation} ngày {dateTransport}
                      </span>
                    </p>
                    <div className={`flex items-start justify-between w-full`}>
                      <h3 className={`font-semibold text-xl pb-24 pt-3`}>
                        Người nhận lệnh
                      </h3>
                      <h3 className={`font-semibold text-xl pb-24 pt-3`}>
                        Người giao lệnh
                      </h3>
                      <h3
                        className={`font-semibold flex flex-col text-xl pt-3`}
                      >
                        GIÁM ĐỐC CÔNG TY
                        <span className={`text-blue-600 font-semibold pt-36`}>
                          Nguyễn Văn Tình
                        </span>
                      </h3>
                    </div>
                  </div>
                  <table className={`w-full text-left border border-gray-200`}>
                    <thead>
                      <tr className={`bg-gray-100`}>
                        <th
                          className={`text-center border border-gray-200 p-2`}
                        >
                          Lượt
                        </th>
                        <th
                          className={`text-center border border-gray-200 p-2`}
                        >
                          Bến đi
                        </th>
                        <th
                          className={`text-center border border-gray-200 p-2`}
                        >
                          Giờ đi
                        </th>
                        <th
                          className={`text-center border border-gray-200 p-2`}
                        >
                          Điều hành xác nhận
                        </th>
                        <th
                          className={`text-center border border-gray-200 p-2`}
                        >
                          Bến đến
                        </th>
                        <th
                          className={`text-center border border-gray-200 p-2`}
                        >
                          Giờ đến
                        </th>
                        <th
                          className={`text-center border border-gray-200 p-2`}
                        >
                          Điều hành xác nhận
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataToday.routes?.map((route, idx) => (
                        <tr key={idx} className={`bg-inherit`}>
                          <td
                            className={`text-center border border-gray-200 p-2`}
                          >
                            {idx + 1}
                          </td>
                          <td
                            className={`text-center border border-gray-200 p-2`}
                          >
                            {route.departureStation.name}
                          </td>
                          <td
                            className={`text-center border border-gray-200 p-2`}
                          >
                            {convertTime(route.departureTime)}
                          </td>
                          <td
                            className={`flex justify-center items-center text-center border border-gray-200 p-2`}
                          >
                            {route.departureStamp ? (
                              <img
                                src={route.departureStamp}
                                className="w-40 h-20 rounded object-contain"
                              />
                            ) : (
                              <p className="text-red-500 font-semibold">
                                Chưa xác nhận
                              </p>
                            )}
                          </td>
                          <td
                            className={`text-center border border-gray-200 p-2`}
                          >
                            {route.arrivalStation.name}
                          </td>
                          <td
                            className={`text-center border border-gray-200 p-2`}
                          >
                            {convertTime(route.arrivalTime)}
                          </td>
                          <td
                            className={`flex justify-center border border-gray-200 p-2`}
                          >
                            {route.arrivalStamp ? (
                              <img
                                src={route.arrivalStamp}
                                className="w-40 h-20 rounded object-contain"
                              />
                            ) : (
                              <p className="text-red-500 font-semibold">
                                Chưa xác nhận
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xl text-red-500 font-semibold">
                  Không có chuyến xe nào khởi hành hôm nay.
                </p>
              )}
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
