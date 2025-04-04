/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Button from '../ui/button/Button';
import { Modal } from '../ui/modal';
import { BUS_STATION, ITransport, USER } from '@/data/data';
import { useAPI } from '@/hooks/useAPI';
import { CreateRouteDto } from '@/data/payload/create-route.request';

interface RouteModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function RouteModal({ isOpen, closeModal }: RouteModalProps) {
  const [formData, setFormData] = useState({
    departureStationId: '',
    arrivalStationId: '',
    departureTime: '',
    arrivalTime: '',
    departureApprovedById: '',
    arrivalApprovedById: '',
    stamp: '',
    transportId: '',
  });

  const { fetchData } = useAPI();

  const handleSubmit = async () => {
    if (
      formData.departureStationId &&
      formData.arrivalStationId &&
      formData.departureTime &&
      formData.departureApprovedById &&
      formData.arrivalApprovedById &&
      formData.transportId
    ) {
      try {
        await fetchData('/api/routes', 'POST', {
          ...formData,
          departureTime: new Date(formData.departureTime),
          arrivalTime: new Date(formData.arrivalTime),
        });
        closeModal();
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin!');
    }
  };

  const [departureStations, setDepartureStations] = useState<BUS_STATION[]>([]);
  const [arrivalStations, setArrivalStations] = useState<BUS_STATION[]>([]);
  const [employees, setEmployees] = useState<USER[]>();
  const [transports, setTransports] = useState<ITransport[]>();
  const { fetchData: fetchStationData } = useAPI<CreateRouteDto, unknown>();
  const { fetchData: fetchTransportData } = useAPI<unknown, ITransport>();

  const fetchDataForDropdowns = async () => {
    try {
      const stations = await fetchStationData('/api/stations', 'GET');
      setDepartureStations(stations?.data);
      setArrivalStations(stations?.data);

      const employees = await fetchStationData('/api/employee', 'GET');
      setEmployees(
        employees?.data.filter(
          (employee: USER) => employee.role === 'OPERATOR',
        ),
      );

      const transport = await fetchTransportData('/api/transport', 'GET');
      setTransports(transport?.data);
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
  const handleSave = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    await handleSubmit();
  };

  const convertDateToLocal = (date: string) => {
    const localDate = new Date(date);
    return localDate.toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  return (
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
                <div className="col-span-2 flex justify-between items-center gap-3">
                  <div className="w-full">
                    <Label>Departure Stations</Label>
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
                  <div className="w-full">
                    <Label>Arrival Stations</Label>
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
                </div>
                <div className="col-span-2">
                  <Label>Transports</Label>
                  <select
                    name={`transportId`}
                    id="transportId"
                    onChange={handleChange}
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                  >
                    <option value="">Lệnh vận chuyển {`(Ngày)`}</option>
                    {transports?.map((value) => (
                      <option value={value.id} key={value.id}>
                        {convertDateToLocal(value.departureTime)}
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
                  <Label>Arrival Time</Label>
                  <Input
                    onChange={handleChange}
                    type="datetime-local"
                    name="arrivalTime"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Departure Approved By</Label>
                  <select
                    name={`departureApprovedById`}
                    id="departureApprovedById"
                    onChange={handleChange}
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                  >
                    <option value="">Người phê duyệt bến đi</option>
                    {employees?.map((value) => (
                      <option value={value.id} key={value.id}>
                        {value.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <Label>Arrival Approved By</Label>
                  <select
                    name={`arrivalApprovedById`}
                    id="arrivalApprovedById"
                    onChange={handleChange}
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                  >
                    <option value="">Người phê duyệt bến đến</option>
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
  );
}
