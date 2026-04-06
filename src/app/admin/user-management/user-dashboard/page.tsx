import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import DashboardMetrics from "./_partials/DashboardMetrics";

export default function UserDashboardPage() {
  return (
    <AdminBaseLayout>
      <DashboardMetrics />
    </AdminBaseLayout>
  );
}
