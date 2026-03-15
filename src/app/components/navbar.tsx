"use client";

import Link from "next/link";
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuthContext } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, logout }: any = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="font-bold text-2xl">
            Worklynk
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/browse-freelancers" className="hover:opacity-80">
              Freelancers
            </Link>
            <Link href="/browse-projects" className="hover:opacity-80">
              Projects
            </Link>

            {!isLoading && !user && (
              <>
                <Link href="/auth/login" className="hover:opacity-80">
                  Login
                </Link>
                <Button
                  asChild
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </>
            )}

            {!isLoading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-secondary/20">
                    {user.name.charAt(0)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/browse-freelancers"
              className="block py-2 hover:opacity-80"
              onClick={() => setIsOpen(false)}
            >
              Freelancers
            </Link>
            <Link
              href="/browse-projects"
              className="block py-2 hover:opacity-80"
              onClick={() => setIsOpen(false)}
            >
              Projects
            </Link>

            {user ? (
               <>
                 <Link href="/dashboard" className="block py-2 hover:opacity-80" onClick={() => setIsOpen(false)}>
                    Dashboard
                 </Link>
                 <Button onClick={handleLogout} className="w-full justify-start text-red-100" variant="ghost">
                    Logout
                 </Button>
               </>
            ) : (
              <>
                <Link href="/auth/login" className="block py-2 hover:opacity-80" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Button
                  asChild
                  className="w-full bg-secondary text-secondary-foreground"
                >
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
