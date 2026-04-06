"use client";

import React, { useState } from "react";
import useSWR from "swr";
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
  DropdownMenuTrigger,
} from "@/src/app/components/ui/dropdown-menu";
import { 
  Filter, 
  Briefcase, 
  MoreVertical, 
  Eye,
  FileBadge,
  Users
} from "lucide-react";
import AdminTable from "@/src/app/components/admin/AdminTable";

interface ProjectsTableProps {
  initialStatus?: string;
}

export default function ProjectsTable({ initialStatus = "ALL" }: ProjectsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [page, setPage] = useState(1);

  const projectsUrl = `${API_BASE_URL}/admin/projects?page=${page}&limit=10${statusFilter !== "ALL" ? `&status=${statusFilter}` : ""}`;
  const { data: projectsData, isLoading: isLoadingProjects } = useSWR(projectsUrl, baseFetcher);

  const projects = projectsData?.data?.projects || [];
  
  const columns = [
    {
      header: "Project Details",
      accessor: (project: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold shadow-sm ring-1 ring-orange-100">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-800 leading-tight line-clamp-1">{project.title}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{project.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Client",
      accessor: (project: any) => (
        <div className="flex flex-col">
          <p className="text-xs font-bold text-slate-700">{project.client?.name}</p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{project.client?.email}</p>
        </div>
      ),
    },
    {
      header: "Budget",
      accessor: (project: any) => (
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-800">
            {project.budgetType === 'FIXED' 
              ? `रू ${project.budgetMin} - ${project.budgetMax}` 
              : `रू ${project.budgetMin}/hr`}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">{project.budgetType}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (project: any) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-sm ${
          project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
          project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
          project.status === 'OPEN' ? 'bg-orange-100 text-orange-700' :
          project.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {project.status.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Engagement",
      accessor: (project: any) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" title="Applications">
            <Users size={12} className="text-slate-400" />
            <span className="text-[11px] font-bold text-slate-600">{project._count?.applications || 0}</span>
          </div>
          <div className="flex items-center gap-1" title="Contracts">
            <FileBadge size={12} className="text-slate-400" />
            <span className="text-[11px] font-bold text-slate-600">{project._count?.contracts || 0}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: (project: any) => (
        <span className="text-[11px] font-bold text-slate-500">
          {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      accessor: (project: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 h-8 w-8 text-slate-400">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl w-48">
            <DropdownMenuItem 
              className="font-bold text-slate-700 rounded-lg cursor-pointer"
              onClick={() => window.location.href = `/admin/project-management/${project.id}`}
            >
              <Eye size={14} className="mr-2" /> View Details
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
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Project Management</h1>
          <p className="text-muted-foreground font-medium">Monitor project workflows, budgets, and platform engagement.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              {statusFilter === "ALL" ? "All Platform Projects" : 
               statusFilter === "UPCOMING" ? "Upcoming Projects" :
               `${statusFilter.replace("_", " ").charAt(0) + statusFilter.replace("_", " ").slice(1).toLowerCase()} Projects`} Directory
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border rounded-xl px-3 py-1.5 shadow-sm">
                <Filter size={14} className="text-slate-400 mr-2" />
                <span className="text-[10px] font-black text-slate-400 uppercase mr-2 tracking-wider">Status:</span>
                <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                  <SelectTrigger className="h-6 border-0 bg-transparent shadow-none focus:ring-0 w-[130px] text-xs font-bold p-0">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    <SelectItem value="ALL" className="text-xs font-bold">All Status</SelectItem>
                    <SelectItem value="UPCOMING" className="text-xs font-bold">Upcoming</SelectItem>
                    <SelectItem value="OPEN" className="text-xs font-bold">Open (Bidding)</SelectItem>
                    <SelectItem value="IN_PROGRESS" className="text-xs font-bold">In Progress</SelectItem>
                    <SelectItem value="COMPLETED" className="text-xs font-bold">Completed</SelectItem>
                    <SelectItem value="CANCELLED" className="text-xs font-bold">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AdminTable 
            columns={columns} 
            data={projects} 
            isLoading={isLoadingProjects}
            emptyMessage="No projects found matching your filters."
          />
          
          {/* Pagination Controls */}
          {projectsData?.data?.pagination && projectsData.data.pagination.totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between bg-slate-50/50">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Page {projectsData.data.pagination.page} / {projectsData.data.pagination.totalPages}
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
                  disabled={page === projectsData.data.pagination.totalPages}
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
