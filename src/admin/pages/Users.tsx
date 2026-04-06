"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { baseFetcher } from "@/src/helpers/fetcher";
import { API_BASE_URL } from "@/src/helpers/config";
import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/app/components/ui/select";
import { Users, Briefcase, TrendingUp, Filter, AlertCircle, Calendar } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function UsersDashboard() {
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  // Fetch metrics data
  const { data: metricsData, isLoading: isLoadingMetrics } = useSWR(
    `${API_BASE_URL}/admin/users/metrics`,
    baseFetcher
  );

  // Fetch users list
  const { data: usersData, isLoading: isLoadingUsers } = useSWR(
    `${API_BASE_URL}/admin/users?page=${page}&limit=10`,
    baseFetcher
  );

  const metrics = metricsData?.data;
  const users = usersData?.data?.users || [];
  
  // Filter logic on the client side for now (or via API if supported, currently API only supports pagination)
  const filteredUsers = users.filter((u: any) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
    return true;
  });

  // Chart configs
  const roleChartData = {
    labels: ["Clients", "Freelancers", "Admins"],
    datasets: [
      {
        data: [
          metrics?.distribution?.CLIENT || 0,
          metrics?.distribution?.FREELANCER || 0,
          metrics?.distribution?.ADMIN || 0,
        ],
        backgroundColor: [
          "rgba(45, 93, 161, 0.8)", // Worklynk Blue
          "rgba(250, 166, 26, 0.8)", // Orange accent
          "rgba(100, 116, 139, 0.8)", // Slate
        ],
        borderWidth: 0,
      },
    ],
  };

  const trendChartData = {
    labels: metrics?.trend?.map((t: any) => t.name) || [],
    datasets: [
      {
        label: "New Users",
        data: metrics?.trend?.map((t: any) => t.total) || [],
        borderColor: "rgba(45, 93, 161, 1)",
        backgroundColor: "rgba(45, 93, 161, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <AdminBaseLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Dashboard</h1>
            <p className="text-muted-foreground font-medium">Manage and monitor platform users and engagement.</p>
          </div>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 font-bold uppercase tracking-wider text-sm mb-1">Total Users</p>
                  <h3 className="text-4xl font-black">{metrics?.distribution ? Object.values(metrics.distribution).reduce((a: any, b: any) => a + b, 0) : "..."}</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Users size={24} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">Total Clients</p>
                  <h3 className="text-4xl font-black text-slate-800">{metrics?.distribution?.CLIENT || "..."}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Briefcase size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">Total Freelancers</p>
                  <h3 className="text-4xl font-black text-slate-800">{metrics?.distribution?.FREELANCER || "..."}</h3>
                </div>
                <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                  <Briefcase size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">Weekly Growth</p>
                  <h3 className="text-4xl font-black text-slate-800">+14%</h3>
                </div>
                <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
                  <TrendingUp size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Visualizations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 lg:col-span-2 border-none shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle className="flex items-center text-lg font-bold">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                User Registration Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] w-full flex items-center justify-center">
                {isLoadingMetrics ? (
                  <div className="animate-pulse flex space-x-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></div>
                ) : metrics?.trend ? (
                  <Line data={trendChartData} options={trendOptions} />
                ) : (
                  <p className="text-slate-400">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle className="flex items-center text-lg font-bold">
                <Users className="mr-2 h-5 w-5 text-primary" />
                User Typology
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] w-full flex items-center justify-center">
                {isLoadingMetrics ? (
                  <div className="animate-pulse flex space-x-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></div>
                ) : metrics?.distribution ? (
                  <Doughnut data={roleChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                ) : (
                  <p className="text-slate-400">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 5 Users Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle className="text-lg font-bold text-slate-800">Top 5 Clients</CardTitle>
              <p className="text-xs text-muted-foreground font-medium">By active project count</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {metrics?.topClients?.map((client: any, i: number) => (
                  <div key={client.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{client.name}</p>
                        <p className="text-xs text-slate-500">{client.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary text-xl">{client.count}</p>
                      <p className="text-xs text-slate-500 font-medium">Projects</p>
                    </div>
                  </div>
                ))}
                {!metrics?.topClients?.length && !isLoadingMetrics && (
                  <div className="p-8 text-center text-slate-500">No top clients found</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle className="text-lg font-bold text-slate-800">Top 5 Freelancers</CardTitle>
              <p className="text-xs text-muted-foreground font-medium">By completed contract count</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {metrics?.topFreelancers?.map((freelancer: any, i: number) => (
                  <div key={freelancer.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{freelancer.name}</p>
                        <p className="text-xs text-slate-500">{freelancer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary text-xl">{freelancer.count}</p>
                      <p className="text-xs text-slate-500 font-medium">Contracts</p>
                    </div>
                  </div>
                ))}
                {!metrics?.topFreelancers?.length && !isLoadingMetrics && (
                  <div className="p-8 text-center text-slate-500">No top freelancers found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Table List */}
        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl font-bold text-slate-800">All Registered Users</CardTitle>
              
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
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'CLIENT' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
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
                    className="rounded-xl"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl"
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
    </AdminBaseLayout>
  );
}
