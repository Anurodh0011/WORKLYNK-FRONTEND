"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import BaseLayout from "@/src/app/components/base-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Label } from "@/src/app/components/ui/label";
import { toast } from "sonner";
import { loginSchema } from "@/src/utils/zod/auth.schema";
import { Spinner } from "@/src/app/components/ui/spinner"; 

export default function Login() {
  const router = useRouter();
  const { login, isLoading: isAuthLoading } = useAuthContext();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // 1. Client-side Zod Validation
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result: any = await login(formData);
      
      if (result.success) {
        toast.success("Login successful!");
        
        // Redirect based on role
        if (result.user?.role === "ADMIN") {
            router.push("/admin/dashboard");
        } else {
            router.push("/");
        }
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="/auth/recover-password" title="Recover your password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || isAuthLoading}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
            <p className="text-sm text-center text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <a href="/auth/register" className="text-primary font-semibold hover:underline">
                Register here
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
