/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useState } from 'react';
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
import { useModal } from '@/hooks/useModal';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';

export default function BusStationsTable() {
  const [busStationsData, setBusStationsData] = useState<BUS_STATION[]>([]);
  const { response, fetchData } = useAPI<unknown, BUS_STATION[]>();
  const [userLocal, setUserLocal] = useState<USER>();

  const [formData, setFormData] = useState<BUS_STATION>({
    id: '',
    name: '',
    address: '',
    stamp: '',
  });

  const { isOpen, openModal, closeModal } = useModal();

  const fetchStationData = useCallback(async () => {
    await fetchData('/api/stations', 'GET');
  }, [fetchData]);

  useEffect(() => {
    fetchStationData();
  }, [fetchStationData]);

  useEffect(() => {
    if (response) {
      setBusStationsData(response?.data);
    }
  }, [response]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserLocal(JSON.parse(user));
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetchData(`/api/stations/${id}`, 'DELETE');
    } catch (err) {
      console.log(err);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleOpenModal = (station: BUS_STATION) => {
    setFormData({
      id: station.id,
      name: station.name,
      address: station.address,
      stamp: station.stamp,
    });
    openModal();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.stamp) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      closeModal();
    }

    try {
      await fetchData(`/api/stations/${formData.id}`, 'PUT', {
        name: formData.name,
        address: formData.address,
        stamp: formData.stamp,
      });
    } catch (err) {
      console.log(err);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleFileUpload = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, stamp: reader.result as string }));
        };
      }
    };

  return (
    <>
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
                    Tên
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Địa chỉ
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Dấu mộc
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
                {busStationsData?.map((station: BUS_STATION) => (
                  <TableRow key={station.id}>
                    <TableCell className="px-5 py-4 text-white text-start text-theme-sm dark:text-white">
                      {station.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {station.address}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <img
                        src={station.stamp}
                        alt={`stamp-${station.name}`}
                        width={50}
                        height={50}
                        className="h-20 w-40 rounded object-contain"
                      />
                    </TableCell>
                    {userLocal?.role === 'ADMIN' ||
                    userLocal?.role === 'OPERATOR' ? (
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="md"
                            onClick={() => handleOpenModal(station)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="md"
                            onClick={() => handleDelete(station.id)}
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
              Chỉnh sửa bến xe
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>Tên</Label>
                    <Input
                      onChange={handleChange}
                      type="text"
                      placeholder={`Tên`}
                      defaultValue={formData.name}
                      name={`name`}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Địa chỉ</Label>
                    <Input
                      onChange={handleChange}
                      type="text"
                      placeholder={`Địa chỉ`}
                      defaultValue={formData.address}
                      name={`address`}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Dấu mộc</Label>
                    <input
                      type="file"
                      accept='image/*'
                      onChange={handleFileUpload}
                      placeholder={`Dấu Mộc`}
                      className={`dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    />
                    {
                      formData.stamp && (
                        <img
                          src={formData.stamp}
                          alt={`stamp-${formData.name}`}
                          className="h-20 w-40 rounded object-contain"
                        />
                      )
                    }
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
    </>
  );
}
