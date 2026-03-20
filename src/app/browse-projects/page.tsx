"use client";

import React, { useState } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { ProjectCard } from "@/src/app/components/projects/ProjectCard";
import { Input } from "@/src/app/components/ui/input";
import { Button } from "@/src/app/components/ui/button";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import useSWR from "use-swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher } from "@/src/helpers/fetcher";

export default function BrowseProjectsPage() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/projects?status=OPEN&search=${search}`,
    baseFetcher
  );

  const projects = data?.data || [];

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-foreground/90">
            Find your next <span className="text-primary italic underline underline-offset-8">Dream Project</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse through thousands of open projects and apply to those that match your skills.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 sticky top-20 z-40 bg-background/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by project title, skills, or description..."
              className="pl-10 h-12 rounded-xl border-muted-foreground/20 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 px-6 gap-2 rounded-xl border-muted-foreground/20">
            <Filter size={20} />
            Categories
          </Button>
          <Button className="h-12 px-8 gap-2 rounded-xl shadow-lg shadow-primary/20">
            <SlidersHorizontal size={20} />
            More Filters
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[400px] bg-muted/40 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/20 max-w-2xl mx-auto">
            <p className="text-destructive font-bold text-xl mb-2">Error loading projects</p>
            <p className="text-muted-foreground">Please make sure the backend server is running and try again.</p>
            <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-muted-foreground/20 max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters to find what you are looking for.</p>
            <Button variant="secondary" onClick={() => setSearch("")}>Clear Search</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <div key={project.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
