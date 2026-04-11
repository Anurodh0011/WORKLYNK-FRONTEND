"use client";

import React, { useState, useEffect } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { Card, CardHeader, CardContent } from "@/src/app/components/ui/card";
import { Badge } from "@/src/app/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "@/src/helpers/config";
import { Camera, CheckCircle, Clock, ShieldCheck, MapPin, Briefcase, GraduationCap, Award, Globe, CheckCircle2, Star, MessageSquare } from "lucide-react";
import useSWR from "swr";
import { baseFetcher } from "@/src/helpers/fetcher";
import { formatImageUrl } from "@/src/lib/utils";

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

// Removed local getImageUrl in favor of global utility

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id;
  const router = useRouter();
  
  const { data, error, isLoading } = useSWR(`${API_BASE_URL}/profile/public/${userId}`, baseFetcher);

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
  if (error || !data?.data?.profile) return <div className="flex justify-center items-center min-h-screen text-xl font-bold text-muted-foreground">Profile not found</div>;

  const profile = data.data.profile;
  const user = profile.user;
  const isFreelancer = user.role === "FREELANCER";
  
  const platformPortfolio = isFreelancer ? user.contractsAsFreelancer : user.contractsAsClient;

  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-secondary/20 flex items-center justify-center overflow-hidden border-4 border-background shadow-lg mb-4">
                   {profile?.profilePicture ? (
                     <img src={formatImageUrl(profile.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <Camera size={40} className="text-muted-foreground" />
                   )}
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-foreground/70 tracking-widest font-bold mb-4">{user.role}</p>

                {profile.averageRating > 0 && (
                  <div className="flex flex-col items-center mb-6">
                    <span className="text-3xl font-black text-slate-800">{profile.averageRating}</span>
                    <StarRating rating={Math.round(profile.averageRating)} />
                    <span className="text-xs text-muted-foreground mt-1">({user.reviewsReceived?.length} reviews)</span>
                  </div>
                )}
                
                <div className="w-full flex items-center justify-center p-2 rounded-md bg-muted/50 border">
                  {profile?.verificationStatus === "VERIFIED" ? (
                    <><CheckCircle size={18} className="text-green-500 mr-2" /> <span className="text-sm font-medium">Verified Identity</span></>
                  ) : (
                    <><ShieldCheck size={18} className="text-muted-foreground mr-2" /> <span className="text-sm font-medium">Unverified</span></>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4 border-b">
                <div>
                  <h2 className="text-3xl font-black text-slate-800">{user.name}</h2>
                  {profile?.headline && <p className="text-xl text-primary font-bold mt-1">{profile.headline}</p>}
                  {profile?.hourlyRate && isFreelancer && <p className="text-sm font-bold mt-2 text-slate-500 bg-slate-100 px-3 py-1 rounded-full inline-block">Hourly Rate: रू{profile.hourlyRate}/hr</p>}
                </div>
              </CardHeader>
              
              {profile?.description && (
                <CardContent className="pt-6 border-b">
                  <h3 className="font-bold text-lg mb-2">About</h3>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{profile.description}</p>
                </CardContent>
              )}
              
              {profile?.skills && profile.skills.length > 0 && (
                <CardContent className="pt-6 border-b">
                  <h3 className="font-bold text-lg mb-3">Core Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1 text-xs">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              )}
              
              {profile?.experience && profile.experience.length > 0 && (
                <CardContent className="pt-6 border-b">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Briefcase size={18} className="text-primary" /> Experience</h3>
                    <div className="space-y-6">
                      {profile.experience.map((exp: any, i: number) => (
                        <div key={i} className="relative pl-6 before:absolute before:left-[7px] before:top-2 before:bottom-[-24px] before:w-[2px] before:bg-slate-200 last:before:hidden">
                          <div className="absolute left-0 top-1.5 w-[16px] h-[16px] rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="w-[8px] h-[8px] rounded-full bg-primary"></div>
                          </div>
                          <h4 className="font-bold text-slate-800">{exp.role}</h4>
                          <p className="text-sm font-semibold text-primary">{exp.company}</p>
                          <p className="text-xs font-bold text-slate-400 mt-0.5">{exp.duration}</p>
                          {exp.description && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                </CardContent>
              )}
              
              {profile?.education && profile.education.length > 0 && (
                <CardContent className="pt-6 border-b">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><GraduationCap size={18} className="text-primary" /> Education</h3>
                    <div className="space-y-4">
                      {profile.education.map((edu: any, i: number) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <h4 className="font-bold text-slate-800">{edu.institution}</h4>
                          <p className="text-sm font-medium text-slate-600">{edu.degree}</p>
                          <p className="text-xs font-bold text-primary mt-1">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                </CardContent>
              )}
              
              {profile?.certifications && profile.certifications.length > 0 && (
                <CardContent className="pt-6 border-b">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Award size={18} className="text-primary" /> Certifications</h3>
                    <div className="space-y-4">
                      {profile.certifications.map((cert: any, i: number) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <h4 className="font-bold text-slate-800">{cert.name}</h4>
                          <p className="text-sm font-medium text-slate-600">{cert.issuer}</p>
                          <p className="text-xs font-bold text-primary mt-1 mb-2">{cert.year}</p>
                          {cert.link && <a href={cert.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-500 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full">View Credential</a>}
                        </div>
                      ))}
                    </div>
                </CardContent>
              )}
              
              {profile?.portfolio && profile.portfolio.length > 0 && (
                <CardContent className="pt-6 border-b">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Globe size={18} className="text-primary" /> External Portfolio</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.portfolio.map((port: any, i: number) => (
                        <div key={i} className="border border-slate-200 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="font-bold text-slate-800">{port.title}</h4>
                          {port.link && <a href={port.link} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 hover:underline break-all mt-2 inline-block bg-blue-50 px-2 py-1 rounded-md">{port.link}</a>}
                        </div>
                      ))}
                    </div>
                </CardContent>
              )}

              {/* Platform Portfolio (Projects they have completed) */}
              {platformPortfolio?.length > 0 && (
                <CardContent className="pt-6 border-b">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-primary"><Briefcase size={18} /> Platform Work History</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {platformPortfolio.map((port: any, i: number) => (
                        <div key={i} className="border p-5 rounded-2xl bg-primary/5 border-primary/20 flex flex-col justify-between">
                          <h4 className="font-bold text-slate-800 leading-snug">{port.project?.title || "Private Project"}</h4>
                          <div className="mt-4">
                            <Badge className="bg-green-500 hover:bg-green-600 gap-1 rounded-full px-3 py-1"><CheckCircle2 size={12}/> Completed</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                </CardContent>
              )}

              {/* Reviews Section */}
              <CardContent className="pt-6 bg-slate-50/50 rounded-b-xl">
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
                         ({user.reviewsReceived?.length} {user.reviewsReceived?.length === 1 ? 'rating' : 'ratings'})
                       </span>
                     </div>
                   )}
                 </div>
                 
                 {user.reviewsReceived && user.reviewsReceived.length > 0 ? (
                   <div className="space-y-6">
                     {user.reviewsReceived.map((review: any) => (
                       <div key={review.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                         <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                                {review.reviewer?.profile?.profilePicture ? (
                                  <img src={formatImageUrl(review.reviewer.profile.profilePicture)} className="w-full h-full object-cover" alt={review.reviewer.name} />
                                ) : (
                                  <Camera size={16} className="text-slate-400" />
                                )}
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-800 text-sm">{review.reviewer?.name || "Anonymous User"}</h5>
                                <p className="text-[10px] uppercase font-bold text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <StarRating rating={review.rating} />
                         </div>
                         <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-4 py-1">"{review.comment}"</p>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
                      <p className="text-muted-foreground font-medium">No reviews yet.</p>
                   </div>
                 )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
