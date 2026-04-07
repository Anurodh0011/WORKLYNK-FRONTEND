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
  AlertCircle,
  FileBadge,
  Paperclip,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs";

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
        Generating project intelligence report...
      </div>
    </AdminBaseLayout>
  );

  if (error || !project) return (
    <AdminBaseLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle size={48} className="text-red-500 opacity-20" />
        <h2 className="text-2xl font-black text-slate-800">Project Intelligence Not Found</h2>
        <Button onClick={() => router.back()} variant="outline" className="rounded-xl font-bold">
          <ArrowLeft size={16} className="mr-2" /> Return to Directory
        </Button>
      </div>
    </AdminBaseLayout>
  );

  const attachments = Array.isArray(project.attachments) ? project.attachments : [];

  return (
    <AdminBaseLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Navigation & Status Header */}
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
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">Project Management</span>
                <span className="text-[10px] font-bold text-slate-400">UUID: {project.id}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{project.title}</h1>
            </div>
          </div>
          
          <Badge className={`rounded-xl font-bold px-4 py-1 text-sm shadow-md ${
            project.status === 'COMPLETED' ? 'bg-green-500 text-white' :
            project.status === 'IN_PROGRESS' ? 'bg-blue-500 text-white' :
            project.status === 'OPEN' ? 'bg-orange-500 text-white' :
            'bg-slate-400 text-white'
          }`}>
            {project.status.replace("_", " ")}
          </Badge>
        </div>

        {/* TOP SECTION: SCOPE & CLIENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-3xl overflow-hidden">
             <CardHeader className="bg-slate-50/50 border-b p-6">
               <CardTitle className="text-lg font-bold flex items-center">
                 <FileText className="mr-2 h-5 w-5 text-primary" />
                 Platform Scope Intelligence
               </CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-6">
               <div>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Detailed Description</h4>
                 <div className="text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200 whitespace-pre-wrap min-h-[120px]">
                    {project.description}
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Skills Mix</h4>
                   <div className="flex flex-wrap gap-2">
                     {project.skillsRequired.map((skill: string) => (
                       <span key={skill} className="px-3 py-1.5 rounded-xl bg-white border shadow-sm text-xs font-bold text-slate-700">
                         {skill}
                       </span>
                     ))}
                   </div>
                 </div>
                 
                 {attachments.length > 0 && (
                   <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Audit Documents</h4>
                     <div className="space-y-2">
                       {attachments.map((file: any, i: number) => (
                         <a 
                           key={i} 
                           href={`${BACKEND_URL}/${file.url}`} 
                           target="_blank" 
                           rel="noreferrer"
                           className="flex items-center gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl group hover:bg-blue-50 transition-colors"
                         >
                            <Paperclip size={14} className="text-blue-500" />
                            <span className="text-xs font-bold text-slate-700 flex-1 truncate">{file.name || `Document ${i+1}`}</span>
                            <Download size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </a>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl overflow-hidden p-8 space-y-8 h-full">
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Financial Guardrails</h4>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-blue-400">रू</span>
                     <span className="text-4xl font-black">
                        {project.budgetType === 'FIXED' 
                          ? `${project.budgetMin} - ${project.budgetMax}` 
                          : `${project.budgetMin}/hr`}
                     </span>
                  </div>
                  <Badge className="mt-4 bg-white/10 text-white border-none rounded-lg font-bold px-3 py-1">
                    <Clock size={12} className="mr-2" />
                    {project.duration || "Timeline TBD"}
                  </Badge>
               </div>

               <div className="pt-6 border-t border-white/10">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Client Representative</h4>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-black text-white border border-white/20">
                        {project.client.name.charAt(0)}
                     </div>
                     <div>
                        <p className="font-bold text-white leading-none">{project.client.name}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1">{project.client.email}</p>
                     </div>
                  </div>
               </div>
            </Card>
          </div>
        </div>

        {/* BOTTOM SECTION: TABS (PROPOSAL & CONTRACTS) */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
           <Tabs defaultValue="proposals" className="w-full">
              <div className="bg-slate-50/50 border-b p-4 text-left">
                 <TabsList className="bg-slate-200/50 p-1 rounded-2xl w-fit">
                    <TabsTrigger 
                       value="proposals" 
                       className="rounded-xl px-6 h-9 data-[state=active]:bg-white data-[state=active]:shadow-lg text-[10px] font-black uppercase tracking-widest text-slate-500 data-[state=active]:text-primary transition-all duration-300"
                    >
                       Proposals ({project.applications.length})
                    </TabsTrigger>
                    <TabsTrigger 
                       value="contracts" 
                       className="rounded-xl px-6 h-9 data-[state=active]:bg-white data-[state=active]:shadow-lg text-[10px] font-black uppercase tracking-widest text-slate-500 data-[state=active]:text-primary transition-all duration-300"
                    >
                       Contracts ({project.contracts.length})
                    </TabsTrigger>
                 </TabsList>
              </div>

              <TabsContent value="proposals" className="m-0 focus-visible:ring-0">
                 <div className="divide-y divide-slate-100">
                    {project.applications.length > 0 ? project.applications.map((app: any) => {
                      const appAttachments = Array.isArray(app.attachments) ? app.attachments : [];
                      const pfImg = app.freelancer.profile?.profilePicture;
                      
                      return (
                        <div key={app.id} className="p-6 hover:bg-slate-50/40 transition-colors">
                          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black border-2 border-white shadow-xl ring-2 ring-primary/5 overflow-hidden">
                                   {pfImg ? (
                                     <img src={`${BACKEND_URL}/${pfImg}`} className="w-full h-full object-cover" alt="" />
                                   ) : (
                                     app.freelancer.name.charAt(0)
                                   )}
                                </div>
                                <div>
                                   <h3 className="font-black text-lg text-slate-800 leading-none mb-1">{app.freelancer.name}</h3>
                                   <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{app.freelancer.email}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="bg-white border rounded-xl px-4 py-2 flex flex-col justify-center items-end shadow-sm">
                                <p className="text-xl font-black text-slate-800 tracking-tighter">रू {app.bidAmount}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fixed Bid</p>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                             <div className="lg:col-span-9 space-y-3">
                                <p className="text-xs font-medium text-slate-600 leading-tight line-clamp-3 hover:line-clamp-none transition-all cursor-pointer bg-white p-3 rounded-lg border shadow-sm">
                                   "{app.proposal}"
                                </p>
                                <div className="flex items-center gap-3">
                                   <Badge className={`rounded-md font-black tracking-tighter uppercase px-2 py-0.5 text-[9px] ${
                                      app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                      app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                      'bg-slate-200 text-slate-600'
                                   }`}>
                                      {app.status}
                                   </Badge>
                                   <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                      <Clock size={10} /> {app.estimatedDuration}
                                   </span>
                                </div>
                             </div>

                             <div className="lg:col-span-3">
                                {appAttachments.length > 0 ? (
                                   <div className="space-y-1.5 flex flex-col">
                                      {appAttachments.slice(0, 2).map((file: any, i: number) => (
                                         <button 
                                            key={i}
                                            className="w-full flex items-center rounded-lg h-8 px-2 font-bold text-[10px] border border-slate-100 bg-white hover:bg-slate-800 hover:text-white transition-all group"
                                            onClick={() => window.open(`${BACKEND_URL}/${file.url}`, '_blank')}
                                         >
                                            <Paperclip size={12} className="mr-2 text-slate-300" />
                                            <span className="flex-1 truncate text-left">{file.name || "Doc"}</span>
                                            <Download size={12} className="ml-1 opacity-40 group-hover:opacity-100" />
                                         </button>
                                      ))}
                                   </div>
                                ) : (
                                   <div className="h-full flex items-center justify-center border-l border-slate-200 pl-4">
                                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Documents</p>
                                   </div>
                                )}
                             </div>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="p-20 text-center">
                         <p className="font-bold text-slate-400 italic">No candidates detected.</p>
                      </div>
                    )}
                 </div>
              </TabsContent>

              <TabsContent value="contracts" className="m-0 focus-visible:ring-0">
                 <div className="divide-y divide-slate-100">
                    {project.contracts.length > 0 ? project.contracts.map((contract: any) => {
                      const cPfImg = contract.freelancer.profile?.profilePicture;
                      return (
                        <div key={contract.id} className="p-8 hover:bg-slate-50/40 transition-colors">
                          <div className="flex flex-col lg:flex-row justify-between mb-8 gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black border-2 border-white shadow-xl ring-2 ring-primary/5 overflow-hidden">
                                   {cPfImg ? (
                                     <img src={`${BACKEND_URL}/${cPfImg}`} className="w-full h-full object-cover" alt="" />
                                   ) : (
                                     contract.freelancer.name.charAt(0)
                                   )}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Execution Legal Partner</p>
                                  <h3 className="font-black text-2xl text-slate-800 tracking-tight leading-none">{contract.freelancer.name}</h3>
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{contract.freelancer.email}</p>
                                </div>
                            </div>
                            <div className="bg-slate-900 text-white p-6 rounded-3xl min-w-[240px] shadow-2xl relative overflow-hidden group">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 opacity-70">Contracted Amount</p>
                                <p className="text-3xl font-black tracking-tight mb-4">रू {contract.totalAmount}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                   <Badge className="bg-blue-500 text-white border-none rounded-lg font-black uppercase text-[9px] tracking-widest shadow-lg shadow-blue-500/20">{contract.status}</Badge>
                                   {contract.documentUrl && (
                                      <button 
                                         className="h-8 rounded-lg text-xs font-black text-slate-400 hover:text-white transition-colors"
                                         onClick={() => window.open(`${BACKEND_URL}/${contract.documentUrl}`, '_blank')}
                                      >
                                         Download Contract <Download size={14} className="ml-1.5" />
                                      </button>
                                   )}
                                </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                             <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Starts</p>
                                <p className="text-sm font-black text-slate-800">{contract.startDate ? format(new Date(contract.startDate), "MMM d, yyyy") : "TBD"}</p>
                             </div>
                             <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ends/Renew</p>
                                <p className="text-sm font-black text-slate-800">{contract.endDate ? format(new Date(contract.endDate), "MMM d, yyyy") : "Active"}</p>
                             </div>
                             <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex flex-col justify-center">
                                <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1">Settled Funds</p>
                                <p className="text-sm font-black text-green-700">रू {contract.paidAmount || 0}</p>
                             </div>
                             <div className="flex items-center justify-end">
                                <button className="rounded-xl font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors border-none h-12 px-6 tracking-widest uppercase text-[10px]">
                                   Ledger
                                </button>
                             </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="p-24 text-center">
                         <p className="font-bold text-slate-400 italic">No project execution contracts.</p>
                      </div>
                    )}
                 </div>
              </TabsContent>
           </Tabs>
        </div>

      </div>
    </AdminBaseLayout>
  );
}
