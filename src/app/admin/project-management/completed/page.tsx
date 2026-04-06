import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import ProjectsTable from "../_partials/ProjectsTable";

export default function CompletedProjectsPage() {
  return (
    <AdminBaseLayout>
      <ProjectsTable initialStatus="COMPLETED" />
    </AdminBaseLayout>
  );
}
