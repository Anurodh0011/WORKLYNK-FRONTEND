"use client";

import React, { Suspense } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectCreateForm from "@/src/app/components/projects/ProjectCreateForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/app/components/ui/card";

function ProjectWizardContent() {
  const { user, isLoading }: any = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== "CLIENT") {
    // Only clients can post projects
    router.push(user ? "/dashboard" : "/auth/login");
    return null;
  }

  return (
    <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Project Wizard</CardTitle>
        <CardDescription>
          Complete the steps below to post your project or save it as a draft.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectCreateForm projectId={id || undefined} />
      </CardContent>
    </Card>
  );
}

export default function NewProjectPage() {
  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            Post a <span className="text-primary italic">Project</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect with the best freelancers for your next big idea.
          </p>
        </div>

        <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
          <ProjectWizardContent />
        </Suspense>
      </div>
    </BaseLayout>
  );
}
