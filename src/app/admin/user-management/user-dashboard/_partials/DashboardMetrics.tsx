"use client";

import React from "react";
import useSWR from "swr";
import { baseFetcher } from "@/src/helpers/fetcher";
import { API_BASE_URL } from "@/src/helpers/config";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/app/components/ui/card";
import { Users, Briefcase, TrendingUp, Calendar } from "lucide-react";
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

export default function DashboardMetrics() {
  const { data: metricsData, isLoading: isLoadingMetrics } = useSWR(
    `${API_BASE_URL}/admin/users/metrics`,
    baseFetcher
  );

  const metrics = metricsData?.data;

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
    </div>
  );
}
