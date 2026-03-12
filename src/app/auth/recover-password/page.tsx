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
import { Label } from "@/src/app/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function RecoverPassword() {
  const router = useRouter();
  const { forgotPassword, verifyCode, resetPassword } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);

    try {
      await forgotPassword(data);
      toast.success("If an account exists, a reset code has been sent.");
      setStep(2);
    } catch (error: any) {
      toast.error(error.message || "Failed to send code");
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("code", code);

    try {
      await verifyCode(data);
      toast.success("Code verified! Set your new password.");
      setStep(3);
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired code");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    try {
      await resetPassword(data);
      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    }
  };

  return (
    <BaseLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
               <button 
                onClick={() => step > 1 ? setStep(step - 1) : router.push("/auth/login")}
                className="text-muted-foreground hover:text-primary transition-colors"
               >
                  <ArrowLeft size={18} />
               </button>
            </div>
            <CardTitle>Recover Password</CardTitle>
            <CardDescription>
              {step === 1 && "Enter your email to receive a reset code"}
              {step === 2 && "Enter the 6-digit code sent to " + email}
              {step === 3 && "Create a secure new password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Send OTP</Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input 
                    id="code" 
                    type="text" 
                    placeholder="123456" 
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="text-center text-2xl font-bold tracking-[0.2em]"
                  />
                </div>
                <Button type="submit" className="w-full">Verify Code</Button>
                <button 
                  type="button"
                  onClick={handleSendCode}
                  className="w-full text-sm text-primary hover:underline"
                >
                  Resend Code
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Reset Password</Button>
              </form>
            )}

            <p className="text-sm text-center text-muted-foreground mt-4">
              <a href="/auth/login" className="text-primary hover:underline">
                Back to login
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
