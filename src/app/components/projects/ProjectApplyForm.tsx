"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { IndianRupee, Clock, Send, Paperclip, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/src/helpers/config";
import { mutationFetcher } from "@/src/helpers/fetcher";

interface ProjectApplyFormProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProjectApplyForm({ projectId, onSuccess, onCancel }: ProjectApplyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bidAmount: "",
    estimatedDays: "",
    proposal: "",
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("bidAmount", formData.bidAmount);
      payload.append("estimatedDays", formData.estimatedDays);
      payload.append("proposal", formData.proposal);
      
      files.forEach((file) => {
        payload.append("attachments", file);
      });

      const response = await mutationFetcher(`${API_BASE_URL}/applications/${projectId}/apply`, {
        arg: payload,
      });

      if (response.success) {
        toast.success("Application submitted successfully!");
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message || "Failed to submit application");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while applying.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold">Submit a Proposal</CardTitle>
        <CardDescription>
          Provide your best offer and explain why you're the best fit for this project.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bidAmount" className="flex items-center gap-2">
                <IndianRupee size={16} className="text-primary" />
                Your Bid Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">रू</span>
                <Input
                  id="bidAmount"
                  name="bidAmount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.bidAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <p className="text-[10px] text-muted-foreground">Total amount the client will see</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDays" className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                Estimated Days
              </Label>
              <Input
                id="estimatedDays"
                name="estimatedDays"
                type="number"
                placeholder="e.g. 7"
                value={formData.estimatedDays}
                onChange={handleInputChange}
                required
              />
              <p className="text-[10px] text-muted-foreground">How long will it take you to deliver?</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal">Cover Letter / Proposal</Label>
            <Textarea
              id="proposal"
              name="proposal"
              placeholder="Describe your relevant experience and how you plan to tackle this project..."
              className="min-h-[200px] resize-none"
              value={formData.proposal}
              onChange={handleInputChange}
              required
            />
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-muted-foreground">Minimum 50 characters required</p>
              <p className={`text-[10px] font-bold ${formData.proposal.length < 50 ? "text-orange-500" : "text-green-500"}`}>
                {formData.proposal.length} characters
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Attachments (Max 5)</Label>
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer relative group">
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={files.length >= 5}
              />
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Paperclip className="text-primary" size={24} />
                </div>
                <p className="text-sm font-medium">Click or drag to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, Images (Max 10MB each)</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-lg border border-muted-foreground/10 animate-in fade-in slide-in-from-left-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Paperclip size={14} className="text-primary shrink-0" />
                      <span className="text-xs truncate font-medium">{file.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {formData.proposal.length > 0 && formData.proposal.length < 50 && (
            <div className="flex items-center gap-2 text-orange-500 bg-orange-500/10 p-3 rounded-lg text-xs font-medium border border-orange-500/20">
              <AlertCircle size={16} />
              Your proposal is too short. Please add more details.
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              className="flex-1 h-12 text-lg font-bold shadow-lg shadow-primary/20"
              disabled={isSubmitting || formData.proposal.length < 50}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={18} />
                  Submit Proposal
                </span>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="h-12 px-8"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
