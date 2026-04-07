import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import UsersTable from "../_partials/UsersTable";

export default function ActiveUsersPage() {
  return (
    <AdminBaseLayout>
      <UsersTable initialStatus="ACTIVE" />
    </AdminBaseLayout>
  );
}
