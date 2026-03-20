"use client";

import React, { useState } from "react";
import { Star, MapPin, Search, Loader2, Save, ExternalLink, Filter } from "lucide-react";
import BaseLayout from "../components/base-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import useSWR from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher, mutationFetcher } from "@/src/helpers/fetcher";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { toast } from "sonner";
import { Input } from "@/src/components";

export default function BrowseFreelancers() {
  const { user }: any = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, mutate } = useSWR(`${API_BASE_URL}/freelancer`, baseFetcher);

  const freelancers = data?.data || [];

  const handleToggleSave = async (freelancerId: string) => {
    if (!user || user.role !== "CLIENT") {
      toast.error("Only clients can save freelancers.");
      return;
    }

    try {
      const response = await mutationFetcher(`${API_BASE_URL}/bookmarks/freelancers/${freelancerId}/toggle`, {
        arg: {}
      });
      if (response.success) {
        toast.success(response.message);
        mutate();
      }
    } catch (error) {
      toast.error("Failed to update saved list.");
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Browse Talents</h1>
            <p className="text-lg text-muted-foreground font-medium">
              Discover and connect with top-rated professionals.
            </p>
          </div>
          
          <div className="flex w-full md:w-auto gap-3">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Search by skill or headline..." 
                  className="pl-10 h-12 rounded-xl shadow-sm border-primary/10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button variant="outline" className="h-12 w-12 rounded-xl border-primary/10">
                <Filter size={18} />
             </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-muted-foreground font-bold italic animate-pulse">Finding the best talents...</p>
          </div>
        ) : freelancers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freelancers.filter((f: any) => 
               f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               f.profile?.headline?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((freelancer: any) => (
              <Card key={freelancer.id} className="group border-none shadow-md bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col h-full relative">
                {user?.role === "CLIENT" && (
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="absolute top-4 right-4 z-10 rounded-full h-10 w-10 bg-background/20 backdrop-blur-md text-white hover:bg-background/40"
                     onClick={() => handleToggleSave(freelancer.id)}
                   >
                     <Save size={18} />
                   </Button>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border border-primary/20 group-hover:scale-105 transition-transform">
                       {freelancer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                         <CardTitle className="text-xl font-bold">{freelancer.name}</CardTitle>
                         <CardDescription className="text-primary font-semibold text-sm line-clamp-1">
                            {freelancer.profile?.headline || "Freelancer at Worklynk"}
                         </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-lg">
                       <Star className="w-3 h-3 fill-current" />
                       <span>4.9</span>
                    </div>
                    <span>(120+ reviews)</span>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Nepal</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 font-medium">
                    {freelancer.profile?.description || "No description provided."}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {freelancer.profile?.skills?.slice(0, 5).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="bg-secondary/10 text-secondary-foreground border-secondary/20 text-[10px] py-0.5">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-6 mt-auto border-t border-muted/50">
                    <div className="flex flex-col">
                       <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Hourly Rate</span>
                       <span className="font-extrabold text-lg text-primary">रू {freelancer.profile?.hourlyRate || "0"}/hr</span>
                    </div>
                    <Button size="sm" className="h-10 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 group/btn">
                       Profile <ExternalLink size={14} className="ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-card/50 rounded-3xl border-2 border-dashed border-primary/10">
             <h2 className="text-2xl font-bold text-muted-foreground">No freelancers found.</h2>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
