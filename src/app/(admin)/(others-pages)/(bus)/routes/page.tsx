'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import RouteModal from '@/components/modals/RouteModal';
import RoutesTable from '@/components/tables/RoutesTable';
import Button from '@/components/ui/button/Button';
import { useModal } from '@/hooks/useModal';

export default function RoutesPage() {
  const { isOpen, openModal, closeModal } = useModal();

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
      <RouteModal
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </div>
  );
}
