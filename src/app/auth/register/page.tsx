"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { cn } from "@/src/lib/utils";
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/src/app/components/ui/radio-group";
import { Label } from "@/src/app/components/ui/label";
import { toast } from "sonner";
import { registerSchema } from "@/src/utils/zod/auth.schema";
import { Spinner } from "@/src/app/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react"; 

export default function Register() {
  const router = useRouter();
  const { register, isLoading: isAuthLoading } = useAuthContext();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "FREELANCER"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error for the field being typed
    if (errors[e.target.id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[e.target.id];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // 1. Zod Validation
    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // 2. Prepare Multi-part/Form Data
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const result: any = await register(data);
      if (result.success) {
        toast.success("Registration successful! Please verify your email.");
        router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        // Handle backend validation errors if any
        if (result.errors) {
            setErrors(result.errors);
        }
        toast.error(result.message || "Registration failed");
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
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">Sign up as a client or freelancer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                  id="phoneNumber" 
                  type="tel" 
                  placeholder="+977 98XXXXXXXX" 
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password}
                    onChange={handleChange}
                    className={cn(errors.password ? "border-red-500" : "", "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={cn(errors.confirmPassword ? "border-red-500" : "", "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  >
                   {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
              <div className="space-y-3 pt-2">
                <Label className="text-sm font-semibold">Account Type</Label>
                <RadioGroup 
                  defaultValue="FREELANCER" 
                  onValueChange={(val) => setFormData({...formData, role: val})}
                  className="grid grid-cols-1 gap-2"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="CLIENT" id="client" />
                    <Label
                      htmlFor="client"
                      className="font-normal cursor-pointer flex-1"
                    >
                      <div className="font-medium">Client</div>
                      <div className="text-xs text-muted-foreground text-wrap">I want to hire freelancers</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="FREELANCER" id="freelancer" />
                    <Label
                      htmlFor="freelancer"
                      className="font-normal cursor-pointer flex-1"
                    >
                      <div className="font-medium">Freelancer</div>
                      <div className="text-xs text-muted-foreground text-wrap">I want to find work</div>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isSubmitting || isAuthLoading}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            <div className="text-sm text-center text-muted-foreground mt-4">
              Already have an account?{" "}
              <a href="/auth/login" className="text-primary font-semibold hover:underline">
                Login here
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
