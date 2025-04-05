/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { useModal } from '@/hooks/useModal';
import { useState, useEffect } from 'react';
import { useAPI } from '@/hooks/useAPI';
import TransportsTable from '@/components/tables/TransportsTable';
import TransportModal from '@/components/modals/TransportModal';

export interface ITransportFormData {
  vehicleId: string;
  driverId: string;
  ticketSellerId: string;
  operatorId: string;
  currentStation: string;
  nextStation: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
}

export default function TransportsPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<ITransportFormData>({
    vehicleId: '',
    driverId: '',
    ticketSellerId: '',
    operatorId: '',
    currentStation: '',
    nextStation: '',
    departureTime: '',
    arrivalTime: '',
    status: 'PENDING',
  });
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [ticketSellers, setTicketSellers] = useState([]);
  const [operators, setOperators] = useState([]);
  const [currentStation, setCurrentStation] = useState([]);
  const [nextStation, setNextStation] = useState([]);
  const { fetchData } = useAPI();

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

      const operator = employeeData?.data.filter(
        (employee: { role: string }) => employee.role === 'OPERATOR',
      );
      setOperators(operator);

      const station = await fetchData('/api/stations', 'GET');
      setCurrentStation(station?.data);
      setNextStation(station?.data);
    } catch (err) {
      console.error('Failed to fetch dropdown data', err);
    }
  };

  const handleSave = async () => {
    await handleSubmit();
    closeModal();
  };

  const handleSubmit = async () => {
    if (
      formData.vehicleId &&
      formData.driverId &&
      formData.ticketSellerId &&
      formData.currentStation &&
      formData.operatorId &&
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

  useEffect(() => {
    fetchDataForDropdowns();
  }, []);
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
            operators={operators}
            currentStation={currentStation}
            nextStation={nextStation}
          />
        </ComponentCard>
      </div>
      <TransportModal
        isOpen={isOpen}
        closeModal={closeModal}
        handleSave={handleSave}
        setFormData={setFormData}
        formData={formData}
        dropdownData={{
          vehicles,
          drivers,
          ticketSellers,
          operators,
          currentStation,
          nextStation,
        }}
      />
    </div>
  );
}
