"use client";

import React from "react";
import useSWR from "swr";
import AdminDialog from "./AdminDialog";
import { baseFetcher } from "@/src/helpers/fetcher";
import { API_BASE_URL } from "@/src/helpers/config";
import { Calendar, History, MessageSquare, ShieldCheck, User } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/src/app/components/ui/button";

interface StatusHistoryDialogProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function StatusHistoryDialog({
  user,
  isOpen,
  onClose,
}: StatusHistoryDialogProps) {
  const { data, isLoading } = useSWR(
    isOpen ? `${API_BASE_URL}/admin/users/${user.id}/status-history` : null,
    baseFetcher
  );

  const history = data?.data?.history || [];

  return (
    <AdminDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Status Change History"
      description={`Viewing all account status audit logs for ${user?.name}.`}
      className="max-w-xl sm:rounded-3xl"
    >
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-3 py-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-2xl"></div>
            ))}
          </div>
        ) : history.length > 0 ? (
          <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {history.map((item: any, i: number) => {
              const dateObj = new Date(item.createdAt);
              return (
                <div key={item.id} className="relative transition-all hover:scale-[1.01]">
                  <div className={`absolute -left-[23px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                    item.status === 'ACTIVE' ? 'bg-green-500' :
                    item.status === 'SUSPENDED' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {i === 0 && <ShieldCheck size={10} className="text-white" />}
                  </div>
                  
                  <div className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase ${
                         item.status === 'ACTIVE' ? 'bg-green-50 text-green-700' :
                         item.status === 'SUSPENDED' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                       }`}>
                         {item.status}
                       </span>
                       <div className="flex items-center text-[10px] font-bold text-slate-400">
                         <Calendar size={12} className="mr-1" />
                         {format(dateObj, "MMM d, yyyy • h:mm a")}
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start bg-slate-50 rounded-xl p-2.5">
                        <MessageSquare size={14} className="text-slate-400 mr-2 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-600 font-medium leading-relaxed italic italic">
                          "{item.remarks || "No remarks provided"}"
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-end text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        <User size={10} className="mr-1" /> 
                        Admin ID: {item.changedById?.slice(-6) || "System"}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed text-center">
            <History size={48} className="mb-4 opacity-20" />
            <p className="font-bold text-slate-500">No account history found</p>
            <p className="text-xs font-medium">Initial registration is the current status.</p>
          </div>
        )}
      </div>
      
      <div className="pt-6 flex justify-center">
        <Button 
          variant="outline" 
          className="rounded-xl font-bold w-full max-w-[200px] border-slate-200" 
          onClick={onClose}
        >
          Close History
        </Button>
      </div>
    </AdminDialog>
  );
}
