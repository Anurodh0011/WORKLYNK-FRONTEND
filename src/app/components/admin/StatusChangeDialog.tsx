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
        body: JSON.stringify({ status: newStatus, remarks }),
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
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
            New Account Status
          </label>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger className="rounded-xl border-slate-200 h-12 font-bold shadow-sm">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ACTIVE" className="font-bold text-green-600">Active</SelectItem>
              <SelectItem value="SUSPENDED" className="font-bold text-yellow-600">Suspended</SelectItem>
              <SelectItem value="DEACTIVATED" className="font-bold text-red-600">Deactivated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
            Remarks / Reason
          </label>
          <Textarea
            placeholder="Provide a reason for this status change..."
            className="rounded-xl border-slate-200 min-h-[100px] font-medium focus-visible:ring-primary/20"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <p className="text-[10px] text-muted-foreground font-semibold italic">
            * These remarks will be visible in the status history log.
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
