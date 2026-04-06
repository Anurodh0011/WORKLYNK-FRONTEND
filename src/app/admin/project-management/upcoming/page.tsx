import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import ProjectsTable from "../_partials/ProjectsTable";

export default function UpcomingProjectsPage() {
  return (
    <AdminBaseLayout>
      <ProjectsTable initialStatus="UPCOMING" />
    </AdminBaseLayout>
  );
}
