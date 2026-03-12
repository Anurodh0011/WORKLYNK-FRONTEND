"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
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

export default function Register() {
  const router = useRouter();
  const { register, isRegistering } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "FREELANCER"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("confirmPassword", formData.confirmPassword);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("role", formData.role);

    try {
      const result = await register(data);
      if (result.success) {
        toast.success("Registration successful! Please verify your email.");
        router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Sign up as a client or freelancer</CardDescription>
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
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input 
                  id="phoneNumber" 
                  type="tel" 
                  placeholder="+977 98XXXXXXXX" 
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-3">
                <Label>Account Type</Label>
                <RadioGroup 
                  defaultValue="FREELANCER" 
                  onValueChange={(val) => setFormData({...formData, role: val})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CLIENT" id="client" />
                    <Label
                      htmlFor="client"
                      className="font-normal cursor-pointer"
                    >
                      I&apos;m a Client (Looking for freelancers)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FREELANCER" id="freelancer" />
                    <Label
                      htmlFor="freelancer"
                      className="font-normal cursor-pointer"
                    >
                      I&apos;m a Freelancer (Looking for projects)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full" disabled={isRegistering}>
                {isRegistering ? "Creating account..." : "Register"}
              </Button>
            </form>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <a href="/auth/login" className="text-primary hover:underline">
                Login here
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
