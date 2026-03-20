"use client";

import React from "react";
import { Navbar } from "../navbar";
import { AdminSidebar } from "./admin-sidebar";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { useRouter } from "next/navigation";

interface AdminBaseLayoutProps {
  children: React.ReactNode;
}

export default function AdminBaseLayout({ children }: AdminBaseLayoutProps) {
  const { user, isLoading }: any = useAuthContext();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <AdminSidebar />
        <main className="flex-1 p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
