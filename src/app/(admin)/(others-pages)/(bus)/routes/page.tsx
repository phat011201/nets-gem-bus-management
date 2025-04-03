/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import RoutesTable from '@/components/tables/RoutesTable';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { BUS_STATION, USER } from '@/data/data';
import { CreateRouteDto } from '@/data/payload/create-route.request';
import { useAPI } from '@/hooks/useAPI';
import { useModal } from '@/hooks/useModal';
import { useEffect, useState } from 'react';

export default function RoutesPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    departureStationId: '',
    arrivalStationId: '',
    departureTime: '',
    arrivalTime: '',
    approvedById: '',
    stamp: '',
  });

  const [departureStations, setDepartureStations] = useState<BUS_STATION[]>([]);
  const [arrivalStations, setArrivalStations] = useState<BUS_STATION[]>([]);
  const [employees, setEmployees] = useState<USER[]>();
  const { fetchData } = useAPI();
  const { fetchData: fetchStationData } = useAPI<CreateRouteDto, unknown>();

  const fetchDataForDropdowns = async () => {
    try {
      const stations = await fetchStationData('/api/stations', 'GET');
      setDepartureStations(stations?.data);
      setArrivalStations(stations?.data);

      const employees = await fetchStationData('/api/employee', 'GET');
      setEmployees(employees?.data);
    } catch (err) {
      console.error('Failed to fetch dropdown data', err);
    }
  };

  useEffect(() => {
    fetchDataForDropdowns();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (
      formData.departureStationId &&
      formData.arrivalStationId &&
      formData.departureTime &&
      formData.approvedById
    ) {
      try {
        await fetchData('/api/routes', 'POST', {
          ...formData,
          departureTime: new Date(formData.departureTime),
        });
        closeModal();
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin!');
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Lộ Trình" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <Button size={'sm'} onClick={openModal}>
              + Add New
            </Button>
          }
        >
          <RoutesTable />
        </ComponentCard>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Thêm mới lộ trình
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>Departure Stations</Label>
                    {/*<Input onChange={handleChange} type="text" placeholder="Vehicle ID"*/}
                    {/*       name="vehicleId"/>*/}
                    <select
                      name={`departureStationId`}
                      id="departureStationId"
                      onChange={handleChange}
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
                    <Label>Departure Time</Label>
                    <Input
                      onChange={handleChange}
                      type="datetime-local"
                      name="departureTime"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Arrival Stations</Label>
                    {/*<Input onChange={handleChange} type="text" placeholder="Vehicle ID"*/}
                    {/*       name="vehicleId"/>*/}
                    <select
                      name={`arrivalStationId`}
                      id="arrivalStationId"
                      onChange={handleChange}
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
                    <Label>Approved By</Label>
                    {/*<Input onChange={handleChange} type="text" placeholder="Vehicle ID"*/}
                    {/*       name="vehicleId"/>*/}
                    <select
                      name={`approvedById`}
                      id="approvedById"
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Người phê duyệt</option>
                      {employees?.map((value) => (
                        <option value={value.id} key={value.id}>
                          {value.name}
                        </option>
                      ))}
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
