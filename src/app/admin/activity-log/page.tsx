import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import ActivityLogContent from "./_partials/ActivityLogContent";

export const metadata = {
  title: "Activity Log | WorkLynk Intelligence",
  description: "Administrative audit trail and platform activity intelligence.",
};

export default function AdminActivityLogPage() {
  return (
    <AdminBaseLayout>
      <ActivityLogContent />
    </AdminBaseLayout>
  );
}
