"use client";

import React, { useState } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher, mutationFetcher } from "@/src/helpers/fetcher";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Textarea } from "@/src/app/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/app/components/ui/dialog";
import { CheckCircle, XCircle, FileText, Calendar, IndianRupee, MessageSquare, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function ContractViewPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id;

  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/contracts/${contractId}`,
    baseFetcher
  );

  const [isResponding, setIsResponding] = useState(false);
  const [showNegotiateDialog, setShowNegotiateDialog] = useState(false);
  const [remarks, setRemarks] = useState("");

  const handleResponse = async (action: "ACCEPT" | "REJECT") => {
    setIsResponding(true);
    try {
      const response = await mutationFetcher(`${API_BASE_URL}/contracts/${contractId}/respond`, {
        arg: { action, remarks: action === "REJECT" ? remarks : undefined },
      } as any);

      if (response.success) {
        toast.success(response.message);
        if (action === "ACCEPT") {
          router.push(`/contracts/${contractId}/board`);
        } else {
          router.push("/dashboard/contracts");
        }
      } else {
        toast.error(response.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsResponding(false);
      setShowNegotiateDialog(false);
    }
  };

  if (isLoading) return <BaseLayout><div className="p-20 text-center">Loading contract...</div></BaseLayout>;
  if (error || !data?.data) return <BaseLayout><div className="p-20 text-center text-destructive">Error loading contract</div></BaseLayout>;

  const contract = data.data;

  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Review Contract Offer</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Briefcase size={16} /> {contract.project.title}
            </p>
          </div>
          
          {contract.status === "PENDING_FREELANCER" && (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 font-bold px-6"
                onClick={() => setShowNegotiateDialog(true)}
                disabled={isResponding}
              >
                Negotiate / Changes
              </Button>
              <Button 
                className="rounded-xl bg-primary hover:bg-primary/90 font-bold px-8 shadow-lg shadow-primary/20"
                onClick={() => handleResponse("ACCEPT")}
                disabled={isResponding}
              >
                Accept & Start Work
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Content */}
          <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
              <CardTitle className="text-xl flex items-center gap-3">
                <FileText className="text-primary" size={24} /> Contract Terms
              </CardTitle>
              <CardDescription>Prepared by {contract.client.name}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">Scope of Work</h3>
                <div className="bg-muted/10 p-6 rounded-2xl border border-border/40 leading-relaxed text-foreground/90">
                  {contract.description || "No description provided."}
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">Payment & Milestones</h3>
                    <div className="text-2xl font-black">रू {contract.totalAmount}</div>
                </div>
                
                <div className="space-y-4">
                  {contract.milestones && contract.milestones.map((m: any, idx: number) => (
                    <div key={idx} className="flex gap-6 p-6 rounded-2xl border border-border/50 hover:border-primary/20 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">
                            {idx + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div className="md:col-span-2">
                                <h4 className="font-bold text-lg mb-1">{m.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-1">{m.description || "No specific requirements."}</p>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                <Calendar size={16} /> 
                                {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "No date"}
                            </div>
                            <div className="text-right font-black text-lg">
                                रू {m.amount}
                            </div>
                        </div>
                    </div>
                  ))}
                </div>
              </section>
            </CardContent>
          </Card>

          {/* Client Info / Message */}
          <section className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-black">
                  {contract.client.name.charAt(0)}
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                  <h4 className="font-bold text-lg">Message from {contract.client.name}</h4>
                  <p className="text-muted-foreground text-sm italic">
                      "I've set up these milestones based on our discussion. Let me know if everything looks good so we can get started!"
                  </p>
              </div>
          </section>
        </div>
      </div>

      {/* Negotiation Dialog */}
      <Dialog open={showNegotiateDialog} onOpenChange={setShowNegotiateDialog}>
        <DialogContent className="rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="text-primary" size={24} /> Request Changes
            </DialogTitle>
            <DialogDescription>
              Describe what you'd like to adjust (e.g., milestone amounts, dates, or scope). The contract will go back to the client for revision.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="E.g. I need the initial deposit to be रू 40,000 instead of 30,000 to cover server setup..."
              className="min-h-[150px] rounded-2xl border-border/50 focus:ring-primary/20"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" className="rounded-xl" onClick={() => setShowNegotiateDialog(false)}>Cancel</Button>
            <Button 
                variant="destructive" 
                className="rounded-xl font-bold px-8 shadow-lg shadow-destructive/10"
                onClick={() => handleResponse("REJECT")}
                disabled={!remarks.trim() || isResponding}
            >
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BaseLayout>
  );
}
