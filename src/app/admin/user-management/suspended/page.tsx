import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import UsersTable from "../_partials/UsersTable";

export default function SuspendedUsersPage() {
  return (
    <AdminBaseLayout>
      <UsersTable initialStatus="SUSPENDED" />
    </AdminBaseLayout>
  );
}
