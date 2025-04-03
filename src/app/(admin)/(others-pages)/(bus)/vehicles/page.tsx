"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VehicleTable from "@/components/tables/VehicleTable";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import {Modal} from "@/components/ui/modal";
import React, {useState} from "react";
import {useModal} from "@/hooks/useModal";
import {useAPI} from "@/hooks/useAPI";

export default function VehiclePage() {
    const {isOpen, openModal, closeModal} = useModal();
    const [formData, setFormData] = useState<{ licensePlate: string, status: string }>({
        licensePlate: '',
        status: '',
    });
    const {fetchData} = useAPI();

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
                await fetchData("/api/vehicle", "POST", formData);
            } catch (err) {
                console.log(err);
                
                alert('Error creating vehicle');
            }
        } else {
            alert('Please fill biến số xe và trạng thái');
        }
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Xe"/>
            <div className="space-y-6">
                <ComponentCard title={
                    <Button onClick={openModal} size={"sm"}>+ Add new</Button>
                }>
                    <VehicleTable/>
                </ComponentCard>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div
                    className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Thêm mới xe
                        </h4>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2">
                                        <Label>Biển số xe</Label>
                                        <Input onChange={handleChange} type="text" placeholder={`Biển số xe`}
                                               name={`licensePlate`}/>
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Status</Label>
                                        {/* <Input onChange={handleChange} type="text" placeholder={`Status`}
                                               name={`status`}/> */}
                                            <select name={`status`} id={`status`}
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