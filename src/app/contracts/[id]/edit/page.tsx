"use client";

import React from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher } from "@/src/helpers/fetcher";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { FileText, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContractEditPage() {
  const params = useParams();
  const contractId = params.id;

  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/contracts/${contractId}`,
    baseFetcher
  );

  const contract = data?.data;

  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/dashboard/projects" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {isLoading ? (
          <div className="h-64 bg-muted/40 animate-pulse rounded-2xl"></div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/20 text-destructive font-bold">
            Error loading contract details.
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Finalize Contract</h1>
                <p className="text-muted-foreground">
                  Define milestones and terms for your cooperation with <span className="text-foreground font-bold">{contract.freelancer.name}</span>
                </p>
              </div>
              <Badge className="w-fit bg-blue-500">Drafting</Badge>
            </div>

            <Card className="border-primary/10 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent border-b border-primary/5">
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="text-primary" size={20} />
                        Contract Details: {contract.project.title}
                    </CardTitle>
                    <CardDescription>
                        This contract is based on the accepted proposal of रू {contract.totalAmount}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="space-y-6">
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-yellow-800 text-sm">
                            <strong>Note:</strong> In Phase 2, you will be able to add detailed milestones and terms here before sending it to the freelancer.
                        </div>
                        
                        <div className="flex justify-end gap-4 mt-8">
                            <Button variant="outline" className="rounded-xl">Save Draft</Button>
                            <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
                                Send to Freelancer <Send size={16} />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}

// Simple Badge component if not imported
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${className}`}>
            {children}
        </span>
    );
}
