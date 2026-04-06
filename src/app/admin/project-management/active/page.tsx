import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import ProjectsTable from "../_partials/ProjectsTable";

export default function ActiveProjectsPage() {
  return (
    <AdminBaseLayout>
      <ProjectsTable initialStatus="IN_PROGRESS" />
    </AdminBaseLayout>
  );
}
