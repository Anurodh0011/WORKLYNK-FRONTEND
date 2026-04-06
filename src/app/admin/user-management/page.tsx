import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import UsersTable from "./_partials/UsersTable";

export default function AllUsersPage() {
  return (
    <AdminBaseLayout>
      <UsersTable />
    </AdminBaseLayout>
  );
}
