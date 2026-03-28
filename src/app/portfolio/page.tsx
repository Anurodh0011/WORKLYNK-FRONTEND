"use client";

import React, { useState } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import useSWR from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher } from "@/src/helpers/fetcher";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { 
  FolderGit2, 
  Briefcase,
  CheckCircle2,
  Clock,
  IndianRupee,
  ChevronRight,
  MoreVertical,
  LayoutTemplate,
  FileText,
  User
} from "lucide-react";
import { Badge } from "@/src/app/components/ui/badge";
import { Card, CardContent } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/app/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/app/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";

export default function PortfolioPage() {
  const { user, isLoading: authLoading }: any = useAuthContext();
  const { data, error, isLoading: dataLoading } = useSWR(
    user ? `${API_BASE_URL}/contracts/my-contracts` : null,
    baseFetcher
  );

  const [activeTab, setActiveTab] = useState("All");
  const [selectedProposalForView, setSelectedProposalForView] = useState<any>(null);
  
  const allContracts = data?.data || [];
  
  // Filter for ACTIVE or COMPLETED only to build the professional portfolio
  const portfolioContracts = allContracts.filter((c: any) => c.status === "ACTIVE" || c.status === "COMPLETED");

  const filteredContracts = portfolioContracts.filter((contract: any) => {
    if (activeTab === "All") return true;
    if (activeTab === "Ongoing") return contract.status === "ACTIVE";
    if (activeTab === "Completed") return contract.status === "COMPLETED";
    return true;
  });

  const getStatusBadge = (status: string) => {
    if (status === "ACTIVE") {
      return <Badge className="bg-blue-500 hover:bg-blue-600 gap-1 text-white border-0 py-1"><Clock size={12} /> Ongoing</Badge>;
    }
    return <Badge className="bg-green-500 hover:bg-green-600 gap-1 text-white border-0 py-1"><CheckCircle2 size={12} /> Completed</Badge>;
  };

  const isLoading = authLoading || dataLoading;

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">Showcasing the history of projects you've successfully started and accomplished.</p>
        </div>

        <Tabs defaultValue="All" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-muted/50 p-1 rounded-2xl">
            <TabsTrigger value="All" className="rounded-xl font-bold">All</TabsTrigger>
            <TabsTrigger value="Ongoing" className="rounded-xl font-bold">Ongoing</TabsTrigger>
            <TabsTrigger value="Completed" className="rounded-xl font-bold">Completed</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted/40 animate-pulse rounded-3xl"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/20">
              <p className="text-destructive font-bold mb-2">Error loading portfolio</p>
              <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-muted-foreground/20">
              <FolderGit2 size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">No projects to show</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                 {activeTab === "All" 
                   ? "When your projects are finalized and active, they will automatically appear in your dynamic portfolio!" 
                   : `You have no ${activeTab.toLowerCase()} portfolio projects.`}
              </p>
              {activeTab === "All" && (
                <Link href={user?.role === "CLIENT" ? "/dashboard/projects" : "/dashboard/applications"}>
                  <Button size="lg" className="rounded-xl px-8 shadow-lg shadow-primary/20">View Workspace</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContracts.map((contract: any) => (
                <Card key={contract.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-primary/5 hover:border-primary/20 overflow-hidden flex flex-col h-full bg-slate-50 relative">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        {getStatusBadge(contract.status)}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-full transition-colors">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuItem onClick={() => setSelectedProposalForView(contract)} className="cursor-pointer gap-2 text-sm font-medium p-2">
                              <LayoutTemplate size={14} className="text-muted-foreground"/> View Proposal
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm font-medium p-2">
                              <Link href={`/contracts/${contract.id}/view`} className="w-full flex items-center">
                                <FileText size={14} className="text-muted-foreground mr-2"/> View Contract
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer gap-2 text-sm font-medium p-2" 
                              onClick={() => toast.info(`${user?.role === "FREELANCER" ? "Client" : "Freelancer"} public profiles are currently in development!`)}
                            >
                              <User size={14} className="text-muted-foreground"/> View {user?.role === "FREELANCER" ? "Client" : "Freelancer"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight leading-snug group-hover:text-primary transition-colors mb-3">
                        {contract.project?.title || "Project"}
                      </h3>
                      
                      <div className="space-y-4 mt-auto">
                         <div className="text-sm border-l-2 border-primary/20 pl-3 py-1 bg-white p-2 rounded-lg shadow-sm">
                           <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-widest">{user?.role === "FREELANCER" ? "Client" : "Freelancer"}</span>
                           <span className="font-bold text-slate-700">{user?.role === "FREELANCER" ? contract.client?.name : contract.freelancer?.name}</span>
                         </div>
                         <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                           <div className="flex flex-col">
                             <span className="text-[10px] text-muted-foreground uppercase font-black">Value</span>
                             <span className="font-bold text-slate-800 flex items-center"><IndianRupee size={12} className="mr-0.5 opacity-50"/> {contract.totalAmount}</span>
                           </div>
                           <Link href={`/contracts/${contract.id}/board`}>
                             <Button size="sm" variant={contract.status === "ACTIVE" ? "default" : "secondary"} className="rounded-xl font-bold px-4 gap-2">
                               {contract.status === "ACTIVE" ? "Workspace" : "Archive"} <ChevronRight size={14} />
                             </Button>
                           </Link>
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Tabs>
      </div>

      {/* View Proposal Modal */}
      <Dialog open={!!selectedProposalForView} onOpenChange={() => setSelectedProposalForView(null)}>
        <DialogContent className="rounded-3xl max-w-2xl px-4 sm:px-8 py-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight mb-2">Original Proposal</DialogTitle>
            <div className="flex items-center gap-2 mb-4">
               {selectedProposalForView && getStatusBadge(selectedProposalForView.status)}
            </div>
          </DialogHeader>
          {selectedProposalForView && (
            <div className="space-y-6">
               <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                 <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Project</h4>
                 <p className="text-lg font-bold text-slate-800 truncate">{selectedProposalForView.project?.title}</p>
                 <div className="flex items-center gap-4 flex-wrap text-sm font-bold text-slate-600 mt-4">
                   <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"><IndianRupee size={16} className="text-primary" /> Agreed Bid: {selectedProposalForView.totalAmount}</span>
                 </div>
               </div>
               
               <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl">
                 <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-4 uppercase tracking-widest"><FileText size={16} /> Proposal Details</h4>
                 <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                   {selectedProposalForView.description || "No specific proposal tracking data attached natively to this contract description."}
                 </div>
               </div>
            </div>
          )}
          <DialogFooter className="mt-6 border-t border-slate-100 pt-4">
            <Button variant="outline" className="rounded-xl w-full h-12 font-bold" onClick={() => setSelectedProposalForView(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BaseLayout>
  );
}
