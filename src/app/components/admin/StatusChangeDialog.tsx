"use client";

import React, { useState } from "react";
import AdminDialog from "./AdminDialog";
import { Button } from "@/src/app/components/ui/button";
import { Textarea } from "@/src/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/components/ui/select";
import { toast } from "sonner";
import { API_BASE_URL } from "@/src/helpers/config";

interface StatusChangeDialogProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialStatus?: string;
}

export default function StatusChangeDialog({
  user,
  isOpen,
  onClose,
  onSuccess,
  initialStatus,
}: StatusChangeDialogProps) {
  const [newStatus, setNewStatus] = useState<string>(initialStatus || user?.status || "ACTIVE");
  const [remarks, setRemarks] = useState<string>("");
  const [suspensionDuration, setSuspensionDuration] = useState<string>("7");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: newStatus, 
          remarks,
          suspensionDuration: newStatus === "SUSPENDED" ? suspensionDuration : null
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`User status updated to ${newStatus}`);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred during status update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Update User Status"
      description={`Changing account status for ${user?.name}. This action may affect their platform access.`}
      className="max-w-md sm:rounded-3xl"
    >
      <div className="space-y-6 pt-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              New Account Status
            </label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="rounded-xl border-slate-200 h-11 font-bold shadow-sm">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ACTIVE" className="font-bold text-green-600">Active</SelectItem>
                <SelectItem value="SUSPENDED" className="font-bold text-yellow-600">Suspended</SelectItem>
                <SelectItem value="DEACTIVATED" className="font-bold text-red-600">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newStatus === "SUSPENDED" && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                Duration (Days)
              </label>
              <Select value={suspensionDuration} onValueChange={setSuspensionDuration}>
                <SelectTrigger className="rounded-xl border-slate-200 h-11 font-bold shadow-sm">
                  <SelectValue placeholder="Days" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="7" className="font-bold">7 Days</SelectItem>
                  <SelectItem value="10" className="font-bold">10 Days</SelectItem>
                  <SelectItem value="15" className="font-bold">15 Days</SelectItem>
                  <SelectItem value="30" className="font-bold">30 Days</SelectItem>
                  <SelectItem value="60" className="font-bold">60 Days</SelectItem>
                  <SelectItem value="90" className="font-bold">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
            Remarks / Reason
          </label>
          <Textarea
            placeholder="Provide a reason for this status change..."
            className="rounded-2xl border-slate-200 min-h-[120px] font-medium focus-visible:ring-primary/20 resize-none shadow-sm"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <p className="text-[10px] text-muted-foreground font-semibold italic flex items-center gap-1 opacity-70">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Visible in status history audit log
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            className="flex-1 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Confirm Change"}
          </Button>
        </div>
      </div>
    </AdminDialog>
  );
}

