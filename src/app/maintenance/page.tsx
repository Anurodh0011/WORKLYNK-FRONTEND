"use client";

import React from "react";
import { Hammer, Cog, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/app/components/ui/button";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 flex items-center justify-center">
          <div className="relative scale-150">
             <Hammer className="text-primary animate-bounce" size={40} />
             <div className="absolute -bottom-1 -right-1 bg-amber-400 p-1 rounded-full border-4 border-white">
                <Cog className="text-white animate-spin-slow" size={12} />
             </div>
          </div>
        </div>
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
        Under Maintenance
      </h1>
      <p className="text-slate-500 font-bold max-w-lg mb-10 leading-relaxed">
        Our digital workspace is currently undergoing essential upgrades to provide you with a smoother, faster, and more secure experience.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
        <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <Clock className="text-blue-600" />
          </div>
          <h3 className="font-black text-slate-800 mb-2">Estimated Time</h3>
          <p className="text-sm font-bold text-slate-400">We should be back online within 2-4 hours. Thank you for your patience.</p>
        </div>
        <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
            <Hammer className="text-amber-600" />
          </div>
          <h3 className="font-black text-slate-800 mb-2">What's New?</h3>
          <p className="text-sm font-bold text-slate-400">Better project flow, faster application processing, and improved UI.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="mailto:support@worklynk.com">
          <Button variant="outline" className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200 hover:bg-slate-100 transition-all">
            Contact Support
          </Button>
        </Link>
        <Link href="https://status.worklynk.com" target="_blank">
          <Button className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
            Status Page <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <footer className="mt-20">
         <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
           &copy; {new Date().getFullYear()} WorkLynk Technologies
         </p>
      </footer>
    </div>
  );
}
