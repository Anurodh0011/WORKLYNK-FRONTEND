"use client";

import React from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/app/components/ui/card";
import { Badge } from "@/src/app/components/ui/badge";
import { Button } from "@/src/app/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Users,
  Briefcase,
  Plus,
  Settings,
  MessageSquare,
  Heart,
  Loader2,
  Search,
  Bookmark,
  ChevronRight,
  FolderOpen
} from "lucide-react";

export default function UserDashboard() {
  const { user, isLoading }: any = useAuthContext();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground font-bold animate-pulse">Synchronizing your workspace...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const isClient = user.role === "CLIENT";

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-2">
            <Badge variant="outline" className="px-3 py-1 rounded-full border-primary/20 text-primary font-bold bg-primary/5 uppercase tracking-wider text-[10px]">
              {user.role} Workspace
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight">
              Namaste, <span className="text-primary">{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xl">
              {isClient 
                ? "Oversee your projects, manage freelancer applications, and grow your team today."
                : "Track your active applications, discover new opportunities, and manage your portfolio."}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="h-14 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 gap-2 group transition-all hover:scale-[1.02]"
              onClick={() => router.push(isClient ? "/projects/new" : "/browse-projects")}
            >
              {isClient ? <Plus size={20} className="group-hover:rotate-90 transition-transform" /> : <Search size={20} />}
              {isClient ? "Post New Project" : "Explore Projects"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 rounded-2xl font-bold text-lg border-primary/10 bg-card/40 backdrop-blur-sm gap-2 hover:bg-card/60 transition-all"
              onClick={() => router.push("/profile")}
            >
              <Settings size={20} />
              Setup
            </Button>
          </div>
        </header>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <StatCard 
            title={isClient ? "Projects Posted" : "Applications"}
            value="12"
            icon={<Briefcase size={24} />}
            color="primary"
            onClick={() => router.push(isClient ? "/dashboard/projects" : "/dashboard/applications")}
          />
          <StatCard 
            title={isClient ? "Saved Talents" : "Saved Projects"}
            value="8"
            icon={isClient ? <Users size={24} /> : <Bookmark size={24} />}
            color="secondary"
            onClick={() => router.push(isClient ? "/dashboard/saved-freelancers" : "/dashboard/saved-projects")}
          />
          <StatCard 
            title={isClient ? "Total Proposals" : "Interviews"}
            value="45"
            icon={<MessageSquare size={24} />}
            color="accent"
          />
          <StatCard 
            title={isClient ? "Total Spent" : "Total Earned"}
            value="रू 24.5k"
            icon={<span className="font-bold text-xl">रू</span>}
            color="success"
          />
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Card className="lg:col-span-2 border-none shadow-xl bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-primary/5 bg-primary/5 px-8 py-6">
              <div>
                <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
                <CardDescription className="font-medium">Your latest interactions and updates</CardDescription>
              </div>
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-xl" onClick={() => router.push(isClient ? "/dashboard/projects" : "/dashboard/applications")}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
               <div className="flex flex-col items-center justify-center py-24 text-center px-8">
                  <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6 border border-primary/10">
                     <FolderOpen size={36} className="text-primary/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Workspace needs action</h3>
                  <p className="text-muted-foreground max-w-sm mb-8 font-medium">
                    {isClient 
                      ? "You haven't posted any projects recently. Start hiring top talent today!"
                      : "You haven't applied to any projects recently. Great opportunities are waiting!"}
                  </p>
                  <Button 
                    className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20"
                    onClick={() => router.push(isClient ? "/projects/new" : "/browse-projects")}
                  >
                    Get Started
                  </Button>
               </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-none shadow-xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-md rounded-3xl overflow-hidden group">
               <CardHeader className="pb-2">
                 <CardTitle className="text-xl font-bold">Recommended {isClient ? "Talent" : "Fix"}</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="bg-background/40 p-6 rounded-2xl border border-white/10 backdrop-blur-lg mb-4">
                     <p className="text-sm font-medium italic opacity-80 mb-4">
                       "Complete your profile to get 3x more visibility and personalized recommendations."
                     </p>
                     <Button 
                        variant="link" 
                        className="p-0 h-auto font-bold text-primary group-hover:translate-x-1 transition-transform"
                        onClick={() => router.push(user.role === "FREELANCER" ? "/profile/freelancer" : "/profile")}
                    >
                        Optimize Portfolio →
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden">
               <CardHeader>
                 <CardTitle className="text-xl font-bold text-secondary-foreground">Help Center</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <HelpItem title="How to hire effectively" />
                  <HelpItem title="Winning proposal tips" />
                  <HelpItem title="Platform security guide" />
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

function StatCard({ title, value, icon, color, onClick }: any) {
  const colorMap: any = {
    primary: "bg-primary text-white shadow-primary/30",
    secondary: "bg-secondary text-secondary-foreground shadow-secondary/20",
    accent: "bg-purple-500 text-white shadow-purple-500/20",
    success: "bg-green-500 text-white shadow-green-500/20"
  };

  return (
    <Card 
      className="border-none shadow-lg bg-card/60 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-3xl overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-5">
           <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 ${colorMap[color] || colorMap.primary}`}>
              {icon}
           </div>
           <div>
              <p className="text-[10px] uppercase font-extrabold tracking-widest text-muted-foreground mb-1">{title}</p>
              <p className="text-2xl font-black">{value}</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HelpItem({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
       <span className="text-sm font-bold group-hover:text-primary transition-colors">{title}</span>
       <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-all" />
    </div>
  );
}
