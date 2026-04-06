"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { Button } from "@/src/app/components/ui/button";
import { toast } from "sonner";
import { LogOut, User, LayoutDashboard, Settings, ShieldCheck, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

interface AdminBaseLayoutProps {
  children: React.ReactNode;
}

const ADMIN_MENU = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
  { 
    name: "User Management", 
    href: "/admin/user-management", 
    icon: User,
    submenus: [
      { name: "Dashboard", href: "/admin/user-management/user-dashboard" },
      { name: "All Users", href: "/admin/user-management" },
      { name: "Active Users", href: "/admin/user-management/active" },
      { name: "Suspended Users", href: "/admin/user-management/suspended" },
      { name: "Deactivated Users", href: "/admin/user-management/deactivated" }
    ]
  },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminBaseLayout({ children }: AdminBaseLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout }: any = useAuthContext();

  // State for collapsible menus
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Automatically expand menu if a sub-route is active on initial load
  useEffect(() => {
    const activeMenu = ADMIN_MENU.find(item => 
      item.submenus && pathname.startsWith(item.href)
    );
    if (activeMenu && !expandedMenus.includes(activeMenu.name)) {
      setExpandedMenus(prev => [...prev, activeMenu.name]);
    }
  }, [pathname]);

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name) 
        : [...prev, name]
    );
  };

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
    return <div className="flex items-center justify-center min-h-screen text-primary font-bold animate-pulse">Loading admin portal...</div>;
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-slate-50">
        <h1 className="text-3xl font-black text-red-600">Unauthorized</h1>
        <p className="font-medium text-muted-foreground">You do not have permission to view this portal.</p>
        <Button onClick={() => router.push("/admin/login")} className="rounded-xl font-bold">Back to Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-76 bg-white border-r hidden md:flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-6 border-b flex items-center justify-center">
          <h1 className="text-2xl font-black text-primary tracking-tight">WorkLynk</h1>
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 uppercase">Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {ADMIN_MENU.map((item) => {
            const isSubItemActive = item.submenus?.some(sub => pathname === sub.href);
            const isParentActive = pathname === item.href;
            const isExpanded = expandedMenus.includes(item.name);
            const isActive = isParentActive || isSubItemActive;

            return (
              <div key={item.name} className="space-y-1">
                {item.submenus ? (
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      "w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer",
                      isActive
                        ? "bg-primary/5 text-primary font-bold border-l-4 border-primary rounded-l-none"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-semibold"
                    )}
                  >
                    <item.icon size={20} className={cn(isActive ? "text-primary" : "text-slate-400")} />
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronDown 
                      size={16} 
                      className={cn(
                        "transition-transform duration-300",
                        isExpanded ? "rotate-180" : "rotate-0"
                      )} 
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-primary text-white font-bold shadow-md shadow-primary/20" 
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-semibold"
                    )}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                    {isActive && <ChevronRight size={16} className="ml-auto" />}
                  </Link>
                )}

                {item.submenus && (
                  <div 
                    className={cn(
                      "ml-8 space-y-1 border-l-2 border-slate-100 pl-4 overflow-hidden transition-all duration-300 ease-in-out",
                      isExpanded ? "max-h-64 opacity-100 py-1" : "max-h-0 opacity-0 py-0"
                    )}
                  >
                    {item.submenus.map(sub => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link 
                          key={sub.name}
                          href={sub.href}
                          className={cn(
                            "block py-2 px-3 text-sm rounded-lg transition-colors border border-transparent",
                            isSubActive 
                              ? "bg-primary/5 text-primary font-bold border-primary/20 shadow-sm" 
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium"
                          )}
                        >
                          {sub.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="p-4 border-t mt-auto">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-xl" onClick={handleLogout}>
            <LogOut size={20} className="mr-3" />
            Secure Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Admin Operations</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-xs font-semibold text-primary tracking-wide">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
