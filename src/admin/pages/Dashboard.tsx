"use client";

import React from "react";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/app/components/ui/card";
import AdminBaseLayout from "@/src/app/components/admin-base-layout";

export default function AdminDashboard() {
  const { user }: any = useAuthContext();

  if (!user) return null;

  return (
    <AdminBaseLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-xl bg-card rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform">
            <CardHeader className="pb-2 bg-primary/5">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Users</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-black text-slate-800">1,284</div>
              <p className="text-sm font-bold text-green-500 mt-2">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl bg-card rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform">
            <CardHeader className="pb-2 bg-primary/5">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active Projects</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-black text-slate-800">452</div>
              <p className="text-sm font-bold text-green-500 mt-2">+5% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl bg-card rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform">
            <CardHeader className="pb-2 bg-primary/5">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Revenue</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-black text-slate-800">रू 85k</div>
              <p className="text-sm font-bold text-red-500 mt-2">-2% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl bg-primary text-white rounded-3xl overflow-hidden p-2">
          <CardHeader>
            <CardTitle className="text-2xl font-black">Welcome to internal operations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-primary-foreground/90 text-lg">
              Hello {user.name}, you are authenticated as an Administrator. Access user accounts, monitor systemic platform activity, adjust master configuration parameters, and verify platform identity tickets.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminBaseLayout>
  );
}
