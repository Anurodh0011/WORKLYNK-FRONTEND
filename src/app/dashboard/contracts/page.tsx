"use client";

import React from "react";
import BaseLayout from "@/src/app/components/base-layout";
import useSWR from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher } from "@/src/helpers/fetcher";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  Briefcase,
}from 'lucide-react';
import { Badge } from "@/src/app/components/ui/badge";
import { Card, CardContent } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs";
import Link from "next/link";

export default function MyContractsPage() {
  const { user }: any = useAuthContext();
  const { data, error, isLoading } = useSWR(
    user ? `${API_BASE_URL}/contracts/my-contracts` : null,
    baseFetcher
  );

  const contracts = data?.data || [];
  const isFreelancer = user?.role === "FREELANCER";
  const [activeTab, setActiveTab] = React.useState("All");

  const filteredContracts = contracts.filter((contract: any) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return contract.status === "ACTIVE";
    if (activeTab === "Pending") return contract.status === "PENDING_FREELANCER" || contract.status === "DRAFT";
    if (activeTab === "Completed") return contract.status === "COMPLETED";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500 hover:bg-green-600 gap-1"><CheckCircle2 size={12} /> Active</Badge>;
      case "PENDING_FREELANCER":
        return <Badge className="bg-amber-500 hover:bg-amber-600 gap-1"><Clock size={12} /> Pending Review</Badge>;
      case "DRAFT":
        return <Badge variant="secondary" className="gap-1 text-muted-foreground"><FileText size={12} /> Draft</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-500 hover:bg-blue-600 gap-1"><CheckCircle2 size={12} /> Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive" className="gap-1"><XCircle size={12} /> Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-primary border-primary gap-1"><AlertCircle size={12} /> {status}</Badge>;
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Contracts</h1>
          <p className="text-muted-foreground">Manage your active, pending, and past project contracts.</p>
        </div>

        <Tabs defaultValue="All" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-4 mb-8 bg-muted/50 p-1 rounded-2xl">
            <TabsTrigger value="All" className="rounded-xl">All</TabsTrigger>
            <TabsTrigger value="Pending" className="rounded-xl">Pending</TabsTrigger>
            <TabsTrigger value="Active" className="rounded-xl">Active</TabsTrigger>
            <TabsTrigger value="Completed" className="rounded-xl">Completed</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted/40 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/20">
              <p className="text-destructive font-bold mb-2">Error loading contracts</p>
              <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed">
              <FileText size={40} className="mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">No contracts yet</h3>
              <p className="text-muted-foreground mb-6">
                 {activeTab === "All" ? "When you have formal agreements, they will appear here." : `You have no ${activeTab.toLowerCase()} contracts.`}
              </p>
              {!isFreelancer && activeTab === "All" && (
                <Link href="/dashboard/projects">
                  <Button>Go to Projects</Button>
                </Link>
              )}
              {isFreelancer && activeTab === "All" && (
                <Link href="/dashboard/applications">
                  <Button>View Applications</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContracts.map((contract: any) => (
                <Card key={contract.id} className="group hover:shadow-lg transition-all duration-300 border-primary/5 hover:border-primary/20 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                      <Link href={`/contracts/${contract.id}/view`} className="flex-1 min-w-0 group/link block">
                        <div className="flex items-center gap-2 mb-2">
                           {getStatusBadge(contract.status)}
                           <span className="text-[10px] text-muted-foreground font-medium">Updated on {new Date(contract.updatedAt || contract.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-bold group-hover/link:text-primary transition-colors truncate mb-1">
                          {contract.project?.title || "Project"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center gap-1 font-medium bg-muted p-1 rounded">
                             {isFreelancer ? `Client: ${contract.client?.name}` : `Freelancer: ${contract.freelancer?.name}`}
                          </span>
                        </div>
                      </Link>

                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                        {contract.status === "ACTIVE" ? (
                          <Link href={`/contracts/${contract.id}/board`} className="w-full md:w-auto">
                             <Button className="w-full gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/20 font-bold px-6">
                               Project Board <Briefcase size={16} />
                             </Button>
                          </Link>
                        ) : contract.status === "PENDING_FREELANCER" && isFreelancer ? (
                          <Link href={`/contracts/${contract.id}/view`} className="w-full md:w-auto">
                             <Button className="w-full gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 font-bold px-6">
                               Review Contract <ChevronRight size={16} />
                             </Button>
                          </Link>
                        ) : (contract.status === "DRAFT" || contract.status === "PENDING_FREELANCER") && !isFreelancer ? (
                          <Link href={`/contracts/${contract.id}/edit`} className="w-full md:w-auto">
                             <Button variant="outline" className="w-full gap-2 rounded-xl group-hover:bg-primary/5 font-semibold">
                               {contract.status === "DRAFT" ? "Edit Draft" : "View Sent Offer"} <ChevronRight size={14} />
                             </Button>
                          </Link>
                        ) : (
                          <Link href={`/contracts/${contract.id}/view`} className="w-full md:w-auto">
                             <Button variant="outline" className="w-full gap-2 rounded-xl group-hover:bg-primary/5 font-semibold">
                               View Details <ChevronRight size={14} />
                             </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Tabs>
      </div>
    </BaseLayout>
  );
}
