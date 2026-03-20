"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Heart, CheckCircle2, Clock, Briefcase, MapPin, IndianRupee, Search, FileText, Calendar, Star, MoreVertical } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/src/helpers/config";
import { mutationFetcher } from "@/src/helpers/fetcher";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    budgetType: string;
    budgetMin: number | null;
    budgetMax: number | null;
    skillsRequired: string[];
    experienceLevel: string;
    duration: string;
    createdAt: string;
    client: {
      name: string;
      profile?: {
        profilePicture?: string;
      }
    };
    _count: {
      applications: number;
    };
    isBookmarked?: boolean;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const [isBookmarked, setIsBookmarked] = React.useState(project.isBookmarked || false);
  const [isToggling, setIsToggling] = React.useState(false);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToggling(true);
    try {
      const response = await mutationFetcher(`${API_BASE_URL}/bookmarks/projects/${project.id}/toggle`, {
        arg: {}
      });
      if (response.success) {
        setIsBookmarked(response.data.bookmarked);
      }
    } catch (error) {
      // Quietly fail or toast
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-none shadow-md bg-card/60 backdrop-blur-sm overflow-hidden flex flex-col h-full relative">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
           <Button
             variant="ghost"
             size="icon"
             className={`rounded-full h-10 w-10 bg-background/20 backdrop-blur-md transition-all ${isBookmarked ? "text-red-500 bg-red-50/80 shadow-lg shadow-red-500/20" : "text-white hover:bg-background/40"}`}
             onClick={(e) => {
               e.stopPropagation();
               toggleBookmark(e);
             }}
             disabled={isToggling}
           >
             <Heart size={18} className={isBookmarked ? "fill-current" : ""} />
           </Button>
        </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground border-secondary/20 uppercase text-[10px] font-bold tracking-wider">
            {project.category}
          </Badge>
          <span className="text-xs text-muted-foreground mr-10 flex items-center gap-1">
            <Clock size={12} /> {timeAgo(project.createdAt)}
          </span>
        </div>
        <Link href={`/projects/${project.id}`}>
          <h3 className="text-xl font-bold mt-2 group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.skillsRequired.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="outline" className="text-[10px] py-0 font-medium">
              {skill}
            </Badge>
          ))}
          {project.skillsRequired.length > 4 && (
            <span className="text-[10px] text-muted-foreground">+{project.skillsRequired.length - 4} more</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-xs font-semibold py-3 border-y border-muted/50">
          <div className="flex items-center gap-2">
            <IndianRupee size={14} className="text-primary" />
            <span>
              {project.budgetType === "FIXED" 
                ? `रू ${project.budgetMin} - रू ${project.budgetMax}` 
                : `रू ${project.budgetMin}/hr`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-primary" />
            <span>{project.experienceLevel}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border">
            {project.client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-bold leading-none">{project.client.name}</p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <CheckCircle2 size={10} className="text-green-500" /> Payment Verified
            </p>
          </div>
        </div>
        <div className="text-right">
          <Link href={`/projects/${project.id}`}>
            <Button size="sm" className="h-8 px-4 rounded-full shadow-lg shadow-primary/20">
              Details
            </Button>
          </Link>
          <p className="text-[10px] text-muted-foreground mt-1">
            {project._count.applications} Proposals
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
