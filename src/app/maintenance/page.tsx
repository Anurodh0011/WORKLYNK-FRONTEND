"use client";

import React from "react";
import { Hammer, Cog, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/app/components/ui/button";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
        {/* Animated Icons */}
        <div className="flex justify-center items-center gap-4">
          <div className="bg-slate-800 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl animate-bounce-slow">
            <Hammer size={48} className="text-secondary" />
          </div>
          <div className="bg-slate-800 p-8 rounded-full border border-white/10 shadow-2xl animate-spin-slow">
            <Cog size={64} className="text-primary" />
          </div>
          <div className="bg-slate-800 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl animate-bounce-slow delay-300">
            <Clock size={48} className="text-secondary" />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Platform <span className="text-secondary">Upgrade</span> in Progress
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            We're fine-tuning Worklynk to bring you a faster, more secure experience. We'll be back online in a few minutes.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    Status: System Maintenance
                </span>
            </div>
            <Link href="mailto:support@worklynk.com">
                <Button variant="ghost" className="text-white hover:bg-white/10 gap-2 rounded-full font-bold">
                    Contact Support <ArrowRight size={18} />
                </Button>
            </Link>
        </div>

        <div className="pt-12 border-t border-white/5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                © 2026 Worklynk Ecosystem • All services will resume shortly
            </p>
        </div>
      </div>
    </div>
  );
}
