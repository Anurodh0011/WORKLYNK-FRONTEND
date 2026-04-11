"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/src/app/components/ui/card";
import { 
  Database, 
  Search, 
  Filter, 
  Monitor, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  User as UserIcon,
  ChevronRight,
  Clock,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Input } from "@/src/app/components/ui/input";
import { Button } from "@/src/app/components/ui/button";
import { baseFetcher } from "@/src/helpers/fetcher";
import { API_BASE_URL } from "@/src/helpers/config";
import { formatDistanceToNow } from "date-fns";

export default function ActivityLogContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: logsData, isLoading, error } = useSWR(
    `${API_BASE_URL}/admin/activity-logs?page=${page}&limit=20`,
    baseFetcher
  );

  const logs = logsData?.data?.logs || [];
  const pagination = logsData?.data?.pagination;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CRITICAL": return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
      case "ALERT": return "bg-orange-600";
      case "WARNING": return "bg-orange-400";
      case "SUCCESS": return "bg-green-500";
      default: return "bg-blue-500";
    }
  };

  const getDeviceIcon = (deviceInfo: string) => {
    const info = deviceInfo?.toLowerCase() || "";
    if (info.includes("mobi") || info.includes("iphone") || info.includes("android")) {
      return <Smartphone size={14} />;
    }
    return <Monitor size={14} />;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-2xl"><Database className="text-primary fill-primary/20" size={32} /></div>
             Activity Intelligence
          </h1>
          <p className="text-slate-500 font-bold mt-1 pl-14 text-sm">Real-time audit trail of all administrative operations Across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs..." 
              className="pl-12 pr-6 h-14 w-[300px] rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-primary/10 transition-all font-bold"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview (Simulated based on real data if needed, or kept static for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-slate-900 rounded-[2rem] overflow-hidden text-white">
          <CardContent className="p-8 space-y-4">
             <div className="flex items-center justify-between">
                <div className="p-3 bg-white/10 rounded-xl text-white"><ShieldCheck size={24} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Integrity</span>
             </div>
             <div>
                <h3 className="text-3xl font-black">{pagination?.total || 0}</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Total administrative trace records</p>
             </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 space-y-4">
             <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Globe size={24} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Tracing</span>
             </div>
             <div>
                <h3 className="text-3xl font-black text-slate-800">Operational</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Logging engine is healthy and active</p>
             </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 space-y-4">
             <div className="flex items-center justify-between">
                <div className="p-3 bg-red-50 rounded-xl text-red-600"><Clock size={24} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Retention</span>
             </div>
             <div>
                <h3 className="text-3xl font-black text-slate-800">90 Days</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Automatic archival schedule active</p>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Log Table */}
      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 bg-slate-50/50 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black text-slate-800 tracking-tight text-2xl">Operation Log</CardTitle>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live feed of administrative footprint</p>
          </div>
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl px-6">
            Export Audit CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Decrypting logs...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-red-500">
               <AlertCircle size={40} />
               <p className="text-sm font-bold uppercase tracking-widest">Failed to retrieve records</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-slate-300">
               <Database size={40} />
               <p className="text-sm font-bold uppercase tracking-widest">No activity records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin / Identity</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Detail</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Intelligence</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Commit Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                              <UserIcon size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800 tracking-tight">{log.admin?.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate w-32">{log.admin?.email}</p>
                            </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${getStatusColor(log.status)}`} />
                              <p className="text-sm font-black text-slate-800">{log.event}</p>
                            </div>
                            {log.targetId && (
                              <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
                                Target: <span className="text-slate-600 font-black">{log.targetType} ({log.targetId.split('-')[0]}...)</span>
                              </p>
                            )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-700">
                              {getDeviceIcon(log.deviceInfo)}
                              <p className="text-xs font-black tracking-tight truncate w-32" title={log.deviceInfo}>{log.deviceInfo || "Unidentified Device"}</p>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
                              <Globe size={10} /> {log.ipAddress || log.location || "Internal Request"}
                            </p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end">
                            <p className="text-xs font-black text-slate-800">{formatDistanceToNow(new Date(log.createdAt))} ago</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(log.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="p-8 bg-slate-50/30 border-t flex items-center justify-between">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               Page {page} of {pagination?.totalPages || 1}
             </p>
             <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className="rounded-xl border-2 font-black text-[10px] uppercase tracking-widest px-6"
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  disabled={page >= (pagination?.totalPages || 1)} 
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-xl border-2 font-black text-[10px] uppercase tracking-widest px-6"
                >
                  Next
                </Button>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
