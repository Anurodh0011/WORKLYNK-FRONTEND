import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import UsersTable from "../_partials/UsersTable";

export default function DeactivatedUsersPage() {
  return (
    <AdminBaseLayout>
      <UsersTable initialStatus="DEACTIVATED" />
    </AdminBaseLayout>
  );
}
