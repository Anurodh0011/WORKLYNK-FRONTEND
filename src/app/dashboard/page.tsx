"use client";

import React from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useUser } from "@/src/hooks/useUser";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { useRouter } from "next/navigation";
import { Users, Briefcase, Plus, Settings, MessageSquare, Heart } from "lucide-react";

export default function UserDashboard() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">You are logged in as a <span className="text-primary font-medium">{user.role}</span></p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2">
              <Plus size={18} />
              {user.role === "CLIENT" ? "Post a Project" : "Build Profile"}
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings size={18} />
              Settings
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                   {user.role === "CLIENT" ? <Briefcase size={24} /> : <MessageSquare size={24} />}
                </div>
                <div>
                   <p className="text-sm font-medium text-muted-foreground uppercase">Active {user.role === "CLIENT" ? "Projects" : "Applications"}</p>
                   <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-secondary/5 border-secondary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-full text-secondary-foreground">
                   {user.role === "CLIENT" ? <Users size={24} /> : <Heart size={24} />}
                </div>
                <div>
                   <p className="text-sm font-medium text-muted-foreground uppercase">{user.role === "CLIENT" ? "Proposals" : "Saved Projects"}</p>
                   <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full text-green-700">
                   <p className="text-xl font-bold">रू</p>
                </div>
                <div>
                   <p className="text-sm font-medium text-muted-foreground uppercase">{user.role === "CLIENT" ? "Total Spent" : "Total Earned"}</p>
                   <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                 <p className="text-muted-foreground italic">No recent activity to show.</p>
                 <Button variant="link" onClick={() => router.push(user.role === "CLIENT" ? "/browse-freelancers" : "/browse-projects")}>
                    {user.role === "CLIENT" ? "Start by browsing freelancers" : "Start by browsing projects"}
                 </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-center py-10">
                 <p className="text-muted-foreground italic">Complete your profile to get personalized recommendations.</p>
                 <Button variant="link">Complete Profile</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
}
