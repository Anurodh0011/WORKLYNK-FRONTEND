import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import ProjectsTable from "./_partials/ProjectsTable";

export default function AllProjectsPage() {
  return (
    <AdminBaseLayout>
      <ProjectsTable initialStatus="ALL" />
    </AdminBaseLayout>
  );
}
