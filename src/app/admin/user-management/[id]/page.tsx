"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { baseFetcher } from "@/src/helpers/fetcher";
import { API_BASE_URL, BACKEND_URL } from "@/src/helpers/config";
import AdminBaseLayout from "@/src/app/components/admin-base-layout";
import { Card, CardContent } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Badge } from "@/src/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs";
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  Briefcase, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Award, 
  GraduationCap, 
  History, 
  ShieldCheck,
  MoreVertical,
  MessageSquare,
  Clock,
  User as UserIcon
} from "lucide-react";
import { format } from "date-fns";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, error } = useSWR(
    id ? `${API_BASE_URL}/admin/users/${id}` : null,
    baseFetcher
  );

  const userData = data?.data?.user;
  const metrics = data?.data?.metrics;

  if (isLoading) return (
    <AdminBaseLayout>
      <div className="flex items-center justify-center min-h-[400px] animate-pulse font-bold text-primary">
        Synchronizing user intelligence...
      </div>
    </AdminBaseLayout>
  );

  if (error || !userData) return (
    <AdminBaseLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <h2 className="text-2xl font-black text-slate-800">Intelligence Record Not Found</h2>
        <Button onClick={() => router.back()} variant="outline" className="rounded-xl font-bold">
          <ArrowLeft size={16} className="mr-2" /> Back to Directory
        </Button>
      </div>
    </AdminBaseLayout>
  );

  return (
    <AdminBaseLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 h-10 w-10 shrink-0"
                onClick={() => router.back()}
              >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-2 py-0.5 rounded-md">User Intelligence Report</span>
                <span className="text-[10px] font-bold text-slate-400">UUID: {userData.id}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{userData.name}</h1>
            </div>
          </div>
          <Badge className={`rounded-xl font-black px-6 py-2 shadow-lg tracking-widest text-[10px] uppercase ${
            userData.status === 'ACTIVE' ? 'bg-green-500 text-white' : 
            userData.status === 'SUSPENDED' ? 'bg-orange-500 text-white' : 
            'bg-slate-500 text-white'
          }`}>
            {userData.status}
          </Badge>
        </div>

        {/* TOP SECTION: PROFILE & KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* User Profile Summary */}
          <Card className="lg:col-span-1 border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden p-8 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-[2rem] bg-slate-50 border-4 border-white shadow-2xl relative mb-6 overflow-hidden">
               {userData.profile?.profilePicture ? (
                 <img src={`${BACKEND_URL}/${userData.profile.profilePicture}`} className="w-full h-full object-cover" alt="" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-5xl font-black text-slate-200">{userData.name.charAt(0)}</div>
               )}
               {userData.profile?.verificationStatus === 'VERIFIED' && (
                 <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-xl border-4 border-white shadow-lg">
                    <ShieldCheck size={16} />
                 </div>
               )}
            </div>
            
            <h2 className="text-xl font-black text-slate-800 leading-tight mb-1">{userData.name}</h2>
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-6">{userData.role}</p>
            
            <div className="w-full space-y-4 pt-6 border-t border-slate-50">
               <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Mail size={14} /></div>
                  <div className="truncate flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Email Terminal</p>
                    <p className="text-xs font-bold text-slate-600 truncate">{userData.email}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Calendar size={14} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Member Since</p>
                    <p className="text-xs font-bold text-slate-600">{format(new Date(userData.createdAt), "MMM d, yyyy")}</p>
                  </div>
               </div>
            </div>
          </Card>

          {/* Performance KPIs */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
             <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2rem] p-8 flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/40 transition-all duration-700" />
                <div className="p-3 bg-white/10 rounded-2xl w-fit mb-4"><DollarSign size={24} className="text-blue-400" /></div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Lifetime Settlements</p>
                   <h3 className="text-4xl font-black tracking-tight">रू {metrics?.totalEarnings?.toLocaleString() || "0"}</h3>
                </div>
             </Card>

             <Card className="border-none shadow-xl bg-white rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden relative">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl w-fit mb-4"><Star size={24} /></div>
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reputation Score</p>
                   </div>
                   <h3 className="text-4xl font-black tracking-tight text-slate-800">{metrics?.averageRating?.toFixed(1) || "0.0"}</h3>
                   <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                         <Star key={s} size={12} className={s <= Math.round(metrics?.averageRating || 0) ? "fill-orange-400 text-orange-400" : "fill-slate-100 text-slate-100"} />
                      ))}
                      <span className="text-[10px] font-bold text-slate-400 ml-2">({userData.reviewsReceived.length} reviews)</span>
                   </div>
                </div>
             </Card>

             <Card className="border-none shadow-xl bg-white rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden relative">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4"><TrendingUp size={24} /></div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Audit Conversion Rate</p>
                   <h3 className="text-4xl font-black tracking-tight text-slate-800">{metrics?.conversionRate}%</h3>
                   <p className="text-[10px] font-bold text-slate-400 mt-2">
                      <span className="font-black text-blue-600">{metrics?.approvedContracts}</span> out of <span className="font-black text-slate-800">{metrics?.totalApplications}</span> proposals approved
                   </p>
                </div>
             </Card>

             {/* Secondary Row KPIs */}
             <div className="col-span-full grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-center">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Projects Directory</p>
                   <p className="text-lg font-black text-slate-800">{metrics?.projectsCount || 0}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-center">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Presence</p>
                   <p className="text-lg font-black text-slate-800">{(metrics?.approvedContracts > 0) ? "High" : "Standard"}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-center">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Transmission</p>
                   <p className="text-lg font-black text-slate-800">{userData.lastLoginAt ? format(new Date(userData.lastLoginAt), "MMM d") : "Unknown"}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-center">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Identity Check</p>
                   <Badge className={`w-fit uppercase text-[9px] font-black ${
                     userData.profile?.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                   }`}>
                     {userData.profile?.verificationStatus || "UNVERIFIED"}
                   </Badge>
                </div>
             </div>
          </div>
        </div>

        {/* BOTTOM SECTION: TABS & REVIEWS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left side: Profile Details (Knowledge Base) */}
           <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
                 <Tabs defaultValue="knowledge" className="w-full">
                    <div className="bg-slate-50/50 border-b p-4">
                       <TabsList className="bg-slate-200/50 p-1 rounded-2xl w-fit">
                          <TabsTrigger value="knowledge" className="rounded-xl px-6 h-9 data-[state=active]:bg-white data-[state=active]:shadow-lg text-[10px] font-black uppercase tracking-widest text-slate-500 data-[state=active]:text-primary transition-all duration-300">Profile Intelligence</TabsTrigger>
                          <TabsTrigger value="projects" className="rounded-xl px-6 h-9 data-[state=active]:bg-white data-[state=active]:shadow-lg text-[10px] font-black uppercase tracking-widest text-slate-500 data-[state=active]:text-primary transition-all duration-300">Project History</TabsTrigger>
                       </TabsList>
                    </div>

                    <TabsContent value="knowledge" className="p-8 space-y-10">
                       {/* Description */}
                       <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 pl-1 flex items-center gap-2">
                             <FileText size={12} className="text-primary" /> Professional Synopsis
                          </h4>
                          <h1 className="text-xl font-black text-slate-800 mb-3">{userData.profile?.headline || "Multidisciplinary Professional"}</h1>
                          <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200 italic">
                             "{userData.profile?.description || "No self-reported intelligence synopsis provided in this profile record."}"
                          </p>
                       </div>

                       {/* Experience & Education Grid */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                <Award size={12} className="text-primary" /> Career Trajectory
                             </h4>
                             {Array.isArray(userData.profile?.experience) ? userData.profile.experience.map((exp: any, i: number) => (
                               <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-primary/20">
                                  <p className="text-xs font-black text-slate-800 tracking-tight">{exp.position}</p>
                                  <p className="text-[11px] font-bold text-slate-500 mb-1">{exp.company}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{exp.duration}</p>
                               </div>
                             )) : <p className="text-xs font-bold text-slate-300 italic pl-1">No trajectory data detected.</p>}
                          </div>

                          <div className="space-y-6">
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                <GraduationCap size={12} className="text-primary" /> Intellectual Foundation
                             </h4>
                             {Array.isArray(userData.profile?.education) ? userData.profile.education.map((edu: any, i: number) => (
                               <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-blue-400/20">
                                  <p className="text-xs font-black text-slate-800 tracking-tight">{edu.degree}</p>
                                  <p className="text-[11px] font-bold text-slate-500 mb-1">{edu.institution}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{edu.year}</p>
                               </div>
                             )) : <p className="text-xs font-bold text-slate-300 italic pl-1">No certification records.</p>}
                          </div>
                       </div>

                       {/* Skills Matrix */}
                       <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 pl-1 flex items-center gap-2">
                             <Briefcase size={12} className="text-primary" /> Core Competency Matrix
                          </h4>
                          <div className="flex flex-wrap gap-2">
                             {userData.profile?.skills?.map((skill: string) => (
                               <Badge key={skill} className="bg-white border-slate-200 text-slate-700 rounded-lg font-bold px-3 py-1 shadow-sm hover:border-primary transition-colors">{skill}</Badge>
                             )) || <p className="text-xs font-bold text-slate-300 italic">No skills cataloged.</p>}
                          </div>
                       </div>
                    </TabsContent>

                    <TabsContent value="projects" className="m-0 focus-visible:ring-0">
                       <div className="divide-y divide-slate-100">
                          {userData.role === 'FREELANCER' ? 
                            (userData.contractsAsFreelancer.length > 0 ? userData.contractsAsFreelancer.map((c: any) => (
                              <div key={c.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                 <div>
                                    <h4 className="font-black text-slate-800 tracking-tight mb-1 text-sm">{c.project.title}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{format(new Date(c.createdAt), "MMMM yyyy")}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-sm font-black text-slate-800 mb-1">रू {c.paidAmount || 0}</p>
                                    <Badge className="bg-blue-50 text-blue-600 border-none uppercase text-[8px] font-black tracking-widest">{c.status}</Badge>
                                 </div>
                              </div>
                            )) : <div className="p-20 text-center text-slate-400 italic">No collaborative project history recorded.</div>)
                          : 
                            (userData.projects.length > 0 ? userData.projects.map((p: any) => (
                              <div key={p.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                 <div>
                                    <h4 className="font-black text-slate-800 tracking-tight mb-1 text-sm">{p.title}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{format(new Date(p.createdAt), "MMMM yyyy")}</p>
                                 </div>
                                 <Badge className="bg-orange-50 text-orange-600 border-none uppercase text-[8px] font-black tracking-widest">{p.status}</Badge>
                              </div>
                            )) : <div className="p-20 text-center text-slate-400 italic">No project directory entries found.</div>)
                          }
                       </div>
                    </TabsContent>
                 </Tabs>
              </Card>
           </div>

           {/* Right side: Reputation Audit (Reviews Received) */}
           <div className="lg:col-span-1 space-y-8">
              <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden h-full flex flex-col">
                 <div className="bg-slate-50/50 border-b p-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Star size={12} className="text-orange-400" /> Reputation Audit Trace
                    </h4>
                 </div>
                 <CardContent className="flex-1 p-0 overflow-y-auto max-h-[600px] scrollbar-hide">
                    {userData.reviewsReceived.length > 0 ? userData.reviewsReceived.map((review: any) => (
                      <div key={review.id} className="p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                         <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden">
                                 {review.reviewer.profile?.profilePicture ? (
                                   <img src={`${BACKEND_URL}/${review.reviewer.profile.profilePicture}`} className="w-full h-full object-cover" alt="" />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-300">{review.reviewer.name.charAt(0)}</div>
                                 )}
                              </div>
                              <div>
                                 <p className="text-xs font-black text-slate-800 leading-none mb-0.5">{review.reviewer.name}</p>
                                 <p className="text-[9px] font-bold text-slate-400">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
                              </div>
                           </div>
                           <div className="flex gap-px">
                              {[1,2,3,4,5].map(s => <Star key={s} size={8} className={s <= review.rating ? "fill-orange-400 text-orange-400" : "fill-slate-100 text-slate-100"} />)}
                           </div>
                         </div>
                         <p className="text-xs font-medium text-slate-500 leading-relaxed italic">"{review.comment}"</p>
                      </div>
                    )) : (
                      <div className="p-20 text-center flex flex-col items-center">
                         <Star size={32} className="text-slate-100 mb-4" />
                         <p className="font-bold text-slate-300 italic text-sm">No reputation trace found.</p>
                      </div>
                    )}
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </AdminBaseLayout>
  );
}
