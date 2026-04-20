"use client";

import React, { useState, useEffect } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher, mutationFetcher } from "@/src/helpers/fetcher";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Label } from "@/src/app/components/ui/label";
import { Textarea } from "@/src/app/components/ui/textarea";
import { FileText, Send, ArrowLeft, Plus, Trash2, Calendar, IndianRupee, MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Milestone {
  id?: string;
  title: string;
  description: string;
  amount: string;
  dueDate: string;
}

export default function ContractEditPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id;

  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/contracts/${contractId}`,
    baseFetcher
  );

  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setDescription(data.data.description || "");
      setStartDate(data.data.startDate ? data.data.startDate.split('T')[0] : "");
      if (data.data.milestones && data.data.milestones.length > 0) {
        setMilestones(data.data.milestones.map((m: any) => ({
          ...m,
          amount: m.amount.toString(),
          dueDate: m.dueDate ? m.dueDate.split('T')[0] : ""
        })));
      } else {
        // Add one default milestone if empty
        setMilestones([{ title: "", description: "", amount: data.data.totalAmount.toString(), dueDate: "" }]);
      }
    }
  }, [data]);

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", description: "", amount: "0", dueDate: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  const handleSave = async (isSending = false) => {
    // Validation for Sending only
    if (isSending) {
      if (!description.trim()) {
        toast.error("Please provide a contract description");
        return;
      }

      if (!startDate) {
        toast.error("Please provide a Project Start Date");
        return;
      }

      if (milestones.length === 0) {
        toast.error("Please add at least one milestone");
        return;
      }

      const hasEmptyMilestoneTitles = milestones.some(m => !m.title.trim());
      if (hasEmptyMilestoneTitles) {
        toast.error("Please provide titles for all milestones");
        return;
      }

      const totalMilestoneAmount = milestones.reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0);
      if (Math.abs(totalMilestoneAmount - (data?.data?.totalAmount || 0)) > 0.01) {
         toast.warning(`Total milestone amount (रू ${totalMilestoneAmount}) does not match agreed bid (रू ${data?.data?.totalAmount})`);
      }
    }

    setIsSaving(true);
    try {
      // 1. Update Terms
      const updateResponse = await mutationFetcher(`${API_BASE_URL}/contracts/${contractId}`, {
        arg: { description, milestones, startDate },
        method: "PATCH"
      } as any);

      if (!updateResponse.success) {
        throw new Error(updateResponse.message || "Failed to save contract");
      }

      if (isSending) {
        // 2. Send to Freelancer
        const sendResponse = await mutationFetcher(`${API_BASE_URL}/contracts/${contractId}/send`, {
          arg: {},
        } as any);

        if (sendResponse.success) {
          toast.success("Contract sent to freelancer!");
          router.push("/dashboard/projects");
        } else {
          toast.error(sendResponse.message);
        }
      } else {
        toast.success("Contract draft saved successfully");
        mutate(`${API_BASE_URL}/contracts/${contractId}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const contract = data?.data;

  if (isLoading) return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-lg mb-8" />
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    </BaseLayout>
  );

  if (error || !contract) return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-destructive">Error loading contract</h2>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    </BaseLayout>
  );

  return (
    <BaseLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
            <Link 
            href="/dashboard/projects" 
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
            <ArrowLeft size={16} /> Back to Projects
            </Link>
            <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    className="rounded-xl border-primary/20 hover:bg-primary/5"
                    onClick={() => handleSave(false)}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button 
                    className="rounded-xl gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                >
                    {isSaving ? "Sending..." : "Send to Freelancer"} <Send size={16} />
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight">Finalize Contract</h1>
              
              {contract.remarks && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-800 font-black text-sm uppercase tracking-wider">
                    <MessageSquare size={18} /> Freelancer Feedback
                  </div>
                  <p className="text-amber-900 leading-relaxed italic">
                    "{contract.remarks}"
                  </p>
                  <p className="text-xs text-amber-700 font-medium">
                    Please adjust the terms or milestones below and resend the offer.
                  </p>
                </div>
              )}

              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <p className="text-muted-foreground text-sm">
                  Defining terms for <span className="font-bold text-foreground">{contract.project.title}</span> with <span className="font-bold text-primary">{contract.freelancer.name}</span>.
                </p>
              </div>
            </section>

            <Card className="border-border/50 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="text-primary" size={20} /> Contract Overview
                </CardTitle>
                <CardDescription>Scope of work and general terms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-bold">Project Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input 
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-10 rounded-xl border-border/50 focus:ring-primary/20 max-w-sm"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground px-1">When the project is officially scheduled to begin.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-bold">Contract Description & Terms</Label>
                  <Textarea 
                    id="description" 
                    placeholder="E.g. Full-stack development of the e-commerce mobile app including payment gateway integration..."
                    className="min-h-[160px] rounded-xl border-border/50 focus:ring-primary/20"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground px-1">Describe exactly what the freelancer will deliver under this contract.</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Payment Milestones</h2>
                <Button 
                  onClick={addMilestone} 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-lg text-primary hover:bg-primary/10 gap-1 font-bold"
                >
                  <Plus size={16} /> Add Milestone
                </Button>
              </div>

              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <Card key={index} className="border-border/50 shadow-sm hover:border-primary/20 transition-all rounded-2xl group">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Title</Label>
                              <Input 
                                placeholder="e.g., UI/UX Design Completion" 
                                value={milestone.title}
                                onChange={(e) => updateMilestone(index, "title", e.target.value)}
                                className="rounded-xl bg-muted/30 border-none focus:ring-primary/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Due Date</Label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                <Input 
                                  type="date"
                                  value={milestone.dueDate}
                                  onChange={(e) => updateMilestone(index, "dueDate", e.target.value)}
                                  className="pl-10 rounded-xl bg-muted/30 border-none focus:ring-primary/20"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Amount (रू)</Label>
                              <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                <Input 
                                  type="number"
                                  value={milestone.amount}
                                  onChange={(e) => updateMilestone(index, "amount", e.target.value)}
                                  className="pl-10 rounded-xl bg-muted/30 border-none focus:ring-primary/20"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Requirements</Label>
                                <Input 
                                    placeholder="Deliverables for this milestone" 
                                    value={milestone.description}
                                    onChange={(e) => updateMilestone(index, "description", e.target.value)}
                                    className="rounded-xl bg-muted/30 border-none focus:ring-primary/20"
                                />
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeMilestone(index)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Summary */}
          <div className="space-y-6">
            <Card className="border-primary/10 shadow-2xl rounded-3xl overflow-hidden bg-primary/5">
                <CardHeader className="border-b border-primary/10">
                    <CardTitle className="text-lg font-bold">Offer Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="flex justify-between items-center py-2 border-b border-dashed border-primary/20">
                        <span className="text-muted-foreground text-sm">Agreed Bid</span>
                        <span className="font-extrabold text-lg">रू {contract.totalAmount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dashed border-primary/20">
                        <span className="text-muted-foreground text-sm">Milestones Total</span>
                        <span className={`font-extrabold text-lg ${
                            Math.abs(milestones.reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0) - contract.totalAmount) < 0.01 
                            ? "text-green-600" : "text-amber-600"
                        }`}>
                            रू {milestones.reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground text-sm">Remaining</span>
                        <span className="text-muted-foreground font-bold">
                            रू {Math.max(0, contract.totalAmount - milestones.reduce((sum, m) => sum + parseFloat(m.amount || "0"), 0))}
                        </span>
                    </div>

                    <div className="pt-4">
                        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-primary/10">
                            <h4 className="text-xs font-black uppercase text-primary mb-2">Pro-Tip 💡</h4>
                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                                Breaking the project into clear milestones helps ensure both sides are aligned on progress and payments. Use at least 2 milestones for larger projects.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-5 text-center space-y-4">
                    <p className="text-xs text-muted-foreground">
                        Once sent, the freelancer will review and can either accept or request changes.
                    </p>
                    <Button 
                        variant="link" 
                        className="text-xs font-bold text-primary hover:no-underline"
                        onClick={() => router.push(`/projects/${contract.projectId}/applications`)}
                    >
                        View Original Proposal
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
