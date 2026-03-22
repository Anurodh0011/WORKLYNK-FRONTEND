"use client";

import React from "react";
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
  ChevronRight
} from "lucide-react";
import { Badge } from "@/src/app/components/ui/badge";
import { Button } from "@/src/app/components/ui/button";
import { Card, CardContent } from "@/src/app/components/ui/card";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/src/app/components/ui/dropdown-menu";

export default function ClientProjectsPage() {
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/projects/my-projects`,
    baseFetcher
  );

  const projects = data?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-green-500 hover:bg-green-600">Open</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">Draft</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="border-green-500 text-green-500">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted/40 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/20">
            <p className="text-destructive font-bold mb-2">Error loading your projects</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 bg-muted/10 rounded-3xl border border-dashed border-muted-foreground/20">
            <Briefcase size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No projects posted yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-8">
              Post your first project to start receiving proposals from our network of skilled freelancers.
            </p>
            <Link href="/projects/new">
              <Button size="lg" className="rounded-xl px-8">Get Started</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project: any) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-primary/5 hover:border-primary/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusBadge(project.status)}
                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                          <Clock size={12} /> Posted on {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors truncate mb-2">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <Users size={16} className="text-primary" />
                          <span>{project._count.applications} Proposals</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <IndianRupee size={16} />
                          <span>
                            {project.budgetType === "FIXED" 
                              ? `${project.budgetMin} - ${project.budgetMax}` 
                              : `${project.budgetMin}/hr`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText size={16} />
                          <span>{project.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {project.status === "DRAFT" ? (
                        <Link href={`/projects/new?id=${project.id}`} className="flex-1 md:flex-none">
                          <Button className="w-full gap-2 rounded-xl shadow-lg shadow-primary/20">
                            Resume Creation <ChevronRight size={16} />
                          </Button>
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
                          <Button variant="ghost" size="icon" className="h-10 w-10">
                            <MoreVertical size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-primary/10">
                          <DropdownMenuItem asChild>
                            <Link href={`/projects/${project.id}`} className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg">
                              <Eye size={16} /> View Details
                            </Link>
                          </DropdownMenuItem>
                          {project._count.applications === 0 && (
                            <DropdownMenuItem asChild>
                              <Link href={`/projects/new?id=${project.id}`} className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg">
                                <Edit3 size={16} /> {project.status === "DRAFT" ? "Continue Editing" : "Edit Project"}
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
