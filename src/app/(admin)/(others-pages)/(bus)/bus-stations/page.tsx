'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BusStationsTable from '@/components/tables/BusStationsTable';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { useModal } from '@/hooks/useModal';
import { useState } from 'react';
import { useAPI } from '@/hooks/useAPI';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';

export default function BusStationsPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    stamp: string;
  }>({
    name: '',
    address: '',
    stamp: '',
  });
  const { fetchData } = useAPI();
  const handleSave = async () => {
    if (formData.name && formData.address && formData.stamp) {
      try {
        await fetchData('/api/stations', 'POST', formData);
      } catch (err) {
        console.log(err);
        alert('Error creating vehicle');
      }
    } else {
      alert('Please fill biến số xe và trạng thái');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <PageBreadcrumb pageTitle="Bến xe" />
      <div className="space-y-6">
        <ComponentCard
          title={
            <Button size={'sm'} onClick={openModal}>
              + Add New
            </Button>
          }
        >
          <BusStationsTable />
        </ComponentCard>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Thêm mới Bến xe
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>Tên trạm</Label>
                    <Input
                      onChange={handleChange}
                      type="text"
                      placeholder={`Tên trạm`}
                      name={`name`}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Địa chỉ</Label>
                    <Input
                      onChange={handleChange}
                      type="text"
                      placeholder={`Địa chỉ`}
                      name={`address`}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Dấu mộc</Label>
                    <Input
                      onChange={handleChange}
                      type="text"
                      placeholder={`Dấu mộc`}
                      name={`stamp`}
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
