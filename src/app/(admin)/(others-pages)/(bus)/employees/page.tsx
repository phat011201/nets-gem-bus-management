import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EmployeeTable from "@/components/tables/EmployeeTable";

export default function EmployeePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Nhân viên" />
      <div className="space-y-6">
          <EmployeeTable />
      </div>
    </div>
  );
}
