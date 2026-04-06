import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import ProjectDashboardMetrics from "../_partials/ProjectDashboardMetrics";

export default function ProjectDashboardPage() {
  return (
    <AdminBaseLayout>
      <ProjectDashboardMetrics />
    </AdminBaseLayout>
  );
}
