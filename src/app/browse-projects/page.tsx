'use client'
import React, { useState, useEffect } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { ProjectCard } from "@/src/app/components/projects/ProjectCard";
import { Input } from "@/src/app/components/ui/input";
import { Button } from "@/src/app/components/ui/button";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ShieldAlert,
  X,
} from "lucide-react";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher } from "@/src/helpers/fetcher";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/app/components/ui/dialog";
import { Label } from "@/src/app/components/ui/label";
import { Badge } from "@/src/app/components/ui/badge";

export default function BrowseProjectsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [tempFilters, setTempFilters] = useState<any>({
    category: "",
    budgetType: "",
    experienceLevel: "",
    minBudget: "",
    maxBudget: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<any>({
    category: "",
    budgetType: "",
    experienceLevel: "",
    minBudget: "",
    maxBudget: "",
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
    status: "OPEN",
    search: debouncedSearch,
    ...(appliedFilters.category && { category: appliedFilters.category }),
    ...(appliedFilters.budgetType && { budgetType: appliedFilters.budgetType }),
    ...(appliedFilters.experienceLevel && {
      experienceLevel: appliedFilters.experienceLevel,
    }),
    ...(appliedFilters.minBudget && { minBudget: appliedFilters.minBudget }),
    ...(appliedFilters.maxBudget && { maxBudget: appliedFilters.maxBudget }),
  }).toString();

  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/projects?${queryParams}`,
    baseFetcher,
  );

  const projects = data?.data || [];

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    const clearState = {
      category: "",
      budgetType: "",
      experienceLevel: "",
      minBudget: "",
      maxBudget: "",
    };
    setTempFilters(clearState);
    setAppliedFilters(clearState);
    setSearch("");
  };

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-foreground/90">
            Find your next{" "}
            <span className="text-primary italic">Dream Project</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Browse through active opportunities and apply to those that match
            your expertise.
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
              placeholder="Search by title, skills, or description..."
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
                  Apply Filters
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
                    Refine Projects
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Category
                    </Label>
                    <select
                      className="w-full h-12 rounded-xl border border-muted-foreground/10 bg-muted/20 px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={tempFilters.category}
                      onChange={(e) =>
                        setTempFilters({ ...tempFilters, category: e.target.value })
                      }
                    >
                      <option value="">All Categories</option>
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

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Experience Level
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["ENTRY", "INTERMEDIATE", "EXPERT"].map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant={
                            tempFilters.experienceLevel === level
                              ? "default"
                              : "outline"
                          }
                          className="rounded-xl h-10 text-[10px] font-black"
                          onClick={() =>
                            setTempFilters({
                              ...tempFilters,
                              experienceLevel:
                                tempFilters.experienceLevel === level ? "" : level,
                            })
                          }
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Budget Type
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["FIXED", "HOURLY"].map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={
                            tempFilters.budgetType === type ? "default" : "outline"
                          }
                          className="rounded-xl h-12 font-bold"
                          onClick={() =>
                            setTempFilters({
                              ...tempFilters,
                              budgetType:
                                tempFilters.budgetType === type ? "" : type,
                            })
                          }
                        >
                          {type === "FIXED" ? "Fixed Price" : "Hourly Rate"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Budget Range (रू)
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="h-12 rounded-xl"
                        value={tempFilters.minBudget}
                        onChange={(e) =>
                          setTempFilters({ ...tempFilters, minBudget: e.target.value })
                        }
                      />
                      <span className="font-bold text-muted-foreground">
                        to
                      </span>
                      <Input
                        type="number"
                        placeholder="Max"
                        className="h-12 rounded-xl"
                        value={tempFilters.maxBudget}
                        onChange={(e) =>
                          setTempFilters({ ...tempFilters, maxBudget: e.target.value })
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
                    Show Results
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
            {isLoading ? "Searching..." : `Showing ${projects.length} Results`}
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
            <p className="text-red-600 font-black text-2xl mb-2">
              Synchronizing failed
            </p>
            <p className="text-slate-500 font-medium px-10">
              We couldn't connect to the project repository. Please ensure your
              connection is stable and try again.
            </p>
            <Button
              className="mt-8 px-10 rounded-2xl font-bold shadow-lg shadow-primary/20"
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 bg-muted/10 rounded-[40px] border border-dashed border-muted-foreground/20 max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
              <Search size={40} className="text-primary/40" />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">
              No matching projects
            </h3>
            <p className="text-muted-foreground mb-10 font-bold max-w-md mx-auto">
              Your current filters didn't return any results. Try broadening
              your criteria or searching for something else.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl px-10 h-14 font-black border-primary/20"
              onClick={handleClearFilters}
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <div
                key={project.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
