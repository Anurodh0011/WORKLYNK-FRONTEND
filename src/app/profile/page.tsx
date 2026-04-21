"use client";

import React, { useState, useEffect } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Textarea } from "@/src/app/components/ui/textarea";
import { Label } from "@/src/app/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "@/src/helpers/config";
import { Camera, CheckCircle, XCircle, Clock, ShieldCheck, MapPin, Briefcase, GraduationCap, Award, Globe, Edit3, CheckCircle2, Star, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs";
import { Badge } from "@/src/app/components/ui/badge";
import { Suspense } from "react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating
              ? "fill-yellow-500 text-yellow-500"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

const getImageUrl = (path: string, baseUrl: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = baseUrl.replace("/api", "");
  return `${base}/${path.replace(/\\/g, "/")}`;
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading profile components...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const { user, isLoading, fetchUser }: any = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingBasic, setSavingBasic] = useState(false);
  const [submittingVerification, setSubmittingVerification] = useState(false);

  const [basicData, setBasicData] = useState({
    profilePicture: "",
    description: "",
    phoneNumber: "",
    name: "",
  });

  const [verifyData, setVerifyData] = useState({
    panVatNumber: "",
    documentType: "PAN",
    documentImage: "",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    } else if (user) {
      fetchProfile();
      
      const tab = searchParams.get("tab");
      if (tab === "settings") {
        setActiveTab("settings");
      }
    }
  }, [user, isLoading, searchParams, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/profile`, { credentials: "include" });
      const data = await res.json();
      if (data.success && data.data?.profile) {
        setProfile(data.data.profile);
        setBasicData({
          profilePicture: data.data.profile.profilePicture || "",
          description: data.data.profile.description || "",
          phoneNumber: data.data.profile.user?.phoneNumber || "",
          name: data.data.profile.user?.name || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!basicData.name || basicData.name.trim() === "") {
      toast.error("Display name cannot be empty");
      return;
    }

    try {
      setSavingBasic(true);
      const formData = new FormData();
      formData.append("description", basicData.description);
      formData.append("phoneNumber", basicData.phoneNumber);
      formData.append("name", basicData.name);
      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully");
        setProfile(data.data.profile);
        await fetchUser();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSavingBasic(false);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyData.panVatNumber) {
      toast.error("PAN/VAT number is required");
      return;
    }

    try {
      setSubmittingVerification(true);
      const formData = new FormData();
      formData.append("panVatNumber", verifyData.panVatNumber);
      formData.append("documentType", verifyData.documentType);
      if (documentFile) {
        formData.append("documentImage", documentFile);
      }

      const res = await fetch(`${API_BASE_URL}/profile/verify`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Verification submitted");
        setProfile(data.data.profile);
        setVerifyData({ panVatNumber: "", documentType: "PAN", documentImage: "" });
        setDocumentFile(null);
        await fetchUser();
      } else {
        toast.error(data.message || "Failed to submit verification");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmittingVerification(false);
    }
  };

  if (isLoading || loading) return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
  if (!user) return null;

  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account profile and verification details.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-secondary/20 flex items-center justify-center overflow-hidden border-4 border-background shadow-lg mb-4">
                   {profilePictureFile ? (
                     <img src={URL.createObjectURL(profilePictureFile)} alt="Profile Preview" className="w-full h-full object-cover" />
                   ) : profile?.profilePicture ? (
                     <img src={getImageUrl(profile.profilePicture, API_BASE_URL)} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <Camera size={40} className="text-muted-foreground" />
                   )}
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground mb-1">{user.role}</p>
                {profile?.averageRating > 0 && (
                  <div className="flex flex-col items-center mb-4">
                    <StarRating rating={Math.round(profile.averageRating)} />
                    <span className="text-xs font-semibold text-slate-500 mt-1">{profile.averageRating} ({profile.user?.reviewsReceived?.length || 0} reviews)</span>
                  </div>
                )}
                <div className="w-full text-sm space-y-2 mb-4 text-center">
                  <p><strong>Email:</strong> {user.email || "Not provided"}</p>
                  <p><strong>Phone:</strong> {user.phoneNumber || "Not provided"}</p>
                </div>
                
                <div className="w-full flex items-center justify-center p-2 rounded-md bg-muted/50 border">
                  {profile?.verificationStatus === "VERIFIED" && <><CheckCircle size={18} className="text-green-500 mr-2" /> <span className="text-sm font-medium">Verified Account</span></>}
                  {profile?.verificationStatus === "PENDING" && <><Clock size={18} className="text-yellow-500 mr-2" /> <span className="text-sm font-medium">Review Pending</span></>}
                  {profile?.verificationStatus === "REJECTED" && <><XCircle size={18} className="text-red-500 mr-2" /> <span className="text-sm font-medium">Verification Rejected</span></>}
                  {(!profile || profile.verificationStatus === "UNVERIFIED") && <><ShieldCheck size={18} className="text-muted-foreground mr-2" /> <span className="text-sm font-medium">Unverified Account</span></>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="profile">{user.role === "FREELANCER" ? "Public Profile" : "My Project History"}</TabsTrigger>
                  <TabsTrigger value="settings">Settings & Verification</TabsTrigger>
                </TabsList>
                {user.role === "FREELANCER" && (
                  <Button variant="outline" size="sm" onClick={() => router.push("/profile/freelancer")} className="gap-2">
                    <Edit3 size={16} /> Edit Public Profile
                  </Button>
                )}
              </div>

              {/* PUBLIC PROFILE TAB for Freelancers and Clients */}
              <TabsContent value="profile" className="space-y-6 mt-0">
                <Card>
                  <CardHeader className="pb-4 border-b">
                      <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        {profile?.headline && <p className="text-lg text-muted-foreground mt-1">{profile.headline}</p>}
                        {profile?.hourlyRate && <p className="text-sm font-medium mt-2 text-primary">Hourly Rate: रू{profile.hourlyRate}/hr</p>}
                      </div>
                    </CardHeader>
                    {profile?.description && (
                      <CardContent className="pt-6 border-b">
                        <h3 className="font-semibold mb-2">About</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{profile.description}</p>
                      </CardContent>
                    )}
                    {profile?.skills && profile.skills.length > 0 && (
                      <CardContent className="pt-6 border-b">
                        <h3 className="font-semibold mb-3">Core Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    )}
                    {profile?.experience && profile.experience.length > 0 && (
                      <CardContent className="pt-6 border-b">
                         <h3 className="font-semibold mb-4 flex items-center gap-2"><Briefcase size={18} /> Experience</h3>
                         <div className="space-y-6">
                           {profile.experience.map((exp: any, i: number) => (
                             <div key={i} className="relative pl-6 before:absolute before:left-[7px] before:top-2 before:bottom-[-24px] before:w-[2px] before:bg-slate-200 last:before:hidden">
                               <div className="absolute left-0 top-1.5 w-[16px] h-[16px] rounded-full bg-primary/20 flex items-center justify-center">
                                 <div className="w-[8px] h-[8px] rounded-full bg-primary"></div>
                               </div>
                               <h4 className="font-semibold">{exp.role}</h4>
                               <p className="text-sm text-foreground/80">{exp.company}</p>
                               <p className="text-xs text-muted-foreground mt-0.5">{exp.duration}</p>
                               {exp.description && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>}
                             </div>
                           ))}
                         </div>
                      </CardContent>
                    )}
                    {profile?.education && profile.education.length > 0 && (
                      <CardContent className="pt-6 border-b">
                         <h3 className="font-semibold mb-4 flex items-center gap-2"><GraduationCap size={18} /> Education</h3>
                         <div className="space-y-4">
                           {profile.education.map((edu: any, i: number) => (
                             <div key={i}>
                               <h4 className="font-semibold">{edu.institution}</h4>
                               <p className="text-sm">{edu.degree}</p>
                               <p className="text-xs text-muted-foreground">{edu.year}</p>
                             </div>
                           ))}
                         </div>
                      </CardContent>
                    )}
                    {profile?.certifications && profile.certifications.length > 0 && (
                      <CardContent className="pt-6 border-b">
                         <h3 className="font-semibold mb-4 flex items-center gap-2"><Award size={18} /> Certifications</h3>
                         <div className="space-y-4">
                           {profile.certifications.map((cert: any, i: number) => (
                             <div key={i}>
                               <h4 className="font-semibold">{cert.name}</h4>
                               <p className="text-sm">{cert.issuer}</p>
                               <p className="text-xs text-muted-foreground">{cert.year}</p>
                               {cert.link && <a href={cert.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">View Credential</a>}
                             </div>
                           ))}
                         </div>
                      </CardContent>
                    )}
                    {profile?.portfolio && profile.portfolio.length > 0 && (
                      <CardContent className="pt-6 border-b">
                         <h3 className="font-semibold mb-4 flex items-center gap-2"><Globe size={18} /> External Portfolio</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {profile.portfolio.map((port: any, i: number) => (
                             <div key={i} className="border p-4 rounded-lg bg-slate-50">
                               <h4 className="font-semibold text-primary">{port.title}</h4>
                               {port.link && <a href={port.link} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline break-all mt-1 inline-block">{port.link}</a>}
                             </div>
                           ))}
                         </div>
                      </CardContent>
                    )}

                    {/* Platform Portfolio (Clients and Freelancers) */}
                    {(profile?.user?.contractsAsFreelancer?.length > 0 || profile?.user?.contractsAsClient?.length > 0) && (
                      <CardContent className="pt-6">
                         <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary"><Briefcase size={18} /> Platform Portfolio</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {(user.role === "FREELANCER" ? profile.user.contractsAsFreelancer : profile.user.contractsAsClient).map((port: any, i: number) => (
                             <div key={i} className="border p-4 rounded-lg bg-primary/5 border-primary/20 flex flex-col justify-between">
                               <h4 className="font-semibold text-slate-800">{port.project?.title || "Project"}</h4>
                               <div className="mt-3">
                                 {port.status === "ACTIVE" 
                                    ? <Badge className="bg-blue-500 hover:bg-blue-600 gap-1"><Clock size={12}/> Ongoing</Badge> 
                                    : <Badge className="bg-green-500 hover:bg-green-600 gap-1"><CheckCircle2 size={12}/> Completed</Badge>}
                               </div>
                             </div>
                           ))}
                         </div>
                      </CardContent>
                    )}

                    {/* Reviews Section */}
                    <CardContent className="pt-6 border-b bg-slate-50/50 rounded-b-xl">
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                         <h3 className="font-black text-xl flex items-center gap-2 text-slate-800">
                           <Star size={20} className="text-primary" /> 
                           Rating and Review
                         </h3>
                         {profile?.averageRating > 0 && (
                           <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                             <span className="font-black text-slate-800">{profile.averageRating}</span>
                             <StarRating rating={Math.round(profile.averageRating)} />
                             <span className="text-xs font-semibold text-slate-500">
                               ({profile.user?.reviewsReceived?.length} {profile.user?.reviewsReceived?.length === 1 ? 'rating' : 'ratings'})
                             </span>
                           </div>
                         )}
                       </div>
                       {profile?.user?.reviewsReceived && profile.user.reviewsReceived.length > 0 ? (
                         <div className="space-y-4">
                           {profile.user.reviewsReceived.map((review: any) => (
                             <div key={review.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                               <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                                      {review.reviewer?.profile?.profilePicture ? (
                                        <img src={getImageUrl(review.reviewer.profile.profilePicture, API_BASE_URL)} className="w-full h-full object-cover" alt={review.reviewer.name} />
                                      ) : (
                                        <Camera size={14} className="text-slate-400" />
                                      )}
                                    </div>
                                    <div>
                                      <h5 className="font-semibold text-slate-800 text-sm">{review.reviewer?.name || "User"}</h5>
                                      <p className="text-[10px] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <StarRating rating={review.rating} />
                               </div>
                               {review.comment && <p className="text-sm text-slate-600 mt-2 italic">"{review.comment}"</p>}
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="text-center py-6 bg-white rounded-xl border border-dashed border-slate-300">
                            <p className="text-muted-foreground font-medium text-sm">No ratings or reviews yet.</p>
                         </div>
                       )}
                    </CardContent>
                  </Card>
                </TabsContent>

              {/* SETTINGS TAB */}
              <TabsContent value="settings" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update your public profile information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateBasic} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="profilePicture">Profile Picture (Upload)</Label>
                        <Input 
                          id="profilePicture" 
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                toast.error("Profile picture must be less than 2MB");
                                e.target.value = "";
                                return;
                              }
                              setProfilePictureFile(file);
                            }
                          }}
                        />
                        {profilePictureFile ? (
                          <p className="text-xs text-primary font-medium">Selected: {profilePictureFile.name}</p>
                        ) : basicData.profilePicture ? (
                          <p className="text-xs text-muted-foreground font-medium truncate max-w-sm">Current image saved</p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input 
                          id="name" 
                          placeholder="Your Name" 
                          value={basicData.name}
                          onChange={(e) => setBasicData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">About You</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Tell clients about your skills and experience..." 
                          className="min-h-[120px]"
                          value={basicData.description}
                          onChange={(e) => setBasicData(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input 
                          id="phoneNumber" 
                          placeholder="+977-9800000000" 
                          value={basicData.phoneNumber}
                          onChange={(e) => setBasicData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        />
                      </div>
                      <Button type="submit" disabled={savingBasic}>
                        {savingBasic ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <ShieldCheck size={20} /> Identity Verification
                    </CardTitle>
                    <CardDescription>
                      Verify your identity by providing a valid PAN or VAT number. This increases trust with {user.role === "CLIENT" ? "freelancers" : "clients"}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Status Logic */}
                    {profile?.verificationStatus === "VERIFIED" ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800 flex items-start gap-3">
                        <CheckCircle className="mt-0.5 flex-shrink-0" size={20} />
                        <div>
                          <h4 className="font-semibold">Your identity is verified</h4>
                          <p className="text-sm mt-1">PAN/VAT: {profile.panVatNumber}</p>
                        </div>
                      </div>
                    ) : profile?.verificationStatus === "PENDING" ? (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 flex items-start gap-3">
                        <Clock className="mt-0.5 flex-shrink-0" size={20} />
                        <div>
                          <h4 className="font-semibold">Verification link submitted</h4>
                          <p className="text-sm mt-1">Your documents are currently under review by our admin team. This usually takes 1-2 business days.</p>
                          <p className="text-sm mt-1 font-mono">Submitted {profile.documentType}: {profile.panVatNumber}</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitVerification} className="space-y-4">
                        {profile?.verificationStatus === "REJECTED" && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 flex items-start gap-3 mb-4">
                            <XCircle className="mt-0.5 flex-shrink-0" size={20} />
                            <div>
                              <h4 className="font-semibold">Verification Rejected</h4>
                              <p className="text-sm mt-1">Reason: {profile.rejectionReason || "No reason provided."}</p>
                              <p className="text-sm mt-1">Please update your documents and try again.</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="panVatNumber">PAN / VAT Number</Label>
                            <Input 
                              id="panVatNumber" 
                              required 
                              placeholder="e.g. 123456789" 
                              value={verifyData.panVatNumber}
                              onChange={(e) => setVerifyData(prev => ({ ...prev, panVatNumber: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="documentType">Document Type</Label>
                            <select 
                              id="documentType"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={verifyData.documentType}
                              onChange={(e) => setVerifyData(prev => ({ ...prev, documentType: e.target.value }))}
                            >
                              <option value="PAN">PAN</option>
                              <option value="VAT">VAT</option>
                            </select>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="documentImage">Upload Document (Image)</Label>
                            <Input 
                              id="documentImage" 
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  setDocumentFile(e.target.files[0]);
                                }
                              }}
                            />
                            {documentFile && <p className="text-xs text-primary font-medium">Selected: {documentFile.name}</p>}
                          </div>
                        </div>
                        <Button type="submit" variant="default" disabled={submittingVerification}>
                          {submittingVerification ? "Submitting..." : "Submit for Verification"}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
