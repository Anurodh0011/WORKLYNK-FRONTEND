"use client";

import React, { useState, useEffect } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Badge } from "@/src/app/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/app/components/ui/table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "@/src/helpers/config";

export default function AdminVerificationsPage() {
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
  }, [user, isLoading, filter]);

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

  if (isLoading || loading) return <div className="flex justify-center items-center min-h-screen">Loading admin panel...</div>;
  if (!user || user.role !== "ADMIN") return null;

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Identity Verifications</h1>
            <p className="text-muted-foreground mt-1">Review PAN/VAT verification requests from users.</p>
          </div>
          <div className="w-45">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Profiles</SelectItem>
                <SelectItem value="PENDING">Pending Review</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="UNVERIFIED">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>PAN/VAT Number</TableHead>
                  <TableHead>Document Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No profiles found matching the selected filter.
                    </TableCell>
                  </TableRow>
                ) : profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                       {profile.profilePicture ? (
                         <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                           <img src={profile.profilePicture} alt="Pic" className="w-full h-full object-cover" />
                         </div>
                       ) : (
                         <div className="w-10 h-10 rounded-full bg-secondary/20 flex-shrink-0"></div>
                       )}
                       <div>
                         <div>{profile.user?.name}</div>
                         <div className="text-xs text-muted-foreground">{profile.user?.email}</div>
                         <div className="text-xs text-muted-foreground">{profile.user?.phoneNumber || "No Phone"}</div>
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{profile.user?.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          profile.verificationStatus === "VERIFIED" ? "default" :
                          profile.verificationStatus === "PENDING" ? "secondary" : 
                          profile.verificationStatus === "REJECTED" ? "destructive" : "outline"
                        }
                      >
                        {profile.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{profile.documentType || "N/A"}</Badge></TableCell>
                    <TableCell>{profile.panVatNumber || "-"}</TableCell>
                    <TableCell>
                      {profile.documentImage ? (
                        <a href={profile.documentImage} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">View Image</a>
                      ) : (
                        <span className="text-muted-foreground text-sm">No Document</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {profile.verificationStatus === "PENDING" && (
                        <div className="flex items-center justify-end gap-2">
                          {rejectId === profile.id ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                size={1} 
                                className="w-40 h-8 text-sm" 
                                placeholder="Reason..." 
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)} 
                              />
                              <Button size="sm" variant="destructive" onClick={() => handleVerify(profile.id, "REJECTED")}>Confirm</Button>
                              <Button size="sm" variant="outline" onClick={() => { setRejectId(null); setRejectReason(""); }}>Cancel</Button>
                            </div>
                          ) : (
                            <>
                              <Button size="sm" variant="default" onClick={() => handleVerify(profile.id, "VERIFIED")}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-500" onClick={() => setRejectId(profile.id)}>
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
