"use client";

import React from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import useSWR from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher } from "@/src/helpers/fetcher";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/app/components/ui/card";
import { Badge } from "@/src/app/components/ui/badge";
import { Button } from "@/src/app/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Users,
  Briefcase,
  Plus,
  Settings,
  MessageSquare,
  Bookmark,
  ChevronRight,
  FolderOpen,
  Loader2,
  Search,
  IndianRupee,
  Clock,
  CheckCircle2,
  BadgeAlert
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ArcElement,
  PointElement,
  LineElement
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ChartTitle, ChartTooltip, ChartLegend, ArcElement, PointElement, LineElement
);

export default function UserDashboard() {
  const { user, isLoading: authLoading }: any = useAuthContext();
  const router = useRouter();

  const isClient = user?.role === "CLIENT";

  const { data: projectsRes, isLoading: projLoading } = useSWR(isClient && user ? `${API_BASE_URL}/projects/my-projects` : null, baseFetcher);
  const { data: appsRes, isLoading: appLoading } = useSWR(!isClient && user ? `${API_BASE_URL}/applications/my-applications` : null, baseFetcher);
  const { data: contractsRes, isLoading: contrLoading } = useSWR(user ? `${API_BASE_URL}/contracts/my-contracts` : null, baseFetcher);
  const { data: bookmarksRes, isLoading: bookLoading } = useSWR(
    user ? (isClient ? `${API_BASE_URL}/bookmarks/freelancers` : `${API_BASE_URL}/bookmarks/projects`) : null,
    baseFetcher
  );

  const isLoading = authLoading || projLoading || appLoading || contrLoading || bookLoading;

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground font-bold animate-pulse">Synchronizing your workspace...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const projects = projectsRes?.data || [];
  const applications = appsRes?.data || [];
  const contracts = contractsRes?.data || [];
  const bookmarks = bookmarksRes?.data || [];

  // Client calculations
  const totalProposals = projects.reduce((acc: number, p: any) => acc + (p._count?.applications || 0), 0);
  const totalSpent = contracts
    .filter((c: any) => c.status === "ACTIVE" || c.status === "COMPLETED")
    .reduce((acc: number, c: any) => acc + (c.totalAmount || 0), 0);

  // Freelancer calculations
  const totalEarned = contracts
    .filter((c: any) => c.status === "ACTIVE" || c.status === "COMPLETED")
    .reduce((acc: number, c: any) => acc + (c.totalAmount || 0), 0);
  const interviewsCount = contracts.filter((c: any) => ["ACTIVE", "COMPLETED", "PENDING_FREELANCER"].includes(c.status)).length;

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-2">
            <Badge variant="outline" className="px-3 py-1 rounded-full border-primary/20 text-primary font-bold bg-primary/5 uppercase tracking-wider text-[10px]">
              {user.role} Workspace
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight">
              Namaste, <span className="text-primary">{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xl">
              {isClient 
                ? "Oversee your projects, manage freelancer applications, and grow your team today."
                : "Track your active applications, discover new opportunities, and manage your portfolio."}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="h-14 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 gap-2 group transition-all hover:scale-[1.02]"
              onClick={() => router.push(isClient ? "/projects/new" : "/browse-projects")}
            >
              {isClient ? <Plus size={20} className="group-hover:rotate-90 transition-transform" /> : <Search size={20} />}
              {isClient ? "Post New Project" : "Explore Projects"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 rounded-2xl font-bold text-lg border-primary/10 bg-card/40 backdrop-blur-sm gap-2 hover:bg-card/60 transition-all"
              onClick={() => router.push("/profile")}
            >
              <Settings size={20} />
              Setup
            </Button>
          </div>
        </header>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <StatCard 
            title={isClient ? "Projects Posted" : "Applications"}
            value={isLoading ? "..." : isClient ? projects.length : applications.length}
            icon={<Briefcase size={24} />}
            color="primary"
            onClick={() => router.push(isClient ? "/dashboard/projects" : "/dashboard/applications")}
          />
          <StatCard 
            title={isClient ? "Saved Talents" : "Saved Projects"}
            value={isLoading ? "..." : bookmarks.length}
            icon={isClient ? <Users size={24} /> : <Bookmark size={24} />}
            color="secondary"
            onClick={() => router.push(isClient ? "/dashboard/saved-freelancers" : "/dashboard/saved-projects")}
          />
          <StatCard 
            title={isClient ? "Total Proposals" : "Interviews/Offers"}
            value={isLoading ? "..." : isClient ? totalProposals : interviewsCount}
            icon={<MessageSquare size={24} />}
            color="accent"
            onClick={() => router.push("/dashboard/contracts")}
          />
          <StatCard 
            title={isClient ? "Total Spent" : "Total Earned"}
            value={isLoading ? "..." : `रू ${isClient ? totalSpent.toLocaleString() : totalEarned.toLocaleString()}`}
            icon={<span className="font-bold text-xl">रू</span>}
            color="success"
            onClick={() => router.push("/dashboard/contracts")}
          />
        </div>

        {/* Analytics Charts Area */}
        {!isLoading && contracts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-6 duration-1000 mb-12">
            <Card className="lg:col-span-2 border-none shadow-xl bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden">
               <CardHeader className="border-b border-primary/5 bg-primary/5 px-8 py-5">
                 <CardTitle className="text-xl font-bold flex items-center gap-2">
                   <IndianRupee size={20} className="text-primary" /> 
                   Recent Financial Flow
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                 <DashboardBarChart contracts={contracts} />
               </CardContent>
            </Card>
            
            <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden">
               <CardHeader className="border-b border-primary/5 bg-primary/5 px-8 py-5">
                 <CardTitle className="text-xl font-bold flex items-center gap-2">
                   <Briefcase size={20} className="text-primary" /> 
                   Contract Demographics
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                 <DashboardDoughnutChart contracts={contracts} />
               </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Card className="lg:col-span-2 border-none shadow-xl bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-primary/5 bg-primary/5 px-8 py-6">
              <div>
                <CardTitle className="text-2xl font-bold">Recent {isClient ? "Projects" : "Applications"}</CardTitle>
                <CardDescription className="font-medium">Your latest workspace activity</CardDescription>
              </div>
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-xl" onClick={() => router.push(isClient ? "/dashboard/projects" : "/dashboard/applications")}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
               {isLoading ? (
                  <div className="py-24 text-center">
                    <Loader2 className="animate-spin text-primary mx-auto" size={40} />
                  </div>
               ) : isClient && projects.length > 0 ? (
                 <div className="divide-y divide-primary/5">
                   {projects.slice(0, 4).map((project: any) => (
                     <div key={project.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => router.push(`/projects/${project.id}`)}>
                        <div>
                          <h4 className="font-bold text-lg mb-1 truncate max-w-sm">{project.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                            <span className="flex items-center gap-1"><Users size={14} className="text-primary" /> {project._count.applications} Proposals</span>
                            <span className="flex items-center gap-1"><IndianRupee size={14} /> {project.budgetMin} {project.budgetType === "HOURLY" ? "/hr" : ""}</span>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-muted-foreground" />
                     </div>
                   ))}
                 </div>
               ) : !isClient && applications.length > 0 ? (
                 <div className="divide-y divide-primary/5">
                   {applications.slice(0, 4).map((app: any) => (
                     <div key={app.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => router.push(`/projects/${app.project?.id}`)}>
                        <div>
                          <h4 className="font-bold text-lg mb-1 truncate max-w-sm">{app.project?.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                            <span className="flex items-center gap-1"><BadgeAlert size={14} className="text-primary" /> {app.status}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-muted-foreground" />
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-24 text-center px-8">
                    <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6 border border-primary/10">
                       <FolderOpen size={36} className="text-primary/40" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Workspace needs action</h3>
                    <p className="text-muted-foreground max-w-sm mb-8 font-medium">
                      {isClient 
                        ? "You haven't posted any projects recently. Start hiring top talent today!"
                        : "You haven't applied to any projects recently. Great opportunities are waiting!"}
                    </p>
                    <Button 
                      className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20"
                      onClick={() => router.push(isClient ? "/projects/new" : "/browse-projects")}
                    >
                      Get Started
                    </Button>
                 </div>
               )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden">
               <CardHeader className="pb-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-2">
                   <Briefcase size={20} className="text-primary" /> Active Workspaces
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" size={24}/></div>
                  ) : contracts.filter((c: any) => c.status === "ACTIVE").length > 0 ? (
                    contracts.filter((c: any) => c.status === "ACTIVE").slice(0, 4).map((contract: any) => (
                      <div key={contract.id} className="flex justify-between items-center p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer" onClick={() => router.push(`/contracts/${contract.id}/board`)}>
                        <div className="truncate pr-4">
                          <p className="font-bold text-sm text-slate-800 truncate">{contract.project?.title || "Project"}</p>
                          <p className="text-xs font-semibold text-primary/70">{isClient ? contract.freelancer?.name : contract.client?.name}</p>
                        </div>
                        <ChevronRight size={16} className="text-primary shrink-0" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-muted/20 border border-dashed rounded-2xl">
                      <p className="text-sm font-medium text-muted-foreground">No active workspaces.</p>
                    </div>
                  )}
               </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden">
               <CardHeader className="pb-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-2">
                   <BadgeAlert size={20} className="text-amber-500" /> Action Items
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                   {isLoading ? (
                     <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" size={24}/></div>
                   ) : contracts.filter((c: any) => c.status === "PENDING_FREELANCER" || c.status === "DRAFT").length > 0 ? (
                     contracts.filter((c: any) => c.status === "PENDING_FREELANCER" || c.status === "DRAFT").slice(0, 4).map((contract: any) => (
                       <div key={contract.id} className="flex justify-between items-center p-4 rounded-2xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors cursor-pointer" onClick={() => router.push(contract.status === "DRAFT" ? `/contracts/${contract.id}/edit` : `/contracts/${contract.id}/view`)}>
                         <div className="truncate pr-4">
                           <p className="font-bold text-sm text-slate-800 truncate">{contract.project?.title || "Contract Offer"}</p>
                           <p className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 mt-1">{contract.status === "DRAFT" ? "Review Draft" : "Pending Signature"}</p>
                         </div>
                         <ChevronRight size={16} className="text-amber-600 shrink-0" />
                       </div>
                     ))
                   ) : (
                     <div className="text-center py-6 bg-muted/20 border border-dashed rounded-2xl">
                       <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                     </div>
                   )}
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

function StatCard({ title, value, icon, color, onClick }: any) {
  const colorMap: any = {
    primary: "bg-primary text-white shadow-primary/30",
    secondary: "bg-secondary text-secondary-foreground shadow-secondary/20",
    accent: "bg-purple-500 text-white shadow-purple-500/20",
    success: "bg-green-500 text-white shadow-green-500/20"
  };

  return (
    <Card 
      className="border-none shadow-lg bg-card/60 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-3xl overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-5">
           <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 ${colorMap[color] || colorMap.primary}`}>
              {icon}
           </div>
           <div>
              <p className="text-[10px] uppercase font-extrabold tracking-widest text-muted-foreground mb-1">{title}</p>
              <p className="text-2xl font-black">{value}</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardBarChart({ contracts }: { contracts: any[] }) {
  const recentContracts = [...contracts]
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
    .reverse();

  if (recentContracts.length === 0) return <div className="h-64 flex items-center justify-center text-muted-foreground font-medium">No financial data.</div>;

  const data = {
    labels: recentContracts.map(c => c.project?.title?.substring(0, 15) + "..."),
    datasets: [
      {
        label: "Estimated/Paid Amount (रू)",
        data: recentContracts.map(c => c.totalAmount || 0),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        hoverBackgroundColor: "rgba(37, 99, 235, 1)",
        borderRadius: 8,
        barThickness: 32,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { size: 14, weight: 700 },
        bodyFont: { size: 14, weight: 700 },
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: { border: { display: false }, grid: { color: "rgba(0,0,0,0.05)" }, beginAtZero: true },
      x: { border: { display: false }, grid: { display: false } }
    }
  };

  return <div className="h-72 w-full"><Bar data={data} options={options as any} /></div>;
}

function DashboardDoughnutChart({ contracts }: { contracts: any[] }) {
  if (contracts.length === 0) return <div className="h-64 flex items-center justify-center text-muted-foreground font-medium">No contract data.</div>;

  const statusCounts = contracts.reduce((acc: any, c: any) => {
    let s = c.status.replace("_", " ");
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          "#3b82f6", // Blue for Active
          "#10b981", // Green for Completed
          "#f59e0b", // Amber for Pending
          "#64748b", // Slate for Draft
        ],
        borderWidth: 0,
        hoverOffset: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { position: 'bottom' as const, labels: { padding: 20, font: { weight: 600 } } },
    }
  };

  return <div className="h-72 w-full"><Doughnut data={data} options={options as any} /></div>;
}


