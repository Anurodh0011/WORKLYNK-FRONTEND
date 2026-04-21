"use client";

import React, { useState } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import useSWR from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher } from "@/src/helpers/fetcher";
import { 
  Plus, 
  Briefcase, 
  Users, 
  Clock, 
  MoreVertical, 
  Edit3, 
  Eye, 
  FileText,
  IndianRupee,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { Badge } from "@/src/app/components/ui/badge";
import { Button } from "@/src/app/components/ui/button";
import { Card, CardContent } from "@/src/app/components/ui/card";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/src/app/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/src/app/components/ui/dialog";
import { toast } from "sonner";

export default function ClientProjectsPage() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/projects/my-projects`,
    baseFetcher
  );

  const projects = data?.data || [];
  const [activeTab, setActiveTab] = useState("All");
  const [projectToClose, setProjectToClose] = useState<any>(null);
  const [isClosing, setIsClosing] = useState(false);

  const getDerivedStatus = (project: any) => {
    if (project.status === "CANCELLED") return "Closed";
    if (project.status === "COMPLETED") return "Completed";
    const contract = project.contracts?.[0];
    if (!contract) return "Not Started";
    if (contract.status === "COMPLETED") return "Completed";
    if (contract.status === "ACTIVE") {
      const milestones = contract.milestones || [];
      const paidCount = milestones.filter((m: any) => m.status === "PAID").length;
      const reviewCount = milestones.filter((m: any) => m.status === "IN_REVIEW").length;
      if (paidCount > 0 || reviewCount > 0) return "Started";
      return "Not Started";
    }
    return "Not Started";
  };

  const filteredProjects = projects.filter((project: any) => {
    if (activeTab === "All") return project.status !== "CANCELLED";
    if (activeTab === "Closed") return project.status === "CANCELLED";
    return getDerivedStatus(project) === activeTab;
  });

  const handleCloseProject = async () => {
    if (!projectToClose) return;
    setIsClosing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${projectToClose.id}/close`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project closed successfully");
        setProjectToClose(null);
        mutate();
      } else {
        toast.error(data.message || "Failed to close project");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsClosing(false);
    }
  };

  const handleReopenProject = async (project: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${project.id}/reopen`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project reopened successfully");
        mutate();
      } else {
        toast.error(data.message || "Failed to reopen project");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <Badge className="bg-green-500 hover:bg-green-600">Open</Badge>;
      case "DRAFT": return <Badge variant="secondary">Draft</Badge>;
      case "IN_PROGRESS": return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case "COMPLETED": return <Badge variant="outline" className="border-green-500 text-green-500">Completed</Badge>;
      case "CANCELLED": return <Badge variant="destructive">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContractBadge = (contract: any) => {
    if (!contract) return null;
    if (contract.status === "DRAFT" || contract.status === "PENDING_FREELANCER") {
      return <Badge className="bg-amber-500 hover:bg-amber-600 gap-1 text-white border-0"><FileText size={12} /> Contract Progress</Badge>;
    }
    if (contract.status === "ACTIVE") {
      const milestones = contract.milestones || [];
      const paidCount = milestones.filter((m: any) => m.status === "PAID").length;
      const reviewCount = milestones.filter((m: any) => m.status === "IN_REVIEW").length;
      if (paidCount > 0) return <Badge className="bg-blue-500 hover:bg-blue-600 gap-1 text-white border-0"><CheckCircle2 size={12} /> Milestone {paidCount} Done</Badge>;
      if (reviewCount > 0) return <Badge className="bg-blue-500 hover:bg-blue-600 gap-1 text-white border-0">Started</Badge>;
      return <Badge className="bg-slate-500 hover:bg-slate-600 gap-1 text-white border-0">Not Started</Badge>;
    }
    if (contract.status === "COMPLETED") {
      return <Badge className="bg-green-500 gap-1 text-white border-0"><CheckCircle2 size={12} /> Completed</Badge>;
    }
    return null;
  };

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Projects</h1>
            <p className="text-muted-foreground">Manage your posted projects and review proposals from top talent.</p>
          </div>
          <Link href="/projects/new">
            <Button className="gap-2 shadow-lg shadow-primary/20 rounded-xl px-6">
              <Plus size={18} /> Post New Project
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="All" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="inline-flex max-w-full mb-8 bg-muted/50 p-1 rounded-2xl gap-1">
            <TabsTrigger value="All" className="rounded-xl px-4">All</TabsTrigger>
            <TabsTrigger value="Not Started" className="rounded-xl px-4">Not Started</TabsTrigger>
            <TabsTrigger value="Started" className="rounded-xl px-4">Started</TabsTrigger>
            <TabsTrigger value="Completed" className="rounded-xl px-4">Completed</TabsTrigger>
            <TabsTrigger value="Closed" className="rounded-xl px-4 data-[state=active]:text-red-600 data-[state=active]:bg-red-50">Closed</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-muted/40 animate-pulse rounded-2xl"></div>)}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/20">
              <p className="text-destructive font-bold mb-2">Error loading your projects</p>
              <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-24 bg-muted/10 rounded-3xl border border-dashed border-muted-foreground/20">
              <Briefcase size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">No projects found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                {activeTab === "All" ? "Post your first project to start receiving proposals." : `You have no ${activeTab.toLowerCase()} projects.`}
              </p>
              {activeTab === "All" && (
                <Link href="/projects/new"><Button size="lg" className="rounded-xl px-8">Get Started</Button></Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project: any) => {
                const hasApprovedContract = project.contracts?.some((c: any) => ["ACTIVE", "COMPLETED", "ON_HOLD"].includes(c.status));
                
                return (
                  <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-primary/5 hover:border-primary/20 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            {getStatusBadge(project.status)}
                            {project.contracts?.length > 0 && getContractBadge(project.contracts[0])}
                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                              <Clock size={12} /> Posted on {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors truncate mb-2">{project.title}</h3>
                          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                              <Users size={16} className="text-primary" /><span>{project._count.applications} Proposals</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <IndianRupee size={16} />
                              <span>{project.budgetType === "FIXED" ? `${project.budgetMin} - ${project.budgetMax}` : `${project.budgetMin}/hr`}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FileText size={16} /><span>{project.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {project.status === "CANCELLED" ? (
                            <Link href={`/projects/${project.id}`} className="flex-1 md:flex-none">
                              <Button variant="outline" className="w-full gap-2 rounded-xl text-muted-foreground">
                                View Details <Eye size={16} />
                              </Button>
                            </Link>
                          ) : project.status === "DRAFT" ? (
                            <Link href={`/projects/new?id=${project.id}`} className="flex-1 md:flex-none">
                              <Button className="w-full gap-2 rounded-xl shadow-lg shadow-primary/20">Resume Creation <ChevronRight size={16} /></Button>
                            </Link>
                          ) : project.contracts?.[0]?.status === "ACTIVE" ? (
                            <Link href={`/contracts/${project.contracts[0].id}/board`} className="flex-1 md:flex-none">
                              <Button className="w-full gap-2 rounded-xl bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 text-white">Project Board <Briefcase size={16} /></Button>
                            </Link>
                          ) : project.contracts?.[0]?.status === "COMPLETED" || project.status === "COMPLETED" ? (
                            <Link href={`/contracts/${project.contracts?.[0]?.id}/board`} className="flex-1 md:flex-none">
                              <Button variant="outline" className="w-full gap-2 rounded-xl border-green-500 text-green-600 hover:bg-green-50">View Completed <CheckCircle2 size={16} /></Button>
                            </Link>
                          ) : (
                            <Link href={`/projects/${project.id}/applications`} className="flex-1 md:flex-none">
                              <Button variant="outline" className="w-full gap-2 rounded-xl group-hover:bg-primary/5 group-hover:border-primary/30 group-hover:text-primary transition-all">
                                Review Proposals <ChevronRight size={16} />
                              </Button>
                            </Link>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10"><MoreVertical size={20} /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-primary/10">
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.id}`} className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg">
                                  <Eye size={16} /> View Details
                                </Link>
                              </DropdownMenuItem>
                              {project.contracts?.[0]?.status === "ACTIVE" && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/contracts/${project.contracts[0].id}/view`} className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg">
                                    <FileText size={16} /> View Contract
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              {project._count.applications === 0 && project.status !== "CANCELLED" && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/projects/new?id=${project.id}`} className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg">
                                    <Edit3 size={16} /> {project.status === "DRAFT" ? "Continue Editing" : "Edit Project"}
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              {!["CANCELLED", "COMPLETED"].includes(project.status) && !hasApprovedContract && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50"
                                    onClick={() => setProjectToClose(project)}
                                  >
                                    <XCircle size={16} /> Close Project
                                  </DropdownMenuItem>
                                </>
                              )}
                              {project.status === "CANCELLED" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg text-green-600 hover:text-green-700 hover:bg-green-50 focus:text-green-700 focus:bg-green-50"
                                    onClick={() => handleReopenProject(project)}
                                  >
                                    <RotateCcw size={16} /> Reopen Project
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}


            </div>
          )}
        </Tabs>
      </div>

      {/* Close Project Confirmation */}
      <Dialog open={!!projectToClose} onOpenChange={(open) => !open && setProjectToClose(null)}>
        <DialogContent className="max-w-sm rounded-3xl p-8">
          <DialogHeader>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <DialogTitle className="text-center text-xl font-black">Close Project?</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Closing <strong>{projectToClose?.title}</strong> will reject all pending proposals and the project won't accept new applications. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1 rounded-xl font-bold" onClick={() => setProjectToClose(null)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1 rounded-xl font-bold" onClick={handleCloseProject} disabled={isClosing}>
              {isClosing ? "Closing..." : "Close Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BaseLayout>
  );
}
