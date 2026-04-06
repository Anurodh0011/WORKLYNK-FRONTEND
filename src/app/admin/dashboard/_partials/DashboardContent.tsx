"use client";

import React from "react";
import useSWR from "swr";
import { baseFetcher } from "@/src/helpers/fetcher";
import { API_BASE_URL } from "@/src/helpers/config";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/app/components/ui/card";
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  Clock, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Globe,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
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
  Filler,
} from "chart.js";
import Link from "next/link";
import AdminKpiCard from "@/src/app/components/admin/AdminKpiCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardContent() {
  // Fetch overview stats
  const { data: dashboardData, isLoading: isLoadingDashboard } = useSWR(
    `${API_BASE_URL}/admin/dashboard`,
    baseFetcher
  );

  // Fetch user metrics (for trends/distribution)
  const { data: userMetricsData } = useSWR(
    `${API_BASE_URL}/admin/users/metrics`,
    baseFetcher
  );

  // Fetch project metrics (for trends/distribution)
  const { data: projectMetricsData } = useSWR(
    `${API_BASE_URL}/admin/projects/metrics`,
    baseFetcher
  );

  const stats = dashboardData?.data?.stats;
  const userMetrics = userMetricsData?.data;
  const projectMetrics = projectMetricsData?.data;

  // Chart: Registration vs Project Posting Trends
  const trendChartData = {
    labels: userMetrics?.trend?.map((t: any) => t.name) || [],
    datasets: [
      {
        label: "User Registrations",
        data: userMetrics?.trend?.map((t: any) => t.total) || [],
        borderColor: "rgba(45, 93, 161, 1)",
        backgroundColor: "rgba(45, 93, 161, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Project Postings",
        data: projectMetrics?.trend?.map((t: any) => t.total) || [],
        borderColor: "rgba(250, 166, 26, 1)",
        backgroundColor: "rgba(250, 166, 26, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart: User Role Distribution
  const roleChartData = {
    labels: ["Clients", "Freelancers", "Admins"],
    datasets: [
      {
        data: [
          userMetrics?.distribution?.CLIENT || 0,
          userMetrics?.distribution?.FREELANCER || 0,
          userMetrics?.distribution?.ADMIN || 0,
        ],
        backgroundColor: [
          "rgba(45, 93, 161, 0.8)",
          "rgba(250, 166, 26, 0.8)",
          "rgba(100, 116, 139, 0.8)",
        ],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 10, padding: 20, font: { weight: 'bold' as const } } },
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-2xl"><Zap className="text-primary fill-primary/20" size={32} /></div>
             Central Intelligence
          </h1>
          <p className="text-slate-500 font-bold mt-1 pl-14">Enterprise oversight and platform-wide performance analytics.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
           <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Last Update</p>
              <p className="text-xs font-black text-slate-700">{new Date().toLocaleTimeString()}</p>
           </div>
           <div className="w-px h-8 bg-slate-100" />
           <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
              <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <p className="text-xs font-black text-slate-700 uppercase tracking-tighter">Operational</p>
              </div>
           </div>
        </div>
      </div>

      {/* PRIMARY KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminKpiCard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || "..."}
          icon={Users}
          footerContent={
            <div className="flex items-center justify-between">
               <div className="font-bold text-[10px] text-slate-400">Snapshot Report</div>
               <Link href="/admin/user-management/active" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center">Directory <ChevronRight size={12} /></Link>
            </div>
          }
        />

        <AdminKpiCard
          title="Total Projects"
          value={projectMetrics?.distribution?.TOTAL || "..."}
          icon={Briefcase}
          iconClassName="bg-orange-50 text-orange-500"
          footerContent={
            <div className="flex items-center justify-between">
               <div className="text-[10px] font-bold text-slate-500">
                  <span className="text-orange-500 font-black">{projectMetrics?.distribution?.IN_PROGRESS || 0}</span> Ongoing
               </div>
               <Link href="/admin/project-management/dashboard" className="text-primary uppercase tracking-widest hover:underline flex items-center text-[10px] font-black">Audit <ChevronRight size={12} /></Link>
            </div>
          }
        />

        <AdminKpiCard
          title="Settlements"
          value="रू 85.2k"
          icon={DollarSign}
          variant="dark"
          footerContent={
            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
               <Activity size={10} className="text-green-400" /> 30-day interval volume
            </p>
          }
        />

        <AdminKpiCard
          title="Active Trace"
          value={stats?.activeSessions || "..."}
          icon={Globe}
          iconClassName="bg-purple-50 text-purple-600"
          footerContent={
            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
               <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  Encrypted sessions
               </span>
            </p>
          }
        />
      </div>

      {/* ANALYTICAL TREND CORES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 bg-slate-50/50 border-b flex flex-row items-center justify-between">
            <div>
               <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Growth Trajectory</CardTitle>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Registrations vs Project Lifecycle</p>
            </div>
            <div className="flex gap-2">
               <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-[10px] font-black text-slate-600">USERS</span>
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-[10px] font-black text-slate-600">PROJECTS</span>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[350px] w-full">
              <Line 
                data={trendChartData} 
                options={{
                  ...commonOptions,
                  plugins: { ...commonOptions.plugins, legend: { display: false } }
                }} 
              />
            </div>
          </CardContent>
        </Card>

        {/* IDENTITY MIX DOUGHNUT */}
        <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 bg-slate-50/50 border-b">
            <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Identity Distribution</CardTitle>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Global account status mix</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[250px] w-full mb-8">
               <Doughnut 
                  data={roleChartData} 
                  options={{
                    ...commonOptions,
                    plugins: { 
                      ...commonOptions.plugins, 
                      legend: { ...commonOptions.plugins.legend, display: false } 
                    },
                    cutout: '75%'
                  }} 
               />
            </div>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-blue-600" />
                     <span className="text-xs font-bold text-slate-600">Clients</span>
                  </div>
                  <span className="text-xs font-black text-slate-800">{userMetrics?.distribution?.CLIENT || 0}</span>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-orange-500" />
                     <span className="text-xs font-bold text-slate-600">Freelancers</span>
                  </div>
                  <span className="text-xs font-black text-slate-800">{userMetrics?.distribution?.FREELANCER || 0}</span>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-slate-400" />
                     <span className="text-xs font-bold text-slate-600">Admins</span>
                  </div>
                  <span className="text-xs font-black text-slate-800">{userMetrics?.distribution?.ADMIN || 0}</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LOWER INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Top Talent Spotlight */}
         <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 bg-slate-50/50 border-b flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Talent Spotlight</CardTitle>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">High-engagement professionals</p>
               </div>
               <Link href="/admin/user-management/active" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Full Audit</Link>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  {userMetrics?.topFreelancers?.map((f: any) => (
                    <div key={f.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-300">
                             {f.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-800 tracking-tight">{f.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 truncate w-32 md:w-full">{f.email}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-slate-800">{f.count}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Settlements</p>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         {/* System Integrity & Safety */}
         <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 bg-slate-50/50 border-b">
               <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Platform Integrity</CardTitle>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Safety & Verification Traces</p>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 bg-green-100 text-green-600 rounded-2xl"><ShieldCheck size={20} /></div>
                     <div>
                        <p className="text-xs font-black text-slate-800">Verification Engine</p>
                        <p className="text-[10px] font-bold text-slate-400">KYC/Profile Integrity Check</p>
                     </div>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-green-500 h-full w-[88%]" />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[10px] font-black">
                     <span className="text-slate-400 tracking-widest">TRACE SUCCESS</span>
                     <span className="text-green-600">88%</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
                     <UserCheck className="text-blue-600 mb-2" size={20} />
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Verified Users</p>
                     <p className="text-2xl font-black text-slate-800 mt-1">1,120</p>
                  </div>
                  <div className="p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100/50">
                     <Clock className="text-orange-600 mb-2" size={20} />
                     <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Pending Audit</p>
                     <p className="text-2xl font-black text-slate-800 mt-1">164</p>
                  </div>
               </div>
               
               <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300">
                  Initiate Global Audit
               </button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
