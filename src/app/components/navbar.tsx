"use client";

import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Search,
  ShieldCheck,
  Bookmark,
  Users,
  FileText,
  Globe
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
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
import { Badge } from "./ui/badge";

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

  const NavLinks = () => {
    if (!user) {
      return (
        <>
          <Link
            href="/browse-freelancers"
            className="hover:text-secondary flex items-center gap-1"
          >
            <Search size={16} /> Freelancers
          </Link>
          <Link
            href="/browse-projects"
            className="hover:text-secondary flex items-center gap-1"
          >
            <Briefcase size={16} /> Projects
          </Link>
        </>
      );
    }

    if (user.role === "ADMIN") {
      return (
        <>
          <Link
            href="/admin/dashboard"
            className="hover:text-secondary flex items-center gap-1"
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link
            href="/admin/verifications"
            className="hover:text-secondary flex items-center gap-1"
          >
            <ShieldCheck size={16} /> Verifications
          </Link>
        </>
      );
    }

    if (user.role === "CLIENT") {
      return (
        <>
          <Link
            href="/projects/new"
            className="hover:text-secondary flex items-center gap-1"
          >
            <PlusCircle size={16} /> Post Project
          </Link>
          <Link
            href="/dashboard/contracts"
            className="hover:text-secondary flex items-center gap-1"
          >
            <FileText size={16} /> My Contracts
          </Link>
          <Link
            href="/dashboard/projects"
            className="hover:text-secondary flex items-center gap-1"
          >
            <Briefcase size={16} /> My Projects
          </Link>
          <Link
            href="/browse-freelancers"
            className="hover:text-secondary flex items-center gap-1"
          >
            <Search size={16} /> Freelancers
          </Link>
          <Link
            href="/dashboard/saved-freelancers"
            className="hover:text-secondary flex items-center gap-1"
          >
            <Users className="mr-1 h-4 w-4" /> Saved
          </Link>
          <Link
            href="/portfolio"
            className="hover:text-secondary flex items-center gap-1"
          >
            <Globe className="mr-1 h-4 w-4" /> Portfolio
          </Link>
        </>
      );
    }

    if (user.role === "FREELANCER") {
      return (
        <>
          <Link
            href="/browse-projects"
            className="hover:text-secondary flex items-center gap-1"
          >
            <Search size={16} /> Browse Projects
          </Link>
          <Link
            href="/dashboard/contracts"
            className="hover:text-secondary flex items-center gap-1"
          >
            <FileText size={16} /> My Contracts
          </Link>
          <Link
            href="/dashboard/applications"
            className="hover:text-secondary flex items-center gap-1"
          >
            <Briefcase size={16} /> My Applications
          </Link>
          <Link
            href="/dashboard/saved-projects"
            className="hover:text-secondary flex items-center gap-1"
          >
            <Bookmark className="mr-1 h-4 w-4" /> Saved
          </Link>
          <Link
            href="/portfolio"
            className="hover:text-secondary flex items-center gap-1"
          >
            <Globe className="mr-1 h-4 w-4" /> Portfolio
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="font-bold text-2xl flex items-center gap-2">
            <span className="bg-secondary text-primary px-2 rounded-lg">W</span>
            Worklynk
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center font-medium text-sm">
            <NavLinks />

            {!isLoading && !user && (
              <div className="flex items-center gap-4 ml-4">
                <Link href="/auth/login" className="hover:text-secondary">
                  Login
                </Link>
                <Button
                  asChild
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm"
                  size="sm"
                >
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {!isLoading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full bg-secondary/20 hover:bg-secondary/30 ring-2 ring-secondary/40 ml-2"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-1 w-fit text-[10px] py-0"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={
                        user.role === "ADMIN"
                          ? "/admin/dashboard"
                          : "/dashboard"
                      }
                    >
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
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-primary-foreground/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-3 border-t border-white/10 mt-2">
            <NavLinks />

            {user ? (
              <>
                <Button
                  onClick={handleLogout}
                  className="w-full justify-start text-red-100 hover:bg-red-500/10"
                  variant="ghost"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/auth/login"
                  className="block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="w-full bg-secondary text-secondary-foreground"
                >
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
