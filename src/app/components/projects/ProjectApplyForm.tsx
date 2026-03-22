"use client";

import React, { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  IndianRupee,
  Clock,
  Send,
  Paperclip,
  X,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Heart,
  UserCircle,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/src/helpers/config";
import { mutationFetcher, baseFetcher } from "@/src/helpers/fetcher";
import { Checkbox } from "../ui/checkbox";
import useSWR from "swr";
import Link from "next/link";

interface ProjectApplyFormProps {
  projectId: string;
  checklist?: string[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProjectApplyForm({
  projectId,
  checklist = [],
  onSuccess,
  onCancel,
}: ProjectApplyFormProps) {
  const { data: profileData, isLoading: isProfileLoading } = useSWR(
    `${API_BASE_URL}/freelancer/profile`,
    baseFetcher,
  );
  const profile = profileData?.data?.user?.profile;

  const isProfileComplete = useMemo(() => {
    return profile?.headline && profile?.skills && profile.skills.length > 0;
  }, [profile]);

  const [currentStep, setCurrentStep] = useState(checklist.length > 0 ? 1 : 2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const [formData, setFormData] = useState({
    bidAmount: "",
    estimatedDays: "",
    proposal: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const isChecklistComplete = useMemo(() => {
    return checkedItems.size === checklist.length;
  }, [checkedItems, checklist.length]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCheckItem = (index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleSubmit = async (status = "PENDING") => {
    if (!isProfileComplete) {
      toast.error(
        "Please complete your profile (headline & skills) before applying.",
      );
      return;
    }

    if (status === "PENDING" && !isChecklistComplete && checklist.length > 0) {
      toast.error("Please confirm all checklist items before submitting.");
      return;
    }

    if (status === "PENDING") setIsSubmitting(true);
    else setIsSavingDraft(true);

    try {
      const payload = new FormData();
      payload.append("bidAmount", formData.bidAmount);
      payload.append("estimatedDays", formData.estimatedDays);
      payload.append("proposal", formData.proposal);
      payload.append("status", status);

      files.forEach((file) => {
        payload.append("attachments", file);
      });

      const response = await mutationFetcher(
        `${API_BASE_URL}/applications/${projectId}/apply`,
        {
          arg: payload,
        },
      );

      if (response.success) {
        toast.success(
          status === "DRAFT"
            ? "Application saved for later!"
            : "Application submitted successfully!",
        );
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message || "Failed to process application");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
      setIsSavingDraft(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-bold animate-pulse text-xs uppercase tracking-widest">
          Checking Profile Status
        </p>
      </div>
    );
  }

  if (!isProfileComplete) {
    return (
      <div className="p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto text-orange-500">
          <UserCircle size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight mb-2">
            Profile Incomplete
          </h2>
          <p className="text-muted-foreground max-w-xs mx-auto font-medium">
            You need to complete your profile before you can apply for projects.
          </p>
        </div>
        <div className="pt-4">
          <Button
            asChild
            className="h-12 w-full rounded-xl font-bold text-lg shadow-xl shadow-primary/20"
          >
            <Link href="/profile">Complete My Profile</Link>
          </Button>
          <Button
            variant="ghost"
            className="mt-4 w-full rounded-xl font-bold"
            onClick={onCancel}
          >
            Maybe Later
          </Button>
        </div>
      </div>
    );
  }

  const renderChecklistStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <CheckCircle2 className="text-primary" size={20} />
          Qualification Checklist
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          The client has specified the following requirements. Please confirm
          that you meet all of them to proceed.
        </p>

        <div className="space-y-4">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${checkedItems.has(idx) ? "bg-primary/10 border-primary/30 shadow-sm" : "bg-card hover:border-primary/20"}`}
              onClick={() => toggleCheckItem(idx)}
            >
              <Checkbox
                id={`check-${idx}`}
                checked={checkedItems.has(idx)}
                onCheckedChange={() => toggleCheckItem(idx)}
                className="mt-1"
              />
              <Label
                htmlFor={`check-${idx}`}
                className="text-sm font-medium leading-relaxed cursor-pointer flex-1"
              >
                {item}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          className="flex-1 h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 group"
          disabled={!isChecklistComplete}
          onClick={() => setCurrentStep(2)}
        >
          I Meet All Requirements{" "}
          <ChevronRight
            className="ml-2 group-hover:translate-x-1 transition-transform"
            size={18}
          />
        </Button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit("PENDING");
      }}
      className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="bidAmount"
            className="flex items-center gap-2 font-bold"
          >
            <IndianRupee size={16} className="text-primary" />
            Your Bid Amount
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">
              रू
            </span>
            <Input
              id="bidAmount"
              name="bidAmount"
              type="number"
              placeholder="0.00"
              className="pl-8 h-12 rounded-xl"
              value={formData.bidAmount}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="estimatedDays"
            className="flex items-center gap-2 font-bold"
          >
            <Clock size={16} className="text-primary" />
            Estimated Days
          </Label>
          <Input
            id="estimatedDays"
            name="estimatedDays"
            type="number"
            placeholder="e.g. 7"
            className="h-12 rounded-xl"
            value={formData.estimatedDays}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="proposal" className="font-bold">
          Cover Letter / Proposal
        </Label>
        <Textarea
          id="proposal"
          name="proposal"
          placeholder="Describe your relevant experience and how you plan to tackle this project..."
          className="min-h-[180px] resize-none rounded-xl p-4"
          value={formData.proposal}
          onChange={handleInputChange}
          required
        />
        <div className="flex justify-between items-center text-[10px] font-bold">
          <p className="text-muted-foreground">Min 50 characters</p>
          <p
            className={
              formData.proposal.length < 50
                ? "text-orange-500"
                : "text-green-500"
            }
          >
            {formData.proposal.length} characters
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-bold">Attachments (Max 5)</Label>
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer relative group bg-muted/5">
          <input
            type="file"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={files.length >= 5}
          />
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Paperclip className="text-primary" size={20} />
            </div>
            <p className="text-sm font-bold">Add supporting documents</p>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">
              MAX 5 FILES • 10MB EACH
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-card p-2 rounded-lg border shadow-sm animate-in zoom-in-95 duration-200"
              >
                <span className="text-[10px] truncate font-bold flex items-center gap-2">
                  <Paperclip size={12} className="text-primary" /> {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
        <div className="flex gap-2 order-2 sm:order-1">
          {checklist.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCurrentStep(1)}
              className="rounded-xl"
            >
              <ChevronLeft size={18} /> Back
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-primary rounded-xl"
            onClick={() => handleSubmit("DRAFT")}
            disabled={isSavingDraft || isSubmitting}
          >
            {isSavingDraft ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={18} />
            )}
            Save Draft
          </Button>
        </div>

        <div className="flex-1 order-1 sm:order-2" />

        <Button
          type="submit"
          className="flex-1 sm:flex-none sm:px-10 h-12 text-lg font-bold shadow-xl shadow-primary/20 rounded-xl order-1 sm:order-3"
          disabled={
            isSubmitting || isSavingDraft || formData.proposal.length < 50
          }
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="flex items-center gap-2">
              <Send size={18} /> Submit Proposal
            </span>
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Apply for Project
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2.5 h-2.5 rounded-full ${currentStep === 1 ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-muted"}`}
            ></div>
            <div
              className={`w-2.5 h-2.5 rounded-full ${currentStep === 2 ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-muted"}`}
            ></div>
          </div>
        </div>
        <CardDescription className="text-base font-medium">
          {currentStep === 1
            ? "Confirm your qualifications before proceeding."
            : "Set your bid and explain why you're perfect for this task."}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {currentStep === 1 ? renderChecklistStep() : renderDetailsStep()}
      </CardContent>
    </Card>
  );
}
