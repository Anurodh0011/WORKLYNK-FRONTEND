"use client";

import React, { useState } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useParams, useRouter } from "next/navigation";
import useSWR, { mutate as globalMutate } from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher, mutationFetcher } from "@/src/helpers/fetcher";
import { 
  IndianRupee, 
  Clock, 
  Briefcase, 
  CheckCircle2, 
  Calendar, 
  ArrowLeft,
  FileText,
  User,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Heart,
  ShieldAlert,
  Star,
  AlertTriangle,
  Download,
  X as XIcon
} from "lucide-react";
import { Button } from "@/src/app/components/ui/button";
import { Badge } from "@/src/app/components/ui/badge";
import { Card, CardContent } from "@/src/app/components/ui/card";
import { ProjectApplyForm } from "@/src/app/components/projects/ProjectApplyForm";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/src/app/components/ui/dialog";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user }: any = useAuthContext();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [isWithdrawConfirmOpen, setIsWithdrawConfirmOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isReopening, setIsReopening] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/projects/${id}`,
    baseFetcher
  );

  const project = data?.data;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  React.useEffect(() => {
    if (project) {
       setIsBookmarked(project.isBookmarked);
    }
  }, [project]);

  const toggleBookmark = async () => {
    if (!user) {
      toast.error("Please login to save projects.");
      return;
    }
    setIsToggling(true);
    try {
      const response = await mutationFetcher(`${API_BASE_URL}/bookmarks/projects/${id}/toggle`, {
        arg: {}
      });
      if (response.success) {
        setIsBookmarked(response.data.bookmarked);
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Failed to update bookmark.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    
    const verificationStatus = user.profile?.verificationStatus || "UNVERIFIED";
    if (verificationStatus !== "VERIFIED") {
      setIsVerifyDialogOpen(true);
    } else {
      setIsApplyOpen(true);
    }
  };

  const handleWithdrawProposal = async () => {
    if (!project?.myApplication) return;
    setIsWithdrawing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/applications/${project.myApplication.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "WITHDRAWN" })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Proposal withdrawn successfully");
        setIsWithdrawConfirmOpen(false);
        setIsProposalOpen(false);
        mutate();
      } else {
        toast.error(data.message || "Failed to withdraw proposal");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleReopenProject = async () => {
    setIsReopening(true);
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${project.id}/reopen`, {
        method: "POST",
        credentials: "include"
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
    } finally {
      setIsReopening(false);
    }
  };

  if (isLoading) {
    return (
      <BaseLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
           <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
           <div className="h-4 w-2/3 bg-muted rounded mb-8"></div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 h-[600px] bg-muted rounded-2xl"></div>
             <div className="h-[400px] bg-muted rounded-2xl"></div>
           </div>
        </div>
      </BaseLayout>
    );
  }

  if (error || !project) {
    return (
      <BaseLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Project Not Found</h1>
          <Button onClick={() => router.push("/browse-projects")}>Back to Browsing</Button>
        </div>
      </BaseLayout>
    );
  }

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const myApp = project.myApplication;
  const canWithdraw = myApp && myApp.status === "PENDING";
  const isOwner = user?.id === project.clientId || user?.id === project.client?.id;

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2 text-muted-foreground hover:text-primary transition-colors gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-card rounded-3xl p-8 border shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 uppercase tracking-widest text-[10px] py-1 px-3">
                  {project.category}
                </Badge>
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></div>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                  <Calendar size={12} /> Posted {timeAgo(project.createdAt)}
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 mt-4">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  {project.title}
                </h1>
                <div className="flex gap-3">
                    {user?.role === "FREELANCER" && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-12 w-12 rounded-2xl border transition-all ${isBookmarked ? "bg-red-50 text-red-500 border-red-500/20" : "bg-muted/50 border-muted-foreground/10 hover:border-red-500/20"}`}
                        onClick={toggleBookmark}
                        disabled={isToggling}
                      >
                         <Heart size={20} className={isBookmarked ? "fill-current" : ""} />
                      </Button>
                   )}
                   <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-muted-foreground/10" onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: project.title, url: window.location.href });
                      }
                   }}>
                      <ExternalLink size={20} />
                   </Button>
                </div>
              </div>

              {/* Applied Banner */}
              {myApp && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-8 flex items-center justify-between animate-in slide-in-from-left-4 duration-500">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                         <CheckCircle2 size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-bold">{myApp.status === "DRAFT" ? "You have a saved draft" : "You've already expressed interest"}</p>
                         <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Status: <span className={myApp.status === "DRAFT" ? "text-orange-500 font-bold" : "text-primary font-bold"}>{myApp.status}</span></p>
                      </div>
                   </div>
                   <Button 
                     variant="ghost" 
                     className="text-primary font-bold hover:bg-primary/10 rounded-xl" 
                     onClick={() => {
                        if (myApp.status === "DRAFT") {
                           setIsApplyOpen(true);
                        } else {
                           setIsProposalOpen(true);
                        }
                     }}
                   >
                      {myApp.status === "DRAFT" ? "Resume Draft" : "View My Proposal"}
                   </Button>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-muted/30 rounded-2xl border border-muted-foreground/10 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Budget</p>
                  <p className="text-sm font-bold flex items-center gap-1">
                    <IndianRupee size={14} className="text-primary" />
                    {project.budgetType === "FIXED" 
                      ? `${project.budgetMin} - ${project.budgetMax}` 
                      : `${project.budgetMin}/hr`}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Experience</p>
                  <p className="text-sm font-bold flex items-center gap-1">
                    <Briefcase size={14} className="text-primary" />
                    {project.experienceLevel}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Duration</p>
                  <p className="text-sm font-bold flex items-center gap-1">
                    <Clock size={14} className="text-primary" />
                    {project.duration} days
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Proposals</p>
                  <p className="text-sm font-bold flex items-center gap-1">
                    <FileText size={14} className="text-primary" />
                    {project._count.applications}+
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Project Description
                  </h3>
                  <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                    {project.description}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Skills Required
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skillsRequired.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="px-4 py-1.5 rounded-full font-semibold border-primary/20 bg-primary/5">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {project.checklist && project.checklist.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Requirements Checklist
                    </h3>
                    <div className="bg-muted/20 rounded-2xl p-6 border border-muted-foreground/10">
                      <ul className="space-y-3">
                        {project.checklist.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 text-sm font-medium">
                            <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {project.attachments && project.attachments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Project Attachments
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.attachments.map((file: any, index: number) => (
                        <a 
                          key={index}
                          href={file.url || `${process.env.NEXT_PUBLIC_API_URL}/${file.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-card border rounded-xl hover:border-primary transition-colors group"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText size={20} className="text-primary" />
                            <span className="text-xs truncate font-bold">{file.name}</span>
                          </div>
                          <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-3xl border shadow-lg overflow-hidden border-primary/10">
              <CardContent className="p-8 space-y-6">
                {user?.role === "FREELANCER" ? (
                  <>
                    <Button 
                      className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20"
                      onClick={handleApplyClick}
                      disabled={!!myApp && myApp.status !== "DRAFT"}
                      variant={(myApp && myApp.status !== "DRAFT") ? "outline" : "default"}
                    >
                      {(myApp && myApp.status !== "DRAFT") ? (
                         <span className="flex items-center gap-2">
                           <CheckCircle2 size={20} className="text-green-500" /> Applied
                         </span>
                      ) : (myApp && myApp.status === "DRAFT") ? (
                         "Resume Application"
                      ) : (
                        "Apply Now"
                      )}
                    </Button>

                    {/* Application Form Dialog */}
                    <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-10 border-none shadow-2xl">
                        <ProjectApplyForm 
                          projectId={project.id} 
                          checklist={project.checklist || []}
                          initialData={myApp?.status === "DRAFT" ? myApp : undefined}
                          onSuccess={() => {
                            setIsApplyOpen(false);
                            mutate();
                          }}
                          onCancel={() => setIsApplyOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>

                    {/* Verification Required Dialog */}
                    <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
                      <DialogContent className="max-w-md rounded-3xl p-8">
                        <DialogHeader>
                          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto border border-red-100 shadow-sm shadow-red-500/10">
                             <ShieldAlert size={32} />
                          </div>
                          <DialogTitle className="text-2xl font-bold text-center">Verification Required</DialogTitle>
                        </DialogHeader>
                        <div className="text-center space-y-4 pt-4">
                          <p className="text-muted-foreground leading-relaxed">
                            To ensure a safe and trustworthy environment, we require freelancers to verify their identity with a <strong>PAN or VAT</strong> document before applying for projects.
                          </p>
                          <div className="flex flex-col gap-3 pt-4">
                             <Button 
                               className="w-full h-12 rounded-xl font-bold"
                               onClick={() => router.push("/profile?tab=settings")}
                             >
                               Verify Now
                             </Button>
                             <Button 
                               variant="ghost" 
                               className="w-full h-12 rounded-xl font-medium"
                               onClick={() => setIsVerifyDialogOpen(false)}
                             >
                               Maybe Later
                             </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* My Proposal Dialog */}
                    <Dialog open={isProposalOpen} onOpenChange={setIsProposalOpen}>
                      <DialogContent className="max-w-2xl rounded-3xl p-8 border-none shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black tracking-tight">My Proposal</DialogTitle>
                          {myApp && (
                            <div className="flex items-center gap-2 pt-1">
                              <Badge className={
                                myApp.status === "ACCEPTED" ? "bg-green-500" :
                                myApp.status === "REJECTED" ? "bg-red-500" :
                                myApp.status === "WITHDRAWN" ? "bg-slate-400" :
                                "bg-primary"
                              }>{myApp.status}</Badge>
                              <span className="text-xs text-muted-foreground">Applied {myApp && new Date(myApp.createdAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </DialogHeader>

                        {myApp && (
                          <div className="space-y-5 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-muted/30 rounded-2xl border">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Bid Amount</p>
                                <p className="text-lg font-black flex items-center gap-1"><IndianRupee size={16}/>{myApp.bidAmount}</p>
                              </div>
                              <div className="p-4 bg-muted/30 rounded-2xl border">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Duration</p>
                                <p className="text-lg font-black flex items-center gap-1"><Clock size={16}/>{myApp.estimatedDuration} days</p>
                              </div>
                            </div>

                            <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl">
                              <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-3 uppercase tracking-widest"><FileText size={14}/> Cover Letter</h4>
                              <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{myApp.proposal}</p>
                            </div>

                            {myApp.attachments && myApp.attachments.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Attachments</h4>
                                {myApp.attachments.map((att: any, i: number) => (
                                  <a key={i} href={att.url || att.path} target="_blank" rel="noreferrer"
                                    className="flex items-center justify-between p-3 bg-card border rounded-xl hover:border-primary transition-colors group">
                                    <span className="flex items-center gap-2 text-sm font-bold"><FileText size={16} className="text-primary"/>{att.name}</span>
                                    <Download size={14} className="text-muted-foreground group-hover:text-primary"/>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <DialogFooter className="pt-6 flex gap-3">
                          {canWithdraw && (
                            <Button 
                              variant="destructive" 
                              className="rounded-xl flex-1 h-11 font-bold"
                              onClick={() => { setIsProposalOpen(false); setIsWithdrawConfirmOpen(true); }}
                            >
                              Withdraw Proposal
                            </Button>
                          )}
                          <Button variant="outline" className="rounded-xl flex-1 h-11 font-bold" onClick={() => setIsProposalOpen(false)}>
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Withdraw Confirmation Dialog */}
                    <Dialog open={isWithdrawConfirmOpen} onOpenChange={setIsWithdrawConfirmOpen}>
                      <DialogContent className="max-w-sm rounded-3xl p-8">
                        <DialogHeader>
                          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={28} className="text-red-500"/>
                          </div>
                          <DialogTitle className="text-center text-xl font-black">Withdraw Proposal?</DialogTitle>
                          <DialogDescription className="text-center pt-2">
                            This action cannot be undone. Your proposal for <strong>{project.title}</strong> will be permanently withdrawn.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-3 pt-4">
                          <Button variant="ghost" className="flex-1 rounded-xl font-bold" onClick={() => setIsWithdrawConfirmOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" className="flex-1 rounded-xl font-bold" onClick={handleWithdrawProposal} disabled={isWithdrawing}>
                            {isWithdrawing ? "Withdrawing..." : "Yes, Withdraw"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : isOwner ? (
                    project.status === "CANCELLED" ? (
                      <Button 
                        variant="default" 
                        className="w-full h-14 text-lg font-bold rounded-2xl bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/20"
                        onClick={handleReopenProject}
                        disabled={isReopening}
                      >
                        {isReopening ? "Reopening..." : "Reopen Project"}
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full h-14 text-lg font-bold rounded-2xl border-dashed" onClick={() => router.push("/dashboard/projects")}>
                          Manage Project
                      </Button>
                    )
                ) : user?.role === "CLIENT" ? (
                    <Button variant="outline" className="w-full h-14 text-lg font-bold rounded-2xl border-dashed" disabled>
                        Post Similar Project
                    </Button>
                ) : (
                  <Button 
                    className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20" 
                    onClick={() => router.push("/auth/login")}
                  >
                    Apply Now
                  </Button>
                )}
                
                <div className="space-y-4 pt-4 border-t border-muted/50">
                   <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-bold py-1 bg-green-500/5 text-green-600 border-green-500/20">
                         Payment Verified
                      </Badge>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Card - Dynamic */}
            <Card className="rounded-3xl border shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                 <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <User size={18} className="text-primary" />
                    About the Client
                 </h3>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20 overflow-hidden">
                      {project.client.profile?.profilePicture ? (
                        <img src={project.client.profile.profilePicture} alt={project.client.name} className="w-full h-full object-cover"/>
                      ) : (
                        project.client.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                        <p className="font-bold text-lg leading-none mb-1">{project.client.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                           <ShieldCheck size={12} className="text-primary" /> Verified Client
                        </p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="p-3 bg-muted/40 rounded-xl border border-muted-foreground/10">
                       <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mb-1">Projects</p>
                       <p className="text-sm font-extrabold">{project.client.projectCount ?? 0}</p>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-xl border border-muted-foreground/10">
                       <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mb-1">Rating</p>
                       <p className="text-sm font-extrabold flex items-center gap-1">
                         <Star size={12} className="text-yellow-500 fill-yellow-500"/>
                         {project.client.averageRating > 0 ? `${project.client.averageRating}/5` : "N/A"}
                       </p>
                    </div>
                 </div>

                 <Link href={`/profile/${project.client.id}`}>
                   <Button variant="outline" className="w-full justify-between text-sm font-bold hover:bg-primary/5 hover:border-primary/30 hover:text-primary h-11 px-4 rounded-xl transition-all">
                      View Profile
                      <ChevronRight size={16} />
                   </Button>
                 </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
