/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';

import { USER } from '@/data/data';
import Button from '../ui/button/Button';
import { useAPI } from '@/hooks/useAPI';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';

export default function EmployeeTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    avatar: string;
    rank: string;
    driverslicensenumber: string;
    role: string;
    signature: string;
  }>({
    id: '',
    name: '',
    avatar: '',
    rank: '',
    driverslicensenumber: '',
    role: '',
    signature: '',
  });
  const { response, fetchData: fetchEmployeesData } = useAPI<
    undefined,
    USER[]
  >();
  const { fetchData: updateEmployee } = useAPI<unknown, USER[]>();

  const handleSave = async () => {
    if (!formData.id) {
      alert('Lỗi: Không tìm thấy ID!');
      return;
    }

    try {
      await updateEmployee('/api/employee', 'PUT', formData);
      closeModal();
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      alert('Có lỗi xảy ra khi cập nhật!');
    }
  };

  const [employeeData, setEmployeeData] = useState<USER[]>([]);
  const [userLocal, setUserLocal] = useState<USER>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sửa lại useEffect để chỉ gọi API khi component mount lần đầu
  useEffect(() => {
    const fetchEmployeeData = async () => {
      await fetchEmployeesData('/api/employee', 'GET');
    };
    fetchEmployeeData();
  }, [fetchEmployeesData]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserLocal(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    if (response) {
      setEmployeeData(response?.data);
    }
  }, [response]);

  interface FormData {
    id: string;
    name: string;
    avatar: string;
    rank: string;
    driverslicensenumber: string;
    role: string;
    signature: string;
  }

  const handleOpenModal = (user: FormData): void => {
    setFormData({ ...user });
    openModal();
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'avatar' | 'signature',
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      };
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
                    Tên
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Username
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Chữ ký
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Số giấy phép lái xe
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Hạng
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
                {employeeData?.map((user: USER) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <img
                            width={40}
                            height={40}
                            src={user.avatar}
                            alt={user.name}
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {user.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.username}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex -space-x-2">
                        <img
                          src={user.signature}
                          alt="Signature"
                          className="w-32 h-10 rounded"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.driverslicensenumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {user.rank}
                    </TableCell>
                    {(userLocal?.role === 'ADMIN' ||
                      userLocal?.role === 'OPERATOR') && (
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={() => handleOpenModal(user)}
                            size="md"
                          >
                            Edit
                          </Button>
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
              Add new vehicle
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
                  {formData.role === 'DRIVER' && (
                    <>
                      <div className="col-span-2">
                        <Label>Giấy phép lái xe</Label>
                        <Input
                          onChange={handleChange}
                          type="text"
                          placeholder={`Giấy phép lái xe`}
                          defaultValue={formData.driverslicensenumber}
                          name={`driverslicensenumber`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Hạng</Label>
                        <Input
                          onChange={handleChange}
                          type="text"
                          placeholder={`Hạng`}
                          defaultValue={formData.rank}
                          name={`rank`}
                        />
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <Label>Avatar</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'avatar')}
                      className={`dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    />
                    {formData.avatar && (
                      <img
                        src={formData.avatar}
                        alt="Avatar Preview"
                        className="mt-2 w-20 h-20 rounded-full"
                      />
                    )}
                  </div>
                  <div className="col-span-2">
                    <Label>Vai trò</Label>
                    <select
                      name={`role`}
                      id={`role`}
                      defaultValue={formData.role}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    >
                      <option value="">Vai trò</option>
                      <option value={`OPERATOR`}>OPERATOR</option>
                      <option value={`TICKET_SELLER`}>TICKET_SELLER</option>
                      <option value={`DRIVER`}>DRIVER</option>
                    </select>
                  </div>
                  {/* <div className="col-span-2">
                    <Label>Chữ ký</Label>
                    <Input
                      onChange={handleChange}
                      type="text"
                      placeholder={`Chữ ký`}
                      defaultValue={formData.signature}
                      name={`signature`}
                    />
                  </div> */}
                  <div className="col-span-2">
                    <Label>Chữ ký</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'signature')}
                      className={`dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    />
                    {formData.signature && (
                      <img
                        src={formData.signature}
                        alt="Signature Preview"
                        className="mt-2 w-32 h-10"
                      />
                    )}
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
