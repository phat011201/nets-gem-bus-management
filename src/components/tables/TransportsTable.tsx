/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';

import Button from '../ui/button/Button';
import { TRANSPORT, USER } from '@/data/data';
import { useAPI } from '@/hooks/useAPI';
import Badge from '../ui/badge/Badge';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { useModal } from '@/hooks/useModal';

interface TransportTableProps {
  vehicles?: any[];
  drivers?: any[];
  ticketSellers?: any[];
  currentStation?: any[];
  nextStation?: any[];
}

export default function TransportsTable({
  vehicles,
  drivers,
  ticketSellers,
  currentStation,
  nextStation,
}: TransportTableProps) {
  const [transportData, setTransportData] = useState<TRANSPORT[]>([]);
  const { response, fetchData } = useAPI();
  const { fetchData: deleteFetchData } = useAPI();
  const [userLocal, setUserLocal] = useState<USER>();

  useEffect(() => {
    const fetchStationData = async () => {
      await fetchData('/api/transport', 'GET');
    };
    fetchStationData();
  }, []);

  useEffect(() => {
    if (response) {
      setTransportData(response?.data as TRANSPORT[]);
    }
  }, [response]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if(user){
      setUserLocal(JSON.parse(user));
    }
  }, []);

  const handleDelete = async (id: string) => {
    const deleteData = await deleteFetchData(`/api/transport/${id}`, 'DELETE');
    if (deleteData) {
      const updatedTransportData = transportData.filter(
        (transport) => transport.id !== id,
      );
      setTransportData(updatedTransportData);
    }
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

  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    id: '',
    vehicleId: '',
    driverId: '',
    ticketSellerId: '',
    currentStation: '',
    nextStation: '',
    departureTime: '',
    status: '',
  });
  const { fetchData: updateFetchData } = useAPI();

  const handleSave = async () => {
    if (
      formData.vehicleId &&
      formData.driverId &&
      formData.ticketSellerId &&
      formData.currentStation &&
      formData.nextStation &&
      formData.departureTime &&
      formData.status
    ) {
      try {
        await updateFetchData(`/api/transport/${formData.id}`, 'PUT', formData);
      } catch (err) {
        console.log(err);
        
        alert('Error creating transport');
      }
    } else {
      alert('Please fill all required fields');
    }
    closeModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  interface Transport {
    id: string;
    vehicle: {
      id: string;
      licensePlate: string;
    };
    driver: {
      id: string;
      name: string;
    };
    ticketSeller: {
      id: string;
      name: string;
    };
    currentStation: string;
    nextStation: string;
    departureTime: string;
    status: string;
  }

  const handleOpenModal = (transport: Transport) => {
    setFormData({
      id: transport?.id,
      vehicleId: transport?.vehicle.id,
      driverId: transport?.driver.id,
      ticketSellerId: transport?.ticketSeller.id,
      currentStation: transport?.currentStation,
      nextStation: transport?.nextStation,
      departureTime: transport?.departureTime,
      status: transport?.status,
    });
    console.log('formData', formData);

    openModal();
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
                    Số xe
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tài xế
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Người bán vé
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Thời gian khởi hành
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Lộ trình
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Trạng thái
                  </TableCell>
                  {userLocal?.role === 'ADMIN' ||
                  userLocal?.role === 'OPERATOR' ? (
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  ) : (
                    ''
                  )}
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {transportData?.map((transport) => (
                  <TableRow key={transport.id}>
                    <TableCell className="px-5 py-4 text-white text-start text-theme-sm dark:text-white">
                      {transport?.vehicle.licensePlate}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {transport?.driver.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {transport?.ticketSeller.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {convertDateTime(transport?.departureTime)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {transport?.currentStation} - {transport?.nextStation}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {transport?.status === 'PENDING' ? (
                        <Badge color={`info`}>Đang chờ</Badge>
                      ) : transport?.status === 'IN_PROGRESS' ? (
                        <Badge color={`warning`}>Đang chạy</Badge>
                      ) : (
                        <Badge color={`success`}>Hoàn thành</Badge>
                      )}
                    </TableCell>
                    {userLocal?.role === 'ADMIN' ||
                    userLocal?.role === 'OPERATOR' ? (
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="md"
                            onClick={() => handleOpenModal(transport)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="md"
                            onClick={() => handleDelete(transport.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    ) : (
                      ''
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
              Chỉnh sửa vận chuyển
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>Vehicle</Label>
                    {/*<Input onChange={handleChange} type="text" placeholder="Vehicle ID"*/}
                    {/*       name="vehicleId"/>*/}
                    <select
                      name={`vehicleId`}
                      id="vehicleId"
                      defaultValue={formData?.vehicleId}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Biển số xe</option>
                      {vehicles?.map((vehicle) => (
                        <option value={vehicle.id} key={vehicle.id}>
                          {vehicle.licensePlate}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label>Driver</Label>
                    {/*<Input onChange={handleChange} type="text" placeholder="Driver ID"*/}
                    {/*       name="driverId"/>*/}
                    <select
                      name={`driverId`}
                      id={`driverId`}
                      defaultValue={formData?.driverId}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Tài xế</option>
                      {drivers?.map((driver) => (
                        <option value={driver.id} key={driver.id}>
                          {driver.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label>Ticket Seller</Label>
                    {/*<Input onChange={handleChange} type="text" placeholder="Operator ID"*/}
                    {/*       name="operatorId"/>*/}

                    <select
                      name={`ticketSellerId`}
                      id={`ticketSellerId`}
                      defaultValue={formData?.ticketSellerId}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Người bán vé</option>
                      {ticketSellers?.map((ticketSeller) => (
                        <option value={ticketSeller.id} key={ticketSeller.id}>
                          {ticketSeller.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label>Current Station</Label>
                    {/*<Input onChange={handleChange} type="text" placeholder="Current Station"*/}
                    {/*       name="currentStation"/>*/}
                    <select
                      name={`currentStation`}
                      id={`currentStation`}
                      defaultValue={formData?.currentStation}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Bến xuất phát</option>
                      {currentStation?.map((station) => (
                        <option value={station.name} key={station.name}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label>Next Station</Label>
                    {/*<Input onChange={handleChange} type="text" placeholder="Next Station"*/}
                    {/*       name="nextStation"/>*/}
                    <select
                      name={`nextStation`}
                      id={`nextStation`}
                      defaultValue={formData?.nextStation}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Bế đậu</option>
                      {nextStation?.map((station) => (
                        <option value={station.name} key={station.name}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label>Departure Time</Label>
                    <Input
                      onChange={handleChange}
                      type="datetime-local"
                      name="departureTime"
                      defaultValue={convertDateTime(formData?.departureTime)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Status</Label>
                    {/*<Input onChange={handleChange} type="text" placeholder="Next Station"*/}
                    {/*       name="nextStation"/>*/}
                    <select
                      name={`status`}
                      id={`status`}
                      onChange={handleChange}
                      defaultValue={formData?.status}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Status</option>
                      <option value="PENDING">Đang chờ</option>
                      <option value="IN_PROGRESS">Đang chạy</option>
                      <option value="COMPLETED">Hoàn thành</option>
                    </select>
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
