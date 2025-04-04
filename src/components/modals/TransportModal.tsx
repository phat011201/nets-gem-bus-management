/* eslint-disable @typescript-eslint/no-explicit-any */
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Button from '../ui/button/Button';
import { Modal } from '../ui/modal';

interface TransportModalProps {
  isOpen: boolean;
  closeModal: () => void;
  handleSave: (e?: React.FormEvent) => Promise<void>;
  formData: {
    vehicleId: string;
    driverId: string;
    ticketSellerId: string;
    operatorId: string;
    currentStation: string;
    nextStation: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  dropdownData: {
    vehicles: any[];
    drivers: any[];
    ticketSellers: any[];
    operators: any[];
    currentStation: any[];
    nextStation: any[];
  };
}

export default function TransportModal({
  isOpen,
  closeModal,
  handleSave,
  formData,
  setFormData,
  dropdownData,
}: TransportModalProps) {
  const {
    vehicles,
    drivers,
    ticketSellers,
    operators,
    currentStation,
    nextStation,
  } = dropdownData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
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
                <div className="col-span-2 flex justify-between gap-3">
                  <div className="w-full">
                    <Label>Current Station</Label>
                    <select
                      name={`currentStation`}
                      id={`currentStation`}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Bến đi</option>
                      {currentStation?.map((station: { name: string }) => (
                        <option value={station.name} key={station.name}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <Label>Next Station</Label>
                    <select
                      name={`nextStation`}
                      id={`nextStation`}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Bế đến</option>
                      {nextStation?.map((station: { name: string }) => (
                        <option value={station.name} key={station.name}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  <Label>Vehicle</Label>
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
                  <Label>Operation</Label>
                  <select
                    name={`operatorId`}
                    id={`operatorId`}
                    onChange={handleChange}
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                  >
                    <option value="">Người điều hành</option>
                    {operators?.map(
                      (operator: { id: string; name: string }) => (
                        <option value={operator.id} key={operator.id}>
                          {operator.name}
                        </option>
                      ),
                    )}
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
