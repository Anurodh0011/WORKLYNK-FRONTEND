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
import AdminKpiCard from "@/src/app/components/admin/AdminKpiCard";
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
        <AdminKpiCard
          title="Total Projects"
          value={metrics?.distribution?.TOTAL || "..."}
          icon={Briefcase}
          variant="gradient-blue"
        />

        <AdminKpiCard
          title="In Progress"
          value={metrics?.distribution?.IN_PROGRESS || "..."}
          icon={Clock}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <AdminKpiCard
          title="Completed"
          value={metrics?.distribution?.COMPLETED || "..."}
          icon={CheckCircle2}
          iconClassName="bg-green-50 text-green-500"
        />

        <AdminKpiCard
          title="Growth Index"
          value="+22%"
          icon={TrendingUp}
          iconClassName="bg-purple-50 text-purple-600"
        />
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
