"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { API_BASE_URL } from "@/src/helpers/config";
import { mutationFetcher } from "@/src/helpers/fetcher";
import useSWRMutation from "swr/mutation";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");

  const { trigger: verifyOtp, isMutating: isVerifying } = useSWRMutation(
    `${API_BASE_URL}/auth/otp/verify`,
    mutationFetcher
  );

  const { trigger: resendOtp, isMutating: isResending } = useSWRMutation(
    `${API_BASE_URL}/auth/otp/resend`,
    mutationFetcher
  );

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await verifyOtp({ email, code });
      if (result.success) {
        toast.success("Email verified! You can now login.");
        router.push("/auth/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP code");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email });
      toast.success("New OTP sent to your email.");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>Enter the 6-digit code sent to {email || "your email"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input 
              id="code" 
              placeholder="123456" 
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required 
              className="text-center text-2xl tracking-[0.5em] font-bold"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isVerifying}>
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
        <div className="text-center">
          <Button 
            variant="link" 
            onClick={handleResend} 
            disabled={isResending || !email}
          >
            {isResending ? "Sending..." : "Didn't receive code? Resend"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyOtp() {
  return (
    <BaseLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
          <VerifyOtpContent />
        </Suspense>
      </div>
    </BaseLayout>
  );
}
