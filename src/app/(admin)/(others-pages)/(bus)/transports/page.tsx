/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { useModal } from '@/hooks/useModal';
import { useState, useEffect } from 'react';
import { useAPI } from '@/hooks/useAPI';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';
import TransportsTable from '@/components/tables/TransportsTable';

export default function TransportsPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    ticketSellerId: '',
    currentStation: '',
    nextStation: '',
    departureTime: '',
    status: 'PENDING',
  });
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [ticketSellers, setTicketSellers] = useState([]);
  const [currentStation, setCurrentStation] = useState([]);
  const [nextStation, setNextStation] = useState([]);
  const { fetchData } = useAPI();

  useEffect(() => {
    const fetchDataForDropdowns = async () => {
      try {
        const vehicleData = await fetchData('/api/vehicle', 'GET');
        setVehicles(
          vehicleData?.data.filter(
            (vehicle: { status: string }) => vehicle.status === 'ACTIVE',
          ),
        );

        const employeeData = await fetchData('/api/employee', 'GET');
        const drivers = employeeData?.data.filter(
          (employee: { role: string }) => employee.role === 'DRIVER',
        );
        setDrivers(drivers);

        const ticketSellers = employeeData?.data.filter(
          (employee: { role: string }) => employee.role === 'TICKET_SELLER',
        );
        setTicketSellers(ticketSellers);

        const station = await fetchData('/api/stations', 'GET');
        setCurrentStation(station?.data);
        setNextStation(station?.data);
      } catch (err) {
        console.error('Failed to fetch dropdown data', err);
      }
    };
    fetchDataForDropdowns();
  }, []);

  const handleSave = async () => {
    await handleSubmit();
    closeModal();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      formData.vehicleId &&
      formData.driverId &&
      formData.ticketSellerId &&
      formData.currentStation &&
      formData.nextStation
    ) {
      try {
        await fetchData('/api/transport', 'POST', formData);
      } catch (err) {
        console.log('Error creating transport', err);
        alert('Error creating transport');
      }
    } else {
      alert('Please fill all required fields');
    }
  };
  return (
    <div>
      <PageBreadcrumb pageTitle="Vận chuyển" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <Button size={'sm'} onClick={openModal}>
              + Add New
            </Button>
          }
        >
          <TransportsTable
            drivers={drivers}
            vehicles={vehicles}
            ticketSellers={ticketSellers}
            currentStation={currentStation}
            nextStation={nextStation}
          />
        </ComponentCard>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Thêm mới vận chuyển
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
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Biển số xe</option>
                      {vehicles?.map(
                        (vehicle: { id: string; licensePlate: string }) => (
                          <option value={vehicle.id} key={vehicle.id}>
                            {vehicle.licensePlate}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label>Driver</Label>
                    {/*<Input onChange={handleChange} type="text" placeholder="Driver ID"*/}
                    {/*       name="driverId"/>*/}
                    <select
                      name={`driverId`}
                      id={`driverId`}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Tài xế</option>
                      {drivers?.map((driver: { id: string; name: string }) => (
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
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Người bán vé</option>
                      {ticketSellers?.map(
                        (ticketSeller: { id: string; name: string }) => (
                          <option value={ticketSeller.id} key={ticketSeller.id}>
                            {ticketSeller.name}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label>Current Station</Label>
                    {/*<Input onChange={handleChange} type="text" placeholder="Current Station"*/}
                    {/*       name="currentStation"/>*/}
                    <select
                      name={`currentStation`}
                      id={`currentStation`}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Bến xuất phát</option>
                      {currentStation?.map((station: { name: string }) => (
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
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Bế đậu</option>
                      {nextStation?.map((station: { name: string }) => (
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
