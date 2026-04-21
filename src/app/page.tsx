"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Users,
  Star,
  ShieldCheck,
  Zap,
  Globe,
  CheckCircle2,
  Code,
  Palette,
  Megaphone,
  Smartphone,
  LineChart,
  Lock,
  Search,
} from "lucide-react";
import BaseLayout from "./components/base-layout";
import { Button } from "./components/ui/button";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { useRouter } from "next/navigation";
import { Badge } from "./components/ui/badge";
import { Card, CardContent } from "./components/ui/card";

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
        <p className="text-muted-foreground font-bold animate-pulse tracking-widest uppercase text-xs">
          Preparing Experience
        </p>
      </div>
    );
  }

  return (
    <BaseLayout>
      <div className="relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-secondary/10 blur-[100px] rounded-full"></div>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <Badge
              variant="outline"
              className="mb-8 px-5 py-2 rounded-full border-primary/20 bg-primary/5 text-primary font-bold tracking-wide text-xs uppercase"
            >
              🇳🇵 The Future of Freelancing in Nepal
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-slate-900">
              Transform Your <span className="text-primary italic">Ideas</span> Into Reality
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Worklynk is the premier marketplace connecting Nepal's elite freelancers with visionary local and global businesses.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button
                asChild
                size="lg"
                className="h-16 px-10 rounded-2xl font-bold text-xl shadow-2xl shadow-primary/30 transition-all hover:translate-y-[-4px] group"
              >
                <Link href="/auth/register" className="flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-16 px-10 rounded-2xl font-bold text-xl bg-white border-slate-200 hover:border-primary/30 hover:bg-slate-50 transition-all hover:translate-y-[-4px]"
              >
                <Link href="/browse-projects">Browse Gigs</Link>
              </Button>
            </div>
            
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-14 opacity-70">
                <TrustBadge icon={<ShieldCheck className="w-4 h-4" />} text="Verified Experts" />
                <TrustBadge icon={<Lock className="w-4 h-4" />} text="Secure Escrow" />
                <TrustBadge icon={<Zap className="w-4 h-4" />} text="Bidding System" />
                <TrustBadge icon={<Users className="w-4 h-4" />} text="24/7 Support" />
            </div>
          </div>

          {/* Core Roles Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-32">
            <div className="group relative p-1 transition-all">
                <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                <RoleCard
                    role="FOR HIRE"
                    title="Hire Top Tier Talent"
                    description="Post your project and receive competitive bids within minutes. Review portfolios, chat directly, and hire the perfect fit for your budget."
                    icon={<Users size={32} />}
                    link="/browse-freelancers"
                    buttonText="Find Talent"
                    features={["Vetted Professionals", "Escrow Protection", "Milestone Tracking"]}
                    color="primary"
                />
            </div>
            <div className="group relative p-1 transition-all">
                <div className="absolute inset-0 bg-secondary/10 rounded-[3rem] rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                <RoleCard
                    role="FOR WORK"
                    title="Find High-Value Projects"
                    description="Access a curated list of projects from established businesses. Bid on jobs that match your expertise and grow your independent career."
                    icon={<Briefcase size={32} />}
                    link="/browse-projects"
                    buttonText="Find Work"
                    features={["Timely Payments", "Diverse Categories", "Reputation Building"]}
                    color="secondary"
                />
            </div>
          </div>

          {/* Popular Categories */}
          <div className="mb-32">
             <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 tracking-tight">Popular Categories</h2>
                <p className="text-slate-500 font-medium">Whatever you need, we have an expert for that.</p>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <CategoryCard icon={<Code />} title="Development" subtitle="Web, App & Software" />
                <CategoryCard icon={<Palette />} title="Design" subtitle="Graphics & UI/UX" />
                <CategoryCard icon={<Megaphone />} title="Marketing" subtitle="Social & SEO" />
                <CategoryCard icon={<LineChart />} title="Business" subtitle="Analysis & HR" />
                <CategoryCard icon={<Smartphone />} title="Mobile Apps" subtitle="iOS & Android" />
                <CategoryCard icon={<Globe />} title="Writing" subtitle="Content & Translation" />
                <CategoryCard icon={<Zap />} title="AI Services" subtitle="Automation & Data" />
                <CategoryCard icon={<CheckCircle2 />} title="Admin Support" subtitle="Virtual Assistant" />
             </div>
          </div>

          {/* How It Works */}
          <div className="mb-32 bg-slate-900 rounded-[4rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
                <h2 className="text-4xl lg:text-5xl font-black mb-16 text-center lg:text-left">Simple Way to Get Things Done</h2>
                <div className="grid md:grid-cols-3 gap-12">
                    <StepCard number="01" title="Post or Bid" description="Clients post their requirements, or freelancers bid on active projects that match their skills." />
                    <StepCard number="02" title="Collaborate" description="Use our integrated messaging System to discuss details, set milestones, and share files securely." />
                    <StepCard number="03" title="Pay with Confidence" description="Payment is released only when the work is completed and approved, ensuring satisfaction for everyone." />
                </div>
            </div>
          </div>

          {/* Stats / Proof */}
          <div className="grid md:grid-cols-3 gap-8 mb-32 text-center">
             <div className="p-8">
                <h3 className="text-5xl font-black text-primary mb-2">10k+</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Registered Freelancers</p>
             </div>
             <div className="p-8 border-x border-slate-100">
                <h3 className="text-5xl font-black text-primary mb-2">2.5k+</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Projects Completed</p>
             </div>
             <div className="p-8">
                <h3 className="text-5xl font-black text-primary mb-2">99%</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Satisfied Clients</p>
             </div>
          </div>

          {/* CTA Footer */}
          <div className="bg-primary rounded-[3rem] p-12 lg:p-24 text-center text-white shadow-2xl shadow-primary/40">
            <h2 className="text-5xl font-black mb-8 tracking-tighter">Ready to join Nepal's fastest growing network?</h2>
            <p className="text-primary-foreground/80 text-xl font-medium mb-12 max-w-2xl mx-auto">
                Whether you're looking to hire or looking to work, Worklynk provides the tools you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-white text-primary hover:bg-slate-50 font-black text-xl">
                    <Link href="/auth/register">Join as Client</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-16 px-12 rounded-2xl border-white text-primary hover:bg-white/10 font-black text-xl">
                    <Link href="/auth/register">Join as Freelancer</Link>
                </Button>
            </div>
          </div>
        </section>
      </div>
    </BaseLayout>
  );
}

