'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';

import Button from '../ui/button/Button';
import { BUS_STATION, USER } from '@/data/data';
import { useAPI } from '@/hooks/useAPI';
import Badge from '../ui/badge/Badge';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { useModal } from '@/hooks/useModal';
import { RouteResponseDto } from '@/data/payload/routes.response';
import { UpdateRoutRequestDTO } from '@/data/payload/update-route.request';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RoutesTable() {
  const [routesData, setRoutesData] = React.useState<RouteResponseDto[]>([]);

  const [userLocal, setUserLocal] = useState<USER>();

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserLocal(JSON.parse(user));
    }
  }, []);

  const { response, fetchData } = useAPI<unknown, RouteResponseDto[]>();

  const [departureStations, setDepartureStations] = useState<BUS_STATION[]>([]);
  const [arrivalStations, setArrivalStations] = useState<BUS_STATION[]>([]);

  const fetchVehicleData = useCallback(async () => {
    await fetchData('/api/routes', 'GET');
  }, [fetchData]);

  const { fetchData: fetchStationData} = useAPI<unknown, BUS_STATION[]>();

  const fetchDataForDropdowns = useCallback(async () => {
    try {
      const station = await fetchStationData('/api/stations', 'GET');
      if (Array.isArray(station?.data)) {
        setDepartureStations(station?.data);
        setArrivalStations(station?.data);
      }
    } catch (err) {
      console.error('Failed to fetch dropdown data', err);
    }
  }, [fetchStationData]);

  useEffect(() => {
    fetchVehicleData();
    fetchDataForDropdowns();
  }, [fetchVehicleData, fetchDataForDropdowns]);

  useEffect(() => {
    if (response) {
      setRoutesData(response.data);
      console.log(response.data);
      
    }
  }, [response]);

  const handleDelete = (id: string) => {
    const newData = routesData?.filter((vehicle) => vehicle.id !== id);
    setRoutesData(newData);
  };

  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<UpdateRoutRequestDTO>({
    id: '',
    departureStationId: '',
    arrivalStationId: '',
    departureTime: '',
    arrivalTime: '',
    approvedById: '',
    departureStamp: '',
    arrivalStamp: '',
  });
  const { fetchData: updatedFetchData } = useAPI();
  const handleSave = async () => {
    if (
      formData.departureStationId &&
      formData.arrivalStationId &&
      formData.approvedById
    ) {
      try {
        await updatedFetchData(`/api/routes/${formData.id}`, 'PUT', {
          departureStationId: formData.departureStationId,
          arrivalStationId: formData.arrivalStationId,
          departureTime: new Date(formData.departureTime),
          arrivalTime: new Date(formData.arrivalTime),
          approvedById: formData.approvedById,
        });
      } catch (err) {
        console.log(err);
        alert('Error creating routes');
      }
    } else {
      alert('Please fill biến số xe và trạng thái');
    }
    closeModal();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (route: UpdateRoutRequestDTO) => {
    setFormData({
      id: route.id,
      departureStationId: route.departureStationId,
      arrivalStationId: route.arrivalStationId,
      departureTime: route.departureTime,
      arrivalTime: route.arrivalTime,
      approvedById: route.approvedById,
      departureStamp: route.departureStamp,
      arrivalStamp: route.arrivalStamp,
    });
    openModal();
  };

  const convertDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString('en-US', options).replace(',', '');
  };

  const handleCheckinDeparture = async (
    routeId: string,
    departureStationId: string,
  ) => {
    try {
      await updatedFetchData(
        `/api/routes/checkin/departure/${routeId}`,
        'PUT',
        {
          departureStationId,
        },
      );
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Error checking in');
    }
  };

  const handleCheckinArrival = async (
    routeId: string,
    arrivalStationId: string,
  ) => {
    try {
      await updatedFetchData(`/api/routes/checkin/arrival/${routeId}`, 'PUT', {
        arrivalStationId,
      });
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Error checking in');
    }
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Bến đi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Giờ đi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Điều hành xác nhận đi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Bến đến
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Giờ đến
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Điều hành xác nhận đến
                  </TableCell>
                  {(userLocal?.role === 'ADMIN' ||
                    userLocal?.role === 'OPERATOR') && (
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {routesData?.map((route) => (
                  <TableRow key={route?.id}>
                    <TableCell className="px-5 py-4 text-white text-start text-theme-sm dark:text-white">
                      {route?.departureStation?.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-white text-start text-theme-sm dark:text-white">
                      {convertDateTime(route?.departureTime)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-white text-start text-theme-sm dark:text-white">
                      {route?.departureStamp ? (
                        <Image
                          src={`/images/stamp/${route.departureStamp}`}
                          alt={'stamp'}
                          width={50}
                          height={50}
                          className="w-30 h-20 object-fill rounded"
                        />
                      ) : (
                        <Badge color="error">Chưa xác nhận</Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-white text-start text-theme-sm dark:text-white">
                      {route.arrivalStation?.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-white text-start text-theme-sm dark:text-white">
                      {convertDateTime(route?.arrivalTime)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-white text-start text-theme-sm dark:text-white">
                      {route?.arrivalStamp ? (
                        <Image
                          src={`/images/stamp/${route.arrivalStamp}`}
                          alt={'stamp'}
                          width={50}
                          height={50}
                          className="w-30 h-20 object-fill rounded"
                        />
                      ) : (
                        <Badge color="error">Chưa xác nhận</Badge>
                      )}
                    </TableCell>
                    {(userLocal?.role === 'ADMIN' ||
                      userLocal?.role === 'OPERATOR') && (
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="md"
                              onClick={() =>
                                handleOpenModal({
                                  id: route.id,
                                  departureStationId: route.departureStation.id,
                                  arrivalStationId: route.arrivalStation.id,
                                  departureTime: route.departureTime,
                                  arrivalTime: route.arrivalTime,
                                  approvedById: route.approvedBy.id,
                                  departureStamp: route.departureStamp,
                                  arrivalStamp: route.arrivalStamp,
                                })
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              size="md"
                              onClick={() => handleDelete(route.id)}
                            >
                              Delete
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="md"
                              onClick={() =>
                                handleCheckinDeparture(
                                  route.id,
                                  route.departureStation.id,
                                )
                              }
                            >
                              Check in đi
                            </Button>
                            <Button
                              size="md"
                              onClick={() =>
                                handleCheckinArrival(
                                  route.id,
                                  route.arrivalStation.id,
                                )
                              }
                            >
                              Check in đến
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Chỉnh sửa lộ trình
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>Departure Stations</Label>
                    <select
                      name={`departureStationId`}
                      id="departureStationId"
                      onChange={handleChange}
                      defaultValue={formData.departureStationId}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Bến đi</option>
                      {departureStations?.map((value) => (
                        <option value={value.id} key={value.id}>
                          {value.name} - {value.address}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label>thời gian đi</Label>
                    <Input
                      onChange={handleChange}
                      type="datetime-local"
                      defaultValue={formData.departureTime}
                      name="departureTime"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Approved By</Label>
                    <select
                      name={`arrivalStationId`}
                      id="arrivalStationId"
                      onChange={handleChange}
                      defaultValue={formData.arrivalStationId}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Bến đến</option>
                      {arrivalStations?.map((value) => (
                        <option value={value.id} key={value.id}>
                          {value.name} - {value.address}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label>thời gian đến</Label>
                    <Input
                      onChange={handleChange}
                      type="datetime-local"
                      defaultValue={formData.arrivalTime}
                      name="arrivalTime"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
