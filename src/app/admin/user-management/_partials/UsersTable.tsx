"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { mutate } from "swr";
import { baseFetcher } from "@/src/helpers/fetcher";
import { API_BASE_URL } from "@/src/helpers/config";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/app/components/ui/dropdown-menu";
import { 
  Filter, 
  AlertCircle, 
  Users, 
  MoreVertical, 
  ScrollText, 
  ShieldAlert, 
  UserRoundCheck, 
  Mail, 
  Ban,
  ChevronDown,
  TimerReset,
  History,
  Eye
} from "lucide-react";
import AdminTable from "@/src/app/components/admin/AdminTable";
import StatusChangeDialog from "@/src/app/components/admin/StatusChangeDialog";
import StatusHistoryDialog from "@/src/app/components/admin/StatusHistoryDialog";

interface UsersTableProps {
  initialStatus?: "ALL" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
}

export default function UsersTable({ initialStatus = "ALL" }: UsersTableProps) {
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED">(initialStatus);
  const [page, setPage] = useState(1);

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isStatusHistoryOpen, setIsStatusHistoryOpen] = useState(false);
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<string | null>(null);

  const openStatusChange = (user: any, status: string) => {
    setSelectedUser(user);
    setTargetStatus(status);
    setIsStatusChangeOpen(true);
  };

  // Fetch users list
  const usersUrl = `${API_BASE_URL}/admin/users?page=${page}&limit=10`;
  const { data: usersData, isLoading: isLoadingUsers } = useSWR(usersUrl, baseFetcher);

  const users = usersData?.data?.users || [];
  
  // Filter logic
  const filteredUsers = users.filter((u: any) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    {
      header: "User",
      accessor: (user: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm ring-2 ring-white">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-800 leading-tight">{user.name}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (user: any) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-sm ${
          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
          user.role === 'CLIENT' ? 'bg-blue-100 text-blue-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {user.role}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (user: any) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-2.5 rounded-full text-[10px] font-black tracking-wider uppercase gap-1 border shadow-sm transition-all hover:ring-2 hover:ring-offset-1 hover:ring-primary/20 active:scale-95 ${
                    user.status === 'ACTIVE'
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      : user.status === 'SUSPENDED'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  }`}
                >
                  {user.status}
                  <ChevronDown size={10} className="opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl border-slate-200 shadow-xl min-w-[160px]">
                <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Change Account Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-bold text-green-700 focus:bg-green-50 focus:text-green-700 rounded-lg cursor-pointer"
                  onClick={() => openStatusChange(user, 'ACTIVE')}
                >
                  <UserRoundCheck size={14} className="mr-2" /> Activate
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-bold text-yellow-700 focus:bg-yellow-50 focus:text-yellow-700 rounded-lg cursor-pointer"
                  onClick={() => openStatusChange(user, 'SUSPENDED')}
                >
                  <ShieldAlert size={14} className="mr-2" /> Suspend
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-bold text-red-600 focus:bg-red-50 focus:text-red-600 rounded-lg cursor-pointer"
                  onClick={() => openStatusChange(user, 'DEACTIVATED')}
                >
                  <Ban size={14} className="mr-2" /> Deactivate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
              title="View status history"
              onClick={() => { setSelectedUser(user); setIsStatusHistoryOpen(true); }}
            >
              <History size={14} />
            </Button>
          </div>
          {user.status === 'SUSPENDED' && user.suspensionDuration && (
            <span className="text-[9px] font-black text-yellow-600/70 mt-1 pl-1 uppercase tracking-tighter">
              Time: {user.suspensionDuration} Days
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Last Login",
       accessor: (user: any) => (
         <span className="text-xs font-bold text-slate-500">
           {user.lastLoginAt 
             ? new Date(user.lastLoginAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
             : "Never"}
         </span>
       ),
    },
    {
      header: "Joined",
      accessor: (user: any) => (
        <span className="text-xs font-bold text-slate-500">
          {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      accessor: (user: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 h-8 w-8 text-slate-400">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl w-48">
            <DropdownMenuItem 
              className="font-bold text-slate-700 rounded-lg cursor-pointer"
              onClick={() => window.location.href = `/admin/user-management/${user.id}`}
            >
              <Eye size={14} className="mr-2" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="font-bold text-slate-700 rounded-lg"
              onClick={() => { setSelectedUser(user); setIsStatusHistoryOpen(true); }}
            >
              <History size={14} className="mr-2" /> Status History
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="font-bold text-red-600 focus:bg-red-50 rounded-lg"
            >
              <Ban size={14} className="mr-2" /> Delete Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Management</h1>
          <p className="text-muted-foreground font-medium">Control platform access and monitor user audit trails.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              {statusFilter === "ALL" ? "Registered Users" : `${statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Users`} Directory
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border rounded-xl px-3 py-1.5 shadow-sm">
                <Filter size={14} className="text-slate-400 mr-2" />
                <span className="text-[10px] font-black text-slate-400 uppercase mr-2 tracking-wider">Role:</span>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-6 border-0 bg-transparent shadow-none focus:ring-0 w-[100px] text-xs font-bold p-0">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    <SelectItem value="ALL" className="text-xs font-bold">All Roles</SelectItem>
                    <SelectItem value="CLIENT" className="text-xs font-bold">Clients</SelectItem>
                    <SelectItem value="FREELANCER" className="text-xs font-bold">Freelancers</SelectItem>
                    <SelectItem value="ADMIN" className="text-xs font-bold">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center bg-white border rounded-xl px-3 py-1.5 shadow-sm">
                <AlertCircle size={14} className="text-slate-400 mr-2" />
                <span className="text-[10px] font-black text-slate-400 uppercase mr-2 tracking-wider">Status:</span>
                <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                  <SelectTrigger className="h-6 border-0 bg-transparent shadow-none focus:ring-0 w-[110px] text-xs font-bold p-0">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    <SelectItem value="ALL" className="text-xs font-bold">All Status</SelectItem>
                    <SelectItem value="ACTIVE" className="text-xs font-bold">Active</SelectItem>
                    <SelectItem value="SUSPENDED" className="text-xs font-bold">Suspended</SelectItem>
                    <SelectItem value="DEACTIVATED" className="text-xs font-bold">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AdminTable 
            columns={columns} 
            data={filteredUsers} 
            isLoading={isLoadingUsers}
            emptyMessage="No users match your filters."
          />
          
          {/* Pagination Controls */}
          {usersData?.data?.pagination && usersData.data.pagination.totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between bg-slate-50/50">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Page {usersData.data.pagination.page} / {usersData.data.pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl font-bold h-9 px-4 border-slate-200 bg-white"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl font-bold h-9 px-4 border-slate-200 bg-white"
                  disabled={page === usersData.data.pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {selectedUser && (
        <>
          <StatusChangeDialog
            user={selectedUser}
            isOpen={isStatusChangeOpen}
            initialStatus={targetStatus || undefined}
            onClose={() => { 
                setIsStatusChangeOpen(false); 
                // Delay clearing the user to allow animations but ensure it's reset
                setTimeout(() => { if (!isStatusChangeOpen) setSelectedUser(null); setTargetStatus(null); }, 300);
            }}
            onSuccess={() => mutate(usersUrl)}
          />
          <StatusHistoryDialog
            user={selectedUser}
            isOpen={isStatusHistoryOpen}
            onClose={() => { setIsStatusHistoryOpen(false); setSelectedUser(null); }}
          />
        </>
      )}
    </div>
  );
}
