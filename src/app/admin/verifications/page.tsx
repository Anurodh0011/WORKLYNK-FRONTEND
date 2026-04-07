import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import VerificationList from "./_partials/VerificationList";

export default function AdminVerificationsPage() {
  return (
    <AdminBaseLayout>
      <div className="p-4 md:p-8">
        <VerificationList />
      </div>
    </AdminBaseLayout>
  );
}
