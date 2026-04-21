"use client";

import React from "react";
import Link from "next/link";
import { MoveLeft, HelpCircle, Home } from "lucide-react";
import { Button } from "@/src/app/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="relative mb-8">
        <div className="text-[12rem] font-black text-slate-200 select-none tracking-tighter">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 rotate-6">
            <HelpCircle size={64} className="text-secondary" />
          </div>
        </div>
      </div>


      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Lost in the <span className="text-primary italic">Workspace?</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed px-4">
          The page you are looking for doesn't exist or has been moved to a different coordinate.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto h-14 rounded-2xl px-8 font-bold gap-2 border-slate-200"
          >
            <MoveLeft size={18} /> Go Back
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full h-14 rounded-2xl px-10 font-bold gap-2 shadow-xl shadow-primary/20">
              <Home size={18} /> Return Home
            </Button>
          </Link>
        </div>
      </div>
      
      <footer className="mt-20">
         <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">
           Worklynk Ecosystem • 404 Error
         </p>
      </footer>
    </div>
  );
}
