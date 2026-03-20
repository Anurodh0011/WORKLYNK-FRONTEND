"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Users, Star, ShieldCheck, Zap, Globe, Github } from "lucide-react";
import BaseLayout from "./components/base-layout";
import { Button } from "./components/ui/button";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { useRouter } from "next/navigation";
import { Badge } from "./components/ui/badge";

export default function Home() {
  const { user, isLoading }: any = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-muted-foreground font-bold animate-pulse tracking-widest uppercase text-xs">Preparing Experience</p>
        </div>
     );
  }

  return (
    <BaseLayout>
      <div className="relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
           <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-secondary/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          {/* Hero Section */}
          <div className="text-center mb-24 max-w-4xl mx-auto animate-in fade-in slide-in-from-top-8 duration-1000">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary font-bold tracking-tight text-sm">
               🚀 The Future of Freelancing in Nepal
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
              Scale Your <span className="text-primary italic">Vision</span> with Top Talent
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              The premier ecosystem connecting Nepal's brightest professionals with industry-leading projects. 
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button asChild size="lg" className="h-16 px-10 rounded-2xl font-bold text-xl shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 group">
                <Link href="/auth/register" className="flex items-center gap-2">
                  Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-2xl font-bold text-xl bg-background/50 backdrop-blur-md border-primary/10 hover:border-primary/30 transition-all hover:scale-105 active:scale-95">
                <Link href="/browse-projects">Explore Projects</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-20 pt-12 border-t border-muted/20 flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               <TrustBadge icon={<ShieldCheck className="w-5 h-5" />} text="Verified Experts" />
               <TrustBadge icon={<Globe className="w-5 h-5" />} text="Global Standards" />
               <TrustBadge icon={<Zap className="w-5 h-5" />} text="Fast Delivery" />
            </div>
          </div>

          {/* Role Selection Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <RoleCard 
               role="FOR CLIENTS"
               title="Build your dream team"
               description="Post your projects and receive competitive proposals from vetted experts across Nepal. Manage everything in one sleek interface."
               icon={<Briefcase size={32} />}
               link="/browse-freelancers"
               buttonText="Find Experts"
               color="primary"
            />
            <RoleCard 
               role="FOR FREELANCERS"
               title="Accelerate your career"
               description="Discover high-impact projects that match your specialized skill set. Bid with confidence and build long-term relationships."
               icon={<Users size={32} />}
               link="/browse-projects"
               buttonText="Explore Gigs"
               color="secondary"
            />
          </div>

          {/* Social Proof Section (Small) */}
          <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] p-12 border border-white/10 text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Github size={120} />
             </div>
             <h2 className="text-3xl font-bold mb-4">Empowering 1,000+ Teams</h2>
             <p className="text-muted-foreground font-medium mb-8 max-w-xl mx-auto italic">
                "Worklynk changed how we hire in Nepal. The quality of professionals is unmatched compared to local platforms."
             </p>
             <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                   <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span className="ml-2 font-bold text-sm tracking-widest uppercase opacity-70">Top Rated 2026</span>
             </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

function RoleCard({ role, title, description, icon, link, buttonText, color }: any) {
  const isPrimary = color === "primary";
  
  return (
    <div className={`p-10 rounded-[2.5rem] border transition-all duration-500 group overflow-hidden relative ${isPrimary ? "bg-primary/5 hover:bg-primary/10 border-primary/10 hover:border-primary/20" : "bg-card/40 hover:bg-card/60 border-muted/50 hover:border-primary/20 shadow-xl shadow-black/5"}`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500 ${isPrimary ? "bg-primary text-white shadow-xl shadow-primary/30" : "bg-secondary text-secondary-foreground"}`}>
         {icon}
      </div>
      <Badge variant="outline" className="mb-4 text-[10px] font-black tracking-[0.2em]">{role}</Badge>
      <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">{title}</h2>
      <p className="text-muted-foreground mb-10 leading-relaxed font-medium">
        {description}
      </p>
      <Button asChild variant={isPrimary ? "default" : "outline"} className="h-12 px-8 rounded-xl font-bold group/btn">
        <Link href={link} className="flex items-center gap-2">
          {buttonText} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </Button>
    </div>
  );
}

function TrustBadge({ icon, text }: any) {
   return (
      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-[0.15em]">
         <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
         </div>
         {text}
      </div>
   );
}
