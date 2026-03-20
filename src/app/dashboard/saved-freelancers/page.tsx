"use client";

import React from "react";
import BaseLayout from "@/src/app/components/base-layout";
import useSWR from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher, mutationFetcher } from "@/src/helpers/fetcher";
import { User, MapPin, Star, Trash2, ExternalLink, Heart, Loader2 } from "lucide-react";
import { Button } from "@/src/app/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/src/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/app/components/ui/card";
import { toast } from "sonner";

export default function SavedFreelancersPage() {
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR(`${API_BASE_URL}/bookmarks/freelancers`, baseFetcher);

  const savedFreelancers = data?.data || [];

  const handleRemove = async (freelancerId: string) => {
    try {
      const response = await mutationFetcher(`${API_BASE_URL}/bookmarks/freelancers/${freelancerId}/toggle`, {
        arg: {}
      });
      if (response.success) {
        toast.success("Freelancer removed from saved list");
        mutate();
      }
    } catch (error) {
      toast.error("Failed to remove freelancer");
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <User className="text-primary" size={32} />
              Saved Talents
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Keep track of top professionals you'd like to hire for future projects.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="text-primary animate-spin" size={40} />
            <p className="text-muted-foreground font-bold animate-pulse">Loading saved talents...</p>
          </div>
        ) : savedFreelancers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {savedFreelancers.map((saved: any) => (
              <Card key={saved.id} className="group border-none shadow-md bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col h-full relative">
                <Button 
                   variant="ghost" 
                   size="icon" 
                   className="absolute top-4 right-4 z-10 rounded-full h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-50/50 transition-colors"
                   onClick={() => handleRemove(saved.freelancer.id)}
                >
                  <Trash2 size={18} />
                </Button>

                <CardHeader className="pb-4 text-center items-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl border border-primary/20 mb-4 group-hover:scale-105 transition-transform">
                     {saved.freelancer.name.charAt(0).toUpperCase()}
                  </div>
                  <CardTitle className="text-xl font-bold">{saved.freelancer.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold text-sm">
                    {saved.freelancer.profile?.headline || "Freelancer"}
                  </CardDescription>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-lg">
                       <Star className="w-3 h-3 fill-current" />
                       <span>4.9</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-4">
                  <div className="flex justify-center items-center gap-2 text-xs font-medium text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Nepal</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 text-center font-medium">
                    {saved.freelancer.profile?.description || "No description provided."}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {saved.freelancer.profile?.skills?.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="bg-secondary/10 text-secondary-foreground border-secondary/20 text-[10px] py-0.5">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-6 mt-auto border-t border-muted/50">
                    <div className="flex flex-col">
                       <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Rate</span>
                       <span className="font-extrabold text-lg text-primary">रू {saved.freelancer.profile?.hourlyRate || "0"}/hr</span>
                    </div>
                    <Button 
                        size="sm" 
                        variant="default" 
                        className="h-10 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 group/btn"
                        onClick={() => router.push(`/freelancer/${saved.freelancer.id}`)}
                    >
                       View Profile <ExternalLink size={14} className="ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-card/50 backdrop-blur-md rounded-3xl p-20 border-2 border-dashed flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Heart size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No saved talents yet</h2>
            <p className="text-muted-foreground max-w-sm mb-8 font-medium">
              Find amazing professionals and save them to your talent pool.
            </p>
            <Button 
                onClick={() => router.push("/browse-freelancers")}
                className="h-12 px-8 rounded-xl font-bold shadow-xl shadow-primary/20"
            >
              Browse Talents
            </Button>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
