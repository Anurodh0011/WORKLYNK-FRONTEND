"use client";

import React, { useState } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import useSWR, { mutate } from "swr";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher, mutationFetcher } from "@/src/helpers/fetcher";
import { 
  Users, 
  IndianRupee, 
  Clock, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Download,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Star
} from "lucide-react";
import { Badge } from "@/src/app/components/ui/badge";
import { Button } from "@/src/app/components/ui/button";
import { Card, CardContent } from "@/src/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/app/components/ui/avatar";
import Link from "next/link";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/src/app/components/ui/dialog";

export default function ProjectApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;
  
  const { data: projectData } = useSWR(`${API_BASE_URL}/projects/${projectId}`, baseFetcher);
  const { data: applicationsData, isLoading, error } = useSWR(
    `${API_BASE_URL}/applications/project/${projectId}`,
    baseFetcher
  );

  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const project = projectData?.data;
  const applications = applicationsData?.data || [];

  const handleUpdateStatus = async (appId: string, status: string) => {
    setIsUpdating(true);
    try {
      const response = await mutationFetcher(`${API_BASE_URL}/applications/${appId}/status`, {
        arg: { status },
        method: "PATCH"
      } as any);

      if (response.success) {
        toast.success(`Application ${status.toLowerCase()} successfully`);
        mutate(`${API_BASE_URL}/applications/project/${projectId}`);
        setSelectedApp(null);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAcceptProposal = async (appId: string) => {
    setIsUpdating(true);
    try {
      const response = await mutationFetcher(`${API_BASE_URL}/applications/${appId}/accept`, {
        arg: {},
      } as any);

      if (response.success) {
        toast.success("Contract initialized successfully!");
        const contractId = response.data.id;
        // Redirect to contract edit page
        router.push(`/contracts/${contractId}/edit`);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initialize contract");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "WITHDRAWN":
        return <Badge variant="secondary">Withdrawn</Badge>;
      default:
        return <Badge variant="outline" className="text-primary border-primary">Pending</Badge>;
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Review Proposals</h1>
          {project && (
            <p className="text-muted-foreground flex items-center gap-2">
              For project: <span className="font-bold text-foreground">{project.title}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted/40 animate-pulse rounded-2xl"></div>
              ))
            ) : error ? (
              <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/20">
                <p className="text-destructive font-bold">Error loading applications</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-20 bg-muted/5 rounded-3xl border border-dashed text-muted-foreground">
                <Users size={40} className="mx-auto mb-4 opacity-20" />
                <p>No proposals received yet for this project.</p>
              </div>
            ) : (
              applications.map((app: any) => (
                <Card 
                  key={app.id} 
                  className={`cursor-pointer transition-all duration-300 border-primary/5 hover:border-primary/20 hover:shadow-lg ${selectedApp?.id === app.id ? "ring-2 ring-primary bg-primary/5 border-primary/20" : ""}`}
                  onClick={() => setSelectedApp(app)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6 items-start">
                      <Avatar className="h-14 w-14 border-2 border-primary/10">
                        <AvatarImage src={app.freelancer.profile?.profilePicture} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                          {app.freelancer.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-bold text-lg flex items-center gap-2">
                              {app.freelancer.name}
                              <ShieldCheck size={16} className="text-blue-500" />
                            </h4>
                            <p className="text-sm text-muted-foreground font-medium line-clamp-1">
                              {app.freelancer.profile?.headline || "Experienced Professional"}
                            </p>
                          </div>
                          <div className="text-right">
                             <p className="text-lg font-bold text-primary">रू {app.bidAmount}</p>
                             <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Total Bid</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-3">
                           <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                              <Clock size={14} className="text-primary" />
                              {app.estimatedDays} Days
                           </div>
                           <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                              <Star size={14} className="text-yellow-500 fill-yellow-500" />
                              4.8 (24 Reviews)
                           </div>
                           <div className="ml-auto">
                              {getStatusBadge(app.status)}
                           </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Application Detail View / Sidebar */}
          <div className="space-y-6">
             <Card className="sticky top-24 overflow-hidden border-primary/10 shadow-xl">
               {selectedApp ? (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                   <div className="p-6 border-b border-primary/5 bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="rounded-full">Proposal Detail</Badge>
                        <span className="text-[10px] text-muted-foreground">Applied {new Date(selectedApp.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-extrabold mb-1">रू {selectedApp.bidAmount}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        Completion in <strong>{selectedApp.estimatedDays} days</strong>
                      </p>
                   </div>
                   
                   <div className="p-6 space-y-6">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                          <MessageSquare size={14} /> Cover Letter
                        </h4>
                        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                          {selectedApp.proposal}
                        </p>
                      </div>

                      {selectedApp.attachments && selectedApp.attachments.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                             <Download size={14} /> Attachments
                          </h4>
                          <div className="space-y-2">
                            {selectedApp.attachments.map((file: any, idx: number) => (
                              <a 
                                key={idx} 
                                href={file.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg border group hover:border-primary/30 transition-all"
                              >
                                <span className="text-xs font-medium truncate max-w-[150px]">{file.name}</span>
                                <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedApp.status === "PENDING" && (
                        <div className="pt-4 flex gap-3">
                          <Button 
                            className="flex-1 bg-green-600 hover:bg-green-700 h-11 rounded-xl shadow-lg shadow-green-600/20"
                            onClick={() => handleAcceptProposal(selectedApp.id)}
                            disabled={isUpdating}
                          >
                            Accept Offer
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="flex-1 h-11 rounded-xl shadow-lg shadow-destructive/10"
                            onClick={() => handleUpdateStatus(selectedApp.id, "REJECTED")}
                            disabled={isUpdating}
                          >
                            Reject
                          </Button>
                        </div>
                      )}

                      <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary gap-2 h-11 rounded-xl">
                        View Full Profile <ChevronRight size={16} />
                      </Button>
                   </div>
                 </div>
               ) : (
                 <div className="p-12 text-center text-muted-foreground space-y-4">
                    <Users size={48} className="mx-auto opacity-10" />
                    <p className="text-sm font-medium">Select a proposal to view details and take action.</p>
                 </div>
               )}
             </Card>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
