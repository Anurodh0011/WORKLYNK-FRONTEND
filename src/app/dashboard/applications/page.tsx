"use client";

import React from "react";
import BaseLayout from "@/src/app/components/base-layout";
import useSWR from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher } from "@/src/helpers/fetcher";
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  IndianRupee,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/src/app/components/ui/badge";
import { Card, CardContent } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import Link from "next/link";

export default function MyApplicationsPage() {
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/applications/my-applications`,
    baseFetcher
  );

  const applications = data?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <Badge className="bg-green-500 hover:bg-green-600 gap-1"><CheckCircle2 size={12} /> Accepted</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="gap-1"><XCircle size={12} /> Rejected</Badge>;
      case "WITHDRAWN":
        return <Badge variant="secondary" className="gap-1 text-muted-foreground"><AlertCircle size={12} /> Withdrawn</Badge>;
      default:
        return <Badge variant="outline" className="text-primary border-primary gap-1"><Clock size={12} /> Pending</Badge>;
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Applications</h1>
          <p className="text-muted-foreground">Track the status of your project proposals and manage your job applications.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted/40 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/20">
            <p className="text-destructive font-bold mb-2">Error loading applications</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed">
            <Briefcase size={40} className="mx-auto text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6">Start browsing projects and submit your first proposal!</p>
            <Link href="/browse-projects">
              <Button>Browse Projects</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => (
              <Card key={app.id} className="group hover:shadow-lg transition-all duration-300 border-primary/5 hover:border-primary/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                         {getStatusBadge(app.status)}
                         <span className="text-[10px] text-muted-foreground font-medium">Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors truncate mb-1">
                        {app.project.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <IndianRupee size={12} /> {app.bidAmount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {app.estimatedDays} days
                        </span>
                        <span className="flex items-center gap-1">
                           {app.project.budgetType} Budget
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link href={`/projects/${app.project.id}`} className="flex-1 md:flex-none">
                        <Button variant="outline" className="w-full gap-2 rounded-xl group-hover:bg-primary/5">
                          View Project <ExternalLink size={14} />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                        <ChevronRight size={20} />
                      </Button>
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
