"use client";

import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  Settings, 
  ChevronRight,
  LogOut
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/src/app/lib/utils";
import { Button } from "../ui/button";
import { useAuthContext } from "@/src/hooks/context/AuthContext";

const ADMIN_MENU = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout }: any = useAuthContext();

  return (
    <aside className="w-64 bg-card border-r h-[calc(100vh-64px)] sticky top-16 flex flex-col">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Admin Portal
        </h2>
        <nav className="space-y-1">
          {ADMIN_MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon size={18} />
              {item.name}
              {pathname === item.href && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
