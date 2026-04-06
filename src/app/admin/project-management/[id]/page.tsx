"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { baseFetcher } from "@/src/helpers/fetcher";
import { API_BASE_URL, BACKEND_URL } from "@/src/helpers/config";
import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Badge } from "@/src/app/components/ui/badge";
import { 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  FileText,
  User,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { data, isLoading, error } = useSWR(
    id ? `${API_BASE_URL}/admin/projects/${id}` : null,
    baseFetcher
  );

  const project = data?.data?.project;

  if (isLoading) return (
    <AdminBaseLayout>
      <div className="flex items-center justify-center min-h-[400px] text-primary font-bold animate-pulse">
        Loading project intelligence...
      </div>
    </AdminBaseLayout>
  );

  if (error || !project) return (
    <AdminBaseLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle size={48} className="text-red-500 opacity-20" />
        <h2 className="text-2xl font-black text-slate-800">Project Not Found</h2>
        <Button onClick={() => router.back()} variant="outline" className="rounded-xl font-bold">
          <ArrowLeft size={16} className="mr-2" /> Go Back
        </Button>
      </div>
    </AdminBaseLayout>
  );

  return (
    <AdminBaseLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 h-10 w-10 shrink-0"
              onClick={() => router.back()}
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">Project Intel</span>
                <span className="text-[10px] font-bold text-slate-400">ID: {project.id.slice(-8)}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{project.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <Badge className={`rounded-xl font-bold px-4 py-1 text-sm shadow-md ${
                project.status === 'COMPLETED' ? 'bg-green-500 text-white' :
                project.status === 'IN_PROGRESS' ? 'bg-blue-500 text-white' :
                project.status === 'OPEN' ? 'bg-orange-500 text-white' :
                'bg-slate-400 text-white'
              }`}>
                {project.status.replace("_", " ")}
              </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Project Overview Card */}
            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
               <CardHeader className="bg-slate-50/50 border-b p-6">
                 <CardTitle className="text-lg font-bold flex items-center">
                   <FileText className="mr-2 h-5 w-5 text-primary" />
                   Scope & Requirements
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                 <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Description</h4>
                   <p className="text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200 whitespace-pre-wrap">
                      {project.description}
                   </p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Required Skills</h4>
                     <div className="flex flex-wrap gap-2">
                       {project.skillsRequired.map((skill: string) => (
                         <span key={skill} className="px-3 py-1.5 rounded-xl bg-white border shadow-sm text-xs font-bold text-slate-700">
                           {skill}
                         </span>
                       ))}
                     </div>
                   </div>
                   <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Experience Level</h4>
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white shadow-lg">
                       <ShieldCheck size={16} className="text-blue-400" />
                       <span className="text-sm font-black uppercase tracking-tight">{project.experienceLevel}</span>
                     </div>
                   </div>
                 </div>
               </CardContent>
            </Card>

            {/* Applications Audit */}
            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
               <CardHeader className="bg-slate-50/50 border-b p-6">
                 <CardTitle className="text-lg font-bold flex items-center">
                   <Users className="mr-2 h-5 w-5 text-primary" />
                   Proposal Audit Trail
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="divide-y divide-slate-100">
                    {project.applications.length > 0 ? project.applications.map((app: any) => (
                      <div key={app.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center font-black border-2 border-white shadow-sm">
                             {app.freelancer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-none mb-1">{app.freelancer.name}</p>
                            <p className="text-[11px] font-bold text-slate-400">{app.freelancer.email}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                               <Badge variant="outline" className={`text-[9px] font-black px-1.5 py-0 rounded-md uppercase ${
                                  app.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-200' :
                                  app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                  'bg-slate-100 text-slate-500 border-slate-200'
                               }`}>
                                 {app.status}
                               </Badge>
                               <span className="text-[10px] font-bold text-slate-400">• Requested रू {app.bidAmount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-[10px] font-bold text-slate-400">Received {format(new Date(app.createdAt), "MMM d, yyyy")}</p>
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black text-primary hover:bg-primary/5 rounded-lg uppercase tracking-wider">
                             View Proposal <ExternalLink size={10} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <div className="p-12 text-center">
                         <MessageSquare size={32} className="mx-auto text-slate-200 mb-3" />
                         <p className="font-bold text-slate-400 italic">No proposals received yet.</p>
                      </div>
                    )}
                 </div>
               </CardContent>
            </Card>

          </div>

          {/* Sidebar Area (1/3) */}
          <div className="space-y-8">
            
            {/* Financial & Timeline */}
            <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl overflow-hidden p-8 space-y-8">
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Financial Configuration</h4>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black">रू</span>
                     <span className="text-4xl font-black">
                        {project.budgetType === 'FIXED' 
                          ? `${project.budgetMin} - ${project.budgetMax}` 
                          : `${project.budgetMin}/hr`}
                     </span>
                  </div>
                  <Badge className="mt-4 bg-white/10 text-white border-none rounded-lg font-bold px-3 py-1">
                    <DollarSign size={14} className="mr-1" />
                    {project.budgetType} Budget model
                  </Badge>
               </div>

               <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 text-slate-400">
                        <Calendar size={18} />
                        <span className="text-xs font-bold uppercase tracking-tight">Timeline</span>
                     </div>
                     <span className="text-sm font-black text-white">{project.duration || "TBD"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 text-slate-400">
                        <Clock size={18} />
                        <span className="text-xs font-bold uppercase tracking-tight">Created On</span>
                     </div>
                     <span className="text-sm font-black text-white">{format(new Date(project.createdAt), "MMM d, yyyy")}</span>
                  </div>
               </div>
            </Card>

            {/* Client Intelligence */}
            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
               <CardHeader className="bg-slate-50/50 border-b p-6">
                 <CardTitle className="text-lg font-bold flex items-center">
                   <User className="mr-2 h-5 w-5 text-primary" />
                   Client Profile
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-6 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-blue-50 text-primary flex items-center justify-center font-black text-2xl mx-auto border-4 border-white shadow-xl ring-2 ring-primary/5">
                     {project.client.profile?.profilePicture ? (
                       <img 
                          src={`${BACKEND_URL}/${project.client.profile.profilePicture}`} 
                          className="w-full h-full object-cover rounded-full" 
                        />
                     ) : (
                       project.client.name.charAt(0)
                     )}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-800 leading-none">{project.client.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">{project.client.email}</p>
                  </div>
                  <div className="pt-4 flex gap-2">
                     <Button className="flex-1 rounded-xl font-bold bg-primary hover:bg-primary/90 text-xs shadow-lg shadow-primary/20">
                        View Profile
                     </Button>
                     <Button variant="outline" className="rounded-xl font-bold text-slate-600 border-slate-200 text-xs">
                        Audit History
                     </Button>
                  </div>
               </CardContent>
            </Card>

          </div>

        </div>

      </div>
    </AdminBaseLayout>
  );
}
