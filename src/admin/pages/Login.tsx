"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Label } from "@/src/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/app/components/ui/card";
import { toast } from "sonner";
import { loginSchema } from "@/src/utils/zod/auth.schema";
import { Spinner } from "@/src/app/components/ui/spinner";

export default function AdminLogin() {
  const router = useRouter();
  const { login, isLoading: isAuthLoading }: any = useAuthContext();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // 1. Zod Validation
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

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result: any = await login(formData);
      
      if (result.success) {
        if (result.user?.role === "ADMIN") {
            toast.success("Login successful! Welcome to the Admin Panel.");
            router.push("/admin/dashboard");
        } else {
            toast.error("Access denied: You do not have administrator privileges.");
            // Optionally log them out if your context doesn't handle restricted roles automatically
        }
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred during authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-xl bg-white/80 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@worklynk.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`transition-all ${errors.email ? "border-red-500 focus:ring-red-500/20" : "focus:ring-primary/20"}`}
              />
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={errors.password ? "text-red-500" : ""}>Password</Label>
                <a
                  href="/admin/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`transition-all ${errors.password ? "border-red-500 focus:ring-red-500/20" : "focus:ring-primary/20"}`}
              />
              {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>
            <Button
              type="submit"
              className="w-full font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
              disabled={isSubmitting || isAuthLoading}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
