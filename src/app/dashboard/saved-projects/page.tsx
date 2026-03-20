"use client";

import React from "react";
import BaseLayout from "@/src/app/components/base-layout";
import useSWR from "swr";
import { API_BASE_URL } from "@/src/helpers/config";
import { baseFetcher } from "@/src/helpers/fetcher";
import { ProjectCard } from "@/src/app/components/projects/ProjectCard";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/src/app/components/ui/button";
import { useRouter } from "next/navigation";

export default function SavedProjectsPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSWR(`${API_BASE_URL}/bookmarks/projects`, baseFetcher);

  const savedProjects = data?.data || [];

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <Heart className="text-primary" size={32} />
              Saved Projects
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Manage your bookmarked projects and prepare your applications.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="text-primary animate-spin" size={40} />
            <p className="text-muted-foreground font-bold animate-pulse">Loading saved projects...</p>
          </div>
        ) : savedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {savedProjects.map((saved: any) => (
              <ProjectCard 
                key={saved.id} 
                project={{
                  ...saved.project,
                  isBookmarked: true
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-card/50 backdrop-blur-md rounded-3xl p-20 border-2 border-dashed flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Heart size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No saved projects yet</h2>
            <p className="text-muted-foreground max-w-sm mb-8 font-medium">
              Start browsing and save projects you're interested in applying for.
            </p>
            <Button 
                onClick={() => router.push("/browse-projects")}
                className="h-12 px-8 rounded-xl font-bold shadow-xl shadow-primary/20"
            >
              Browse Projects
            </Button>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
