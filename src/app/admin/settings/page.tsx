import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import SettingsContent from "./_partials/SettingsContent";

export const metadata = {
  title: "Admin Settings | WorkLynk Intelligence",
  description: "Enterprise system configuration and platform controls.",
};

export default function AdminSettingsPage() {
  return (
    <AdminBaseLayout>
      <SettingsContent />
    </AdminBaseLayout>
  );
}
