"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { baseFetcher } from "@/src/helpers/fetcher";
import { API_BASE_URL } from "@/src/helpers/config";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/app/components/ui/select";
import { Filter, AlertCircle, Users } from "lucide-react";

export default function UsersTable() {
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  // Fetch users list
  const { data: usersData, isLoading: isLoadingUsers } = useSWR(
    `${API_BASE_URL}/admin/users?page=${page}&limit=10`,
    baseFetcher
  );

  const users = usersData?.data?.users || [];
  
  // Filter logic
  const filteredUsers = users.filter((u: any) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">All Users</h1>
          <p className="text-muted-foreground font-medium">View and manage all members on the platform.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Registered Users Directory
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border rounded-xl px-3 py-1.5 shadow-sm">
                <Filter size={16} className="text-slate-400 mr-2" />
                <span className="text-sm font-semibold text-slate-600 mr-2">Role:</span>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-8 border-0 bg-transparent shadow-none focus:ring-0 w-[120px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles</SelectItem>
                    <SelectItem value="CLIENT">Clients</SelectItem>
                    <SelectItem value="FREELANCER">Freelancers</SelectItem>
                    <SelectItem value="ADMIN">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center bg-white border rounded-xl px-3 py-1.5 shadow-sm">
                <AlertCircle size={16} className="text-slate-400 mr-2" />
                <span className="text-sm font-semibold text-slate-600 mr-2">Status:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 border-0 bg-transparent shadow-none focus:ring-0 w-[130px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase">User</th>
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase">Role</th>
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase">Status</th>
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase">Joined</th>
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoadingUsers ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading users...</td></tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'CLIENT' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                          user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                          user.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="sm" className="rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No users match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {usersData?.data?.pagination && usersData.data.pagination.totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between bg-slate-50">
              <p className="text-sm font-medium text-slate-500">
                Showing page {usersData.data.pagination.page} of {usersData.data.pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl font-bold"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl font-bold"
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
    </div>
  );
}
