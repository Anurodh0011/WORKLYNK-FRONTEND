"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/src/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs";
import { Input } from "@/src/app/components/ui/input";
import { Label } from "@/src/app/components/ui/label";
import { Button } from "@/src/app/components/ui/button";
import { Switch } from "@/src/app/components/ui/switch";
import { 
  Shield, 
  Settings as SettingsIcon, 
  Globe, 
  Save,
  CheckCircle2,
  Lock,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import { baseFetcher, mutationFetcher } from "@/src/helpers/fetcher";
import { API_BASE_URL } from "@/src/helpers/config";
import { useAuthContext } from "@/src/hooks/context/AuthContext";

export default function SettingsContent() {
  const { user } = useAuthContext() as any;
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingSec, setIsUpdatingSec] = useState(false);

  // Platform State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [vatVerification, setVatVerification] = useState(false);

  // Security State
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch Settings
  const { data: settingsData, mutate: mutateSettings } = useSWR(
    `${API_BASE_URL}/admin/settings`,
    baseFetcher
  );

  useEffect(() => {
    if (settingsData?.data) {
      setMaintenanceMode(settingsData.data.MAINTENANCE_MODE === "true");
      setVatVerification(settingsData.data.VAT_VERIFICATION === "true");
    }
  }, [settingsData]);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSavePlatform = async () => {
    setIsSaving(true);
    try {
      await mutationFetcher(`${API_BASE_URL}/admin/settings`, {
        arg: {
          MAINTENANCE_MODE: String(maintenanceMode),
          VAT_VERIFICATION: String(vatVerification),
        },
        method: "POST"
      } as any);
      toast.success("Platform settings synced", {
        description: "Global configuration updated successfully.",
        icon: <CheckCircle2 className="text-green-500" />
      });
      mutateSettings();
    } catch (error: any) {
      toast.error(error.message || "Failed to update platform settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSecurity = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (!currentPassword) {
      return toast.error("Current password is required to make security changes");
    }

    setIsUpdatingSec(true);
    try {
      await mutationFetcher(`${API_BASE_URL}/admin/security`, {
        arg: {
          email,
          currentPassword,
          newPassword: newPassword || undefined,
        },
        method: "PATCH"
      } as any);
      toast.success("Security credentials updated", {
        description: "Your login details have been securely modified.",
        icon: <Lock className="text-green-500" />
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Security update failed");
    } finally {
      setIsUpdatingSec(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-2xl"><SettingsIcon className="text-primary fill-primary/20" size={32} /></div>
             System Configuration
          </h1>
          <p className="text-slate-500 font-bold mt-1 pl-14 text-sm">Fine-tune platform parameters and administrative controls.</p>
        </div>
      </div>

      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="bg-slate-100 p-1.5 rounded-[1.5rem] h-auto flex flex-wrap gap-2 w-fit mb-8 border border-slate-200 shadow-sm">
          <TabsTrigger value="platform" className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md font-black text-xs uppercase tracking-widest transition-all">
            <Globe size={14} className="mr-2" /> Platform
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md font-black text-xs uppercase tracking-widest transition-all">
            <Shield size={14} className="mr-2" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="space-y-6">
          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 bg-slate-50/50 border-b">
              <CardTitle className="text-xl font-black text-slate-800 tracking-tight">System Controls</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage global platform state</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="space-y-1">
                  <Label className="text-sm font-black text-slate-800">Maintenance Mode</Label>
                  <p className="text-[10px] font-bold text-slate-400">Suspend public access for updates</p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>

              <div className="flex items-center justify-between p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
                <div className="space-y-1">
                  <Label className="text-sm font-black text-blue-900 font-bold">VAT Verification</Label>
                  <p className="text-[10px] font-bold text-blue-600/70">Enable automatic VAT ID validation</p>
                </div>
                <Switch checked={vatVerification} onCheckedChange={setVatVerification} />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleSavePlatform} 
                  disabled={isSaving}
                  className="rounded-2xl h-14 px-12 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
                >
                  {isSaving ? "Syncing..." : "Commit Platform Changes"}
                  <Save size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 bg-slate-100/50 border-b">
              <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Access Credentials</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your administrative login details</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Mail size={12} /> Admin Email</Label>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-2xl border-slate-200 h-14 px-5 font-bold shadow-sm focus:ring-primary/20 bg-slate-50/30" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Lock size={12} /> Current Password</Label>
                    <Input 
                      type="password" 
                      placeholder="Verify identity..." 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="rounded-2xl border-slate-200 h-14 px-5 font-bold shadow-sm focus:ring-primary/20 bg-slate-50/30" 
                    />
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Password (Optional)</Label>
                    <Input 
                      type="password" 
                      placeholder="Enter new password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-2xl border-slate-200 h-14 px-5 font-bold shadow-sm focus:ring-primary/20 bg-slate-50/30" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm New Password</Label>
                    <Input 
                      type="password" 
                      placeholder="Re-enter new password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-2xl border-slate-200 h-14 px-5 font-bold shadow-sm focus:ring-primary/20 bg-slate-50/30" 
                    />
                  </div>
               </div>

               <Button 
                onClick={handleUpdateSecurity}
                disabled={isUpdatingSec}
                className="w-full md:w-fit px-12 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/10"
               >
                 {isUpdatingSec ? "Processing..." : "Update Security Trace"}
               </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