function RoleCard({ role, title, description, icon, link, buttonText, features, color }: any) {
  const isPrimary = color === "primary";

  return (
    <div className={`p-10 rounded-[2.5rem] border bg-white h-full relative z-10 shadow-sm transition-all duration-300`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${isPrimary ? "bg-primary text-white" : "bg-secondary text-secondary-foreground"}`}>
        {icon}
      </div>
      <Badge variant="outline" className="mb-4 text-[10px] font-black tracking-[0.2em] border-primary/20">{role}</Badge>
      <h3 className="text-3xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-600 mb-8 leading-relaxed font-medium">{description}</p>
      
      <div className="space-y-3 mb-10">
        {features.map((f: string) => (
            <div key={f} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {f}
            </div>
        ))}
      </div>

      <Button asChild className="w-full h-14 rounded-xl font-bold group">
        <Link href={link} className="flex items-center justify-center gap-2">
          {buttonText}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>
    </div>
  );
}

function CategoryCard({ icon, title, subtitle }: any) {
    return (
        <Card className="rounded-3xl border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-pointer p-2">
            <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                <h4 className="font-black text-lg mb-1">{title}</h4>
                <p className="text-xs text-slate-500 font-bold">{subtitle}</p>
            </CardContent>
        </Card>
    );
}

function StepCard({ number, title, description }: any) {
    return (
        <div className="relative">
            <div className="text-6xl font-black opacity-10 mb-4">{number}</div>
            <h4 className="text-2xl font-black mb-4 text-primary">{title}</h4>
            <p className="text-slate-400 font-medium leading-relaxed">{description}</p>
        </div>
    );
}

function TrustBadge({ icon, text }: any) {
  return (
    <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-500">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
        {icon}
      </div>
      {text}
    </div>
  );
}

