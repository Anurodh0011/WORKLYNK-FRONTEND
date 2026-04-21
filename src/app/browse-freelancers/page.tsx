"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Star, Filter, Heart, User, CheckCircle2, Loader2, ExternalLink, X, SlidersHorizontal, ShieldAlert } from "lucide-react";
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
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher, mutationFetcher } from "@/src/helpers/fetcher";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { toast } from "sonner";
import { Input } from "@/src/components";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/src/app/components/ui/dialog";
import { Label } from "@/src/app/components/ui/label";

export default function BrowseFreelancers() {
  const { user }: any = useAuthContext();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [tempFilters, setTempFilters] = useState<any>({
    category: "",
    minHourlyRate: "",
    maxHourlyRate: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<any>({
    category: "",
    minHourlyRate: "",
    maxHourlyRate: "",
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync temp filters with applied filters when dialog opens
  useEffect(() => {
    if (isFilterOpen) {
      setTempFilters(appliedFilters);
    }
  }, [isFilterOpen, appliedFilters]);

  const queryParams = new URLSearchParams({
    search: debouncedSearch,
    ...(appliedFilters.category && { category: appliedFilters.category }),
    ...(appliedFilters.minHourlyRate && { minHourlyRate: appliedFilters.minHourlyRate }),
    ...(appliedFilters.maxHourlyRate && { maxHourlyRate: appliedFilters.maxHourlyRate }),
  }).toString();

  const { data, isLoading, error, mutate } = useSWR(`${API_BASE_URL}/freelancer?${queryParams}`, baseFetcher);
  const { data: savedData, mutate: mutateSaved } = useSWR(user?.role === "CLIENT" ? `${API_BASE_URL}/bookmarks/freelancers` : null, baseFetcher);

  const freelancers = data?.data || [];
  const savedFreelancers = savedData?.data?.map((item: any) => item.freelancerId) || [];

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    const clearState = {
      category: "",
      minHourlyRate: "",
      maxHourlyRate: "",
    };
    setTempFilters(clearState);
    setAppliedFilters(clearState);
    setSearch("");
  };

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  const toggleSave = async (freelancerId: string) => {
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
        mutateSaved();
      }
    } catch (error) {
      toast.error("Failed to update saved list.");
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-foreground/90">
                Browse <span className="text-primary italic">Top Talents</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                Discover and connect with elite-level professionals from across Nepal.
            </p>
        </div>
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 sticky top-20 z-40 bg-background/80 backdrop-blur-md p-4 rounded-3xl shadow-xl border">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              placeholder="Search by name, headline, or skills..."
              className="pl-12 h-14 rounded-2xl border-muted-foreground/10 focus:ring-primary/20 text-md font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button className="h-14 px-8 gap-3 rounded-2xl shadow-xl shadow-primary/20 font-bold group relative">
                  <SlidersHorizontal
                    size={20}
                    className="group-hover:rotate-180 transition-transform duration-500"
                  />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-white text-primary h-5 w-5 p-0 flex items-center justify-center rounded-full"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-3xl p-8 border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Filter className="text-primary" size={24} />
                    Refine Freelancers
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-6">
                  {/* Category / Skills */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Main Specialty
                    </Label>
                    <select
                      className="w-full h-12 rounded-xl border border-muted-foreground/10 bg-muted/20 px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={tempFilters.category}
                      onChange={(e) =>
                        setTempFilters({ ...tempFilters, category: e.target.value })
                      }
                    >
                      <option value="">All Specialties</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Apps">Mobile Apps</option>
                      <option value="Design & Creative">Design & Creative</option>
                      <option value="Writing & Translation">Writing & Translation</option>
                      <option value="Admin & Customer Support">Admin & Customer Support</option>
                      <option value="Marketing & Sales">Marketing & Sales</option>
                      <option value="Data Science & Analysis">Data Science & Analysis</option>
                      <option value="Engineering & Architecture">Engineering & Architecture</option>
                    </select>
                  </div>

                  {/* Hourly Rate Range */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Hourly Rate (रू)
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="h-12 rounded-xl"
                        value={tempFilters.minHourlyRate}
                        onChange={(e) =>
                          setTempFilters({ ...tempFilters, minHourlyRate: e.target.value })
                        }
                      />
                      <span className="font-bold text-muted-foreground">
                        to
                      </span>
                      <Input
                        type="number"
                        placeholder="Max"
                        className="h-12 rounded-xl"
                        value={tempFilters.maxHourlyRate}
                        onChange={(e) =>
                          setTempFilters({ ...tempFilters, maxHourlyRate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-8 flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={handleClearFilters}
                    className="flex-1 font-bold rounded-xl h-12"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="flex-1 font-bold rounded-xl h-12 shadow-lg shadow-primary/20"
                  >
                    Show Talents
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                className="h-14 px-4 text-red-500 hover:bg-red-50 rounded-2xl gap-2 font-bold"
                onClick={handleClearFilters}
              >
                <X size={20} />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            {isLoading ? "Searching..." : `Showing ${freelancers.length} Talents`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-95 bg-card/40 border border-muted-foreground/10 animate-pulse rounded-3xl"
              ></div>
            ))}
          </div>
        ) : error ? (
            <div className="text-center py-24 bg-red-50/50 rounded-[40px] border border-red-100 max-w-2xl mx-auto shadow-sm">
                <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-black text-2xl mb-2">Synchronizing failed</p>
                <p className="text-slate-500 font-medium px-10">We couldn't connect to the freelancer repository. Please try again.</p>
                <Button className="mt-8 px-10 rounded-2xl font-bold shadow-lg shadow-primary/20" onClick={() => mutate()}>Retry</Button>
            </div>
        ) : freelancers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freelancers.map((freelancer: any) => (
              <Card key={freelancer.id} className="group border-none shadow-md bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col h-full relative">
                {user?.role === "CLIENT" && (
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className={`absolute top-4 right-4 rounded-full h-10 w-10 transition-all ${savedFreelancers.includes(freelancer.id) ? "text-red-500 bg-red-50" : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-500 hover:bg-red-50"}`}
                     onClick={(e) => {
                       e.stopPropagation();
                       toggleSave(freelancer.id);
                     }}
                   >
                     <Heart size={18} className={savedFreelancers.includes(freelancer.id) ? "fill-current" : ""} />
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
                    <Button size="sm" className="h-10 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 group/btn" onClick={() => router.push(`/profile/${freelancer.id}`)}>
                       Profile <ExternalLink size={14} className="ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-muted/10 rounded-[40px] border border-dashed border-muted-foreground/20 max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
              <Search size={40} className="text-primary/40" />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">No matching talents</h3>
            <p className="text-muted-foreground mb-10 font-bold max-w-md mx-auto">
              Your current filters didn't return any results. Try broadening your criteria.
            </p>
            <Button variant="outline" size="lg" className="rounded-2xl px-10 h-14 font-black border-primary/20" onClick={handleClearFilters}>
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
