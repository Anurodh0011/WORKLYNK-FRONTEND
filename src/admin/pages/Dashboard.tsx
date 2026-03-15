"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { Button } from "@/src/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/app/components/ui/card";
import { toast } from "sonner";
import { LogOut, User, LayoutDashboard, Settings, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading, logout }: any = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
        <Button onClick={() => router.push("/admin/login")}>Back to Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary">WorkLynk Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/admin/dashboard" className="flex items-center space-x-3 p-3 bg-primary/10 text-primary rounded-lg">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 text-muted-foreground hover:bg-slate-100 rounded-lg transition-colors">
            <User size={20} />
            <span>Users</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 text-muted-foreground hover:bg-slate-100 rounded-lg transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </a>
          <a href="/admin/verifications" className="flex items-center space-x-3 p-3 text-muted-foreground hover:bg-slate-100 rounded-lg transition-colors">
            <ShieldCheck size={20} />
            <span>Verifications</span>
          </a>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut size={20} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-semibold">Dashboard Overview</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,284</div>
                <p className="text-xs text-green-500 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">452</div>
                <p className="text-xs text-green-500 mt-1">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">रू 85,000</div>
                <p className="text-xs text-red-500 mt-1">-2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Welcome to the Admin Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Hello {user.name}, you are logged in as an Administrator. From here you can manage users, monitor platform activity, and configure system settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
