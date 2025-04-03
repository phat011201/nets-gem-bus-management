/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '../ui/table';

import Button from '../ui/button/Button';
import {USER, VEHICLE} from '@/data/data';
import {useAPI} from "@/hooks/useAPI";
import Badge from '../ui/badge/Badge';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { useModal } from '@/hooks/useModal';

export default function VehicleTable() {
    const [vehicleData, setVehicleData] = React.useState<VEHICLE[]>([]);

    const [userLocal, setUserLocal] = useState<USER>();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUserLocal(JSON.parse(user));
        }
    }, []);

    const {response, fetchData} = useAPI();

    useEffect(() => {
        const fetchVehicleData = async () => {
            await fetchData("/api/vehicle", "GET")
        };
        fetchVehicleData();
    }, []);

    useEffect(() => {
        if (response) {
            setVehicleData(response?.data as VEHICLE[])
        }
    }, [response]);

    const handleDelete = (id: string) => {
        const newData = vehicleData?.filter((vehicle: VEHICLE) => vehicle.id !== id);
        setVehicleData(newData);
    };

    const {isOpen, openModal, closeModal} = useModal();
    const [formData, setFormData] = useState<{ id: string,licensePlate: string, status: string }>({
        id: '',
        licensePlate: '',
        status: '',
    });
    const {fetchData: updatedFetchData} = useAPI();
    const handleSave = async () => {
        await handleSubmit()
        closeModal();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async () => {
        if (formData.licensePlate && formData.status) {
            try {
                await updatedFetchData("/api/vehicle", "PUT", formData);
            } catch (err) {
                console.log(err);                
                alert('Error creating vehicle');
            }
        } else {
            alert('Please fill biến số xe và trạng thái');
        }
    }

    const handleOpenModal = (vehicle: VEHICLE) => {
        setFormData({
            id: vehicle.id,
            licensePlate: vehicle.licensePlate,
            status: vehicle.status,
        });
        openModal();
    }

    return (
        <div>
        <div
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                                    Biển số xe
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                >
                                    Trạng thái
                                </TableCell>
                                {
                                    (userLocal?.role === 'ADMIN' || userLocal?.role === 'OPERATOR') && (
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                        >
                                            Actions
                                        </TableCell>
                                    )
                                }
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {vehicleData?.map((vehicle: VEHICLE) => (
                                <TableRow key={vehicle.id}>
                                    <TableCell
                                        className="px-5 py-4 text-white text-start text-theme-sm dark:text-white">
                                        {vehicle.licensePlate}
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                                        {
                                            vehicle.status === 'ACTIVE' ? (
                                            <Badge variant='light' color={`success`}>
                                                Đang Hoạt động
                                            </Badge>
                                        ): (
                                            <Badge color={`error`}>
                                                Ngừng hoạt động
                                            </Badge>
                                        )}
                                    </TableCell>
                                    {
                                        (userLocal?.role === 'ADMIN' || userLocal?.role === 'OPERATOR') && (
                                            <TableCell
                                                className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button size="md" onClick={
                                                        () => handleOpenModal(vehicle)
                                                    }>Edit</Button>
                                                    <Button
                                                        size="md"
                                                        onClick={() => handleDelete(vehicle.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        )
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div
                    className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Sửa xe
                        </h4>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2">
                                        <Label>Biển số xe</Label>
                                        <Input onChange={handleChange} type="text" placeholder={`Biển số xe`}
                                                defaultValue={formData.licensePlate}
                                               name={`licensePlate`}/>
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Status</Label>
                                        {/* <Input onChange={handleChange} type="text" placeholder={`Status`}
                                               name={`status`}/> */}
                                            <select name={`status`} id={`status`} defaultValue={formData.status}
                                            onChange={handleChange}
                                            className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}>
                                                <option value="">Trạng thái</option>
                                                <option value="ACTIVE">Active</option>
                                                <option value="INACTIVE">Inactive</option>
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
