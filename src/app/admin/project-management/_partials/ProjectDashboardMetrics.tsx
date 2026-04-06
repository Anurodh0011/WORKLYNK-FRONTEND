"use client";

import React from "react";
import useSWR from "swr";
import { baseFetcher } from "@/src/helpers/fetcher";
import { API_BASE_URL } from "@/src/helpers/config";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/app/components/ui/card";
import { 
  Briefcase, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  Clock,
  Layout
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

export default function ProjectDashboardMetrics() {
  const { data: metricsData, isLoading: isLoadingMetrics } = useSWR(
    `${API_BASE_URL}/admin/projects/metrics`,
    baseFetcher
  );

  const metrics = metricsData?.data;

  // Chart configs
  const statusChartData = {
    labels: ["Open", "In Progress", "Completed", "Cancelled", "Draft"],
    datasets: [
      {
        data: [
          metrics?.distribution?.OPEN || 0,
          metrics?.distribution?.IN_PROGRESS || 0,
          metrics?.distribution?.COMPLETED || 0,
          metrics?.distribution?.CANCELLED || 0,
          metrics?.distribution?.DRAFT || 0,
        ],
        backgroundColor: [
          "rgba(250, 166, 26, 0.8)", // Orange (Open)
          "rgba(45, 93, 161, 0.8)",  // Worklynk Blue (In Progress)
          "rgba(34, 197, 94, 0.8)",  // Green (Completed)
          "rgba(239, 68, 68, 0.8)",  // Red (Cancelled)
          "rgba(100, 116, 139, 0.8)", // Slate (Draft)
        ],
        borderWidth: 0,
      },
    ],
  };

  const trendChartData = {
    labels: metrics?.trend?.map((t: any) => t.name) || [],
    datasets: [
      {
        label: "New Projects",
        data: metrics?.trend?.map((t: any) => t.total) || [],
        borderColor: "rgba(250, 166, 26, 1)",
        backgroundColor: "rgba(250, 166, 26, 0.1)",
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
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Project Dashboard</h1>
          <p className="text-muted-foreground font-medium">Platform-wide project activity and lifecycle trends.</p>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 font-bold uppercase tracking-wider text-sm mb-1">Total Projects</p>
                <h3 className="text-4xl font-black">{metrics?.distribution?.TOTAL || "..."}</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-2xl">
                <Briefcase size={24} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">In Progress</p>
                <h3 className="text-4xl font-black text-slate-800">{metrics?.distribution?.IN_PROGRESS || "..."}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Clock size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">Completed</p>
                <h3 className="text-4xl font-black text-slate-800">{metrics?.distribution?.COMPLETED || "..."}</h3>
              </div>
              <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">Growth Index</p>
                <h3 className="text-4xl font-black text-slate-800">+22%</h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2 border-none shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b pb-4">
            <CardTitle className="flex items-center text-lg font-bold">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Project Postings Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full flex items-center justify-center">
              {isLoadingMetrics ? (
                <div className="animate-pulse h-4 w-24 bg-slate-200 rounded"></div>
              ) : metrics?.trend ? (
                <Line data={trendChartData} options={trendOptions} />
              ) : (
                <p className="text-slate-400">No trend data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b pb-4">
            <CardTitle className="flex items-center text-lg font-bold">
              <Layout className="mr-2 h-5 w-5 text-primary" />
              Status Mix
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full flex items-center justify-center">
              {isLoadingMetrics ? (
                <div className="animate-pulse h-4 w-24 bg-slate-200 rounded"></div>
              ) : metrics?.distribution ? (
                <Doughnut data={statusChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              ) : (
                <p className="text-slate-400">No status data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
