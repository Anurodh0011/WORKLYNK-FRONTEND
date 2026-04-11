"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { Card, CardContent } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Badge } from "@/src/app/components/ui/badge";
import { formatImageUrl } from "@/src/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/app/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL, BACKEND_URL } from "@/src/helpers/config";
import AdminTable from "@/src/app/components/admin/AdminTable";

export default function VerificationList() {
  const { user, isLoading }: any = useAuthContext();
  const router = useRouter();
  
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "ADMIN") {
        router.push("/");
      } else {
        fetchProfiles();
      }
    }
  }, [user, isLoading, filter, router]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const query = filter !== "ALL" ? `?status=${filter}` : "";
      const res = await fetch(`${API_BASE_URL}/profile/all${query}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setProfiles(data.data.profiles || []);
      }
    } catch (error) {
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (profileId: string, status: "VERIFIED" | "REJECTED") => {
    if (status === "REJECTED" && !rejectReason) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/profile/admin-verify/${profileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          status, 
          rejectionReason: status === "REJECTED" ? rejectReason : null 
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Profile has been ${status.toLowerCase()}`);
        setRejectId(null);
        setRejectReason("");
        setProfiles(prev => prev.map(p => p.id === profileId ? data.data.profile : p));
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const columns = [
    {
      header: "User Details",
      accessor: (profile: any) => (
        <div className="flex items-center gap-4">
          {profile.profilePicture ? (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10 shadow-sm ring-2 ring-white">
              <img src={formatImageUrl(profile.profilePicture)} alt="Pic" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center font-black border-2 border-primary/10 ring-2 ring-white">
              {profile.user?.name?.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-black text-slate-800">{profile.user?.name}</div>
            <div className="text-xs text-slate-500 font-semibold">{profile.user?.email}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mt-0.5">{profile.user?.phoneNumber || "No Phone"}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (profile: any) => (
        <Badge variant="outline" className="rounded-lg font-bold border-slate-200 bg-slate-50/50">{profile.user?.role}</Badge>
      ),
    },
    {
      header: "Status",
      accessor: (profile: any) => (
        <Badge 
          className={`rounded-lg font-bold shadow-sm ${
            profile.verificationStatus === "VERIFIED" ? "bg-green-100 text-green-700 hover:bg-green-100" :
            profile.verificationStatus === "PENDING" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : 
            profile.verificationStatus === "REJECTED" ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"
          }`}
        >
          {profile.verificationStatus}
        </Badge>
      ),
    },
    {
      header: "Document",
      accessor: (profile: any) => (
        <Badge variant="secondary" className="rounded-lg font-bold bg-slate-100 text-slate-600 border-none">{profile.documentType || "N/A"}</Badge>
      ),
    },
    {
      header: "Number",
      accessor: (profile: any) => (
        <span className="font-mono text-xs font-bold text-slate-600 whitespace-nowrap">{profile.panVatNumber || "-"}</span>
      ),
    },
    {
      header: "Image",
      accessor: (profile: any) => (
        profile.documentImage ? (
          <a href={formatImageUrl(profile.documentImage)} target="_blank" rel="noreferrer" className="inline-flex items-center text-primary font-bold hover:underline text-xs bg-primary/5 px-2 py-1 rounded-md">
            View Image
          </a>
        ) : (
          <span className="text-muted-foreground text-xs font-medium italic">No Document</span>
        )
      ),
    },
    {
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      accessor: (profile: any) => (
        profile.verificationStatus === "PENDING" && (
          <div className="flex items-center justify-end gap-2">
            {rejectId === profile.id ? (
              <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                <Input 
                  size={1} 
                  className="w-40 h-9 text-xs rounded-xl font-medium border-red-200 focus-visible:ring-red-100 shadow-sm" 
                  placeholder="Reason..." 
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)} 
                />
                <Button size="sm" variant="destructive" className="rounded-lg font-bold shadow-md shadow-red-100" onClick={() => handleVerify(profile.id, "REJECTED")}>Confirm</Button>
                <Button size="sm" variant="ghost" className="rounded-lg font-bold px-2" onClick={() => { setRejectId(null); setRejectReason(""); }}>Cancel</Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" className="rounded-xl font-bold bg-green-600 hover:bg-green-700 shadow-md shadow-green-100 px-4" onClick={() => handleVerify(profile.id, "VERIFIED")}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl font-bold border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 px-4" onClick={() => setRejectId(profile.id)}>
                  Reject
                </Button>
              </div>
            )}
          </div>
        )
      ),
    },
  ];

  if (isLoading || loading) return <div className="flex justify-center items-center min-h-[400px] text-primary font-bold animate-pulse">Loading verification requests...</div>;
  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Identity Verifications</h1>
          <p className="text-muted-foreground font-medium mt-1">Review PAN/VAT verification requests from platform users.</p>
        </div>
        <div className="w-48 shadow-sm">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="rounded-xl font-bold bg-white">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Profiles</SelectItem>
              <SelectItem value="PENDING">Pending Review</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="UNVERIFIED">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <AdminTable 
            columns={columns} 
            data={profiles} 
            isLoading={loading}
            emptyMessage="No profiles found matching the selected filter."
          />
        </CardContent>
      </Card>
    </div>
  );
}
