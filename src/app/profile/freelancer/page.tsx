"use client";

import React, { useState, useEffect } from "react";
import BaseLayout from "@/src/app/components/base-layout";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Textarea } from "@/src/app/components/ui/textarea";
import { Label } from "@/src/app/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "@/src/helpers/config";
import { Badge } from "@/src/app/components/ui/badge";
import { PlusCircle, Trash2, GraduationCap, Briefcase, Wrench, Globe, Award, X } from "lucide-react";

export default function FreelancerProfileBuilder() {
  const { user, isLoading }: any = useAuthContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States mirroring Prisma JSON fields
  const [headline, setHeadline] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>("");
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [education, setEducation] = useState([{ institution: "", degree: "", year: "" }]);
  const [experience, setExperience] = useState([{ company: "", role: "", duration: "", description: "" }]);
  const [portfolio, setPortfolio] = useState([{ title: "", link: "", description: "" }]);
  const [certifications, setCertifications] = useState([{ name: "", issuer: "", year: "", link: "" }]);

  const addSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    // If it's a keyboard event, only trigger on Enter, let preventDefault stop form submission
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.role !== "FREELANCER") {
        router.push("/dashboard"); // Only freelancers can access this builder
      } else {
        fetchProfile();
      }
    }
  }, [user, isLoading]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/profile`, { credentials: "include" });
      const data = await res.json();
      
      if (data.success && data.data?.profile) {
        const p = data.data.profile;
        if (p.headline) setHeadline(p.headline);
        if (p.skills && p.skills.length > 0) setSkills(p.skills);
        if (p.hourlyRate) setHourlyRate(p.hourlyRate.toString());
        if (p.user?.phoneNumber) setPhoneNumber(p.user.phoneNumber);
        if (p.education && p.education.length > 0) setEducation(p.education);
        if (p.experience && p.experience.length > 0) setExperience(p.experience);
        if (p.portfolio && p.portfolio.length > 0) setPortfolio(p.portfolio);
        if (p.certifications && p.certifications.length > 0) setCertifications(p.certifications);
      }
    } catch (error) {
      toast.error("Failed to load your profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Clean up arrays: remove completely empty entries before saving
      const cleanEducation = education.filter(e => e.institution || e.degree);
      const cleanExperience = experience.filter(e => e.company || e.role);
      const cleanPortfolio = portfolio.filter(p => p.title || p.link);
      const cleanCertifications = certifications.filter(c => c.name || c.issuer);
      
      const payload = {
        headline,
        skills,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        phoneNumber,
        education: cleanEducation,
        experience: cleanExperience,
        portfolio: cleanPortfolio,
        certifications: cleanCertifications,
      };

      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Freelancer profile updated successfully!");
        // Refresh cleaner versions to state
        setEducation(cleanEducation.length ? cleanEducation : [{ institution: "", degree: "", year: "" }]);
        setExperience(cleanExperience.length ? cleanExperience : [{ company: "", role: "", duration: "", description: "" }]);
        setPortfolio(cleanPortfolio.length ? cleanPortfolio : [{ title: "", link: "", description: "" }]);
        setCertifications(cleanCertifications.length ? cleanCertifications : [{ name: "", issuer: "", year: "", link: "" }]);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loading) return <div className="flex justify-center items-center min-h-screen">Loading profile builder...</div>;
  if (!user || user.role !== "FREELANCER") return null;

  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Freelancer Profile Builder</h1>
          <p className="text-muted-foreground mt-2">Flesh out your professional experience, education, and portfolio to stand out to clients.</p>
        </div>

        <div className="space-y-8">
          {/* SKILLS & RATES */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Wrench size={20} className="text-primary"/> Professional Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Professional Headline</Label>
                <Input 
                  placeholder="e.g. AWS Certified Cloud Engineer | React Specialist" 
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hourly Rate (रू)</Label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 500" 
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input 
                    placeholder="e.g. +977-9800000000" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Core Skills</Label>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="React, AWS, Figma..." 
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                    />
                    <Button variant="secondary" onClick={addSkill} type="button">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.length === 0 && <span className="text-xs text-muted-foreground italic">No skills added yet</span>}
                    {skills.map(skill => (
                      <Badge key={skill} variant="default" className="flex items-center gap-1 pl-3 pr-1.5 py-1.5 h-auto">
                        <span className="text-sm font-medium">{skill}</span>
                        <button 
                          type="button" 
                          className="ml-1 p-0.5 rounded-full hover:bg-slate-200 hover:text-red-500 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeSkill(skill);
                          }}
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EXPERIENCE */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Briefcase size={20} className="text-primary"/> Experience</CardTitle>
                <CardDescription>Where have you worked?</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setExperience([...experience, { company: "", role: "", duration: "", description: "" }])}>
                <PlusCircle size={14} className="mr-2"/> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500" onClick={() => setExperience(experience.filter((_, i) => i !== index))}>
                    <Trash2 size={16}/>
                  </Button>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input value={exp.company} onChange={(e) => { const n = [...experience]; n[index].company = e.target.value; setExperience(n); }} placeholder="Acme Corp" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={exp.role} onChange={(e) => { const n = [...experience]; n[index].role = e.target.value; setExperience(n); }} placeholder="Senior Developer" />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input value={exp.duration} onChange={(e) => { const n = [...experience]; n[index].duration = e.target.value; setExperience(n); }} placeholder="2020 - Present" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea value={exp.description} onChange={(e) => { const n = [...experience]; n[index].description = e.target.value; setExperience(n); }} placeholder="Led the frontend team..." className="min-h-[80px]" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* EDUCATION */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><GraduationCap size={20} className="text-primary"/> Education</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEducation([...education, { institution: "", degree: "", year: "" }])}>
                <PlusCircle size={14} className="mr-2"/> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b last:border-0 relative pr-10">
                  <Button variant="ghost" size="icon" className="absolute top-0 right-0 text-red-500" onClick={() => setEducation(education.filter((_, i) => i !== index))}>
                    <Trash2 size={16}/>
                  </Button>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input value={edu.institution} onChange={(e) => { const n = [...education]; n[index].institution = e.target.value; setEducation(n); }} placeholder="University Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree/Certificate</Label>
                    <Input value={edu.degree} onChange={(e) => { const n = [...education]; n[index].degree = e.target.value; setEducation(n); }} placeholder="BSc Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <Label>Year Completed</Label>
                    <Input value={edu.year} onChange={(e) => { const n = [...education]; n[index].year = e.target.value; setEducation(n); }} placeholder="2022" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* PORTFOLIO */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Globe size={20} className="text-primary"/> Portfolio Links</CardTitle>
                <CardDescription>Got a Github, Dribbble, or a live site?</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPortfolio([...portfolio, { title: "", link: "", description: "" }])}>
                <PlusCircle size={14} className="mr-2"/> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {portfolio.map((port, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b last:border-0 relative">
                  <Button variant="ghost" size="icon" className="absolute top-0 right-0 text-red-500" onClick={() => setPortfolio(portfolio.filter((_, i) => i !== index))}>
                    <Trash2 size={16}/>
                  </Button>
                  <div className="space-y-2">
                    <Label>Project Title</Label>
                    <Input value={port.title} onChange={(e) => { const n = [...portfolio]; n[index].title = e.target.value; setPortfolio(n); }} placeholder="My Awesome Web App" />
                  </div>
                  <div className="space-y-2 pr-10">
                    <Label>URL/Link</Label>
                    <Input value={port.link} onChange={(e) => { const n = [...portfolio]; n[index].link = e.target.value; setPortfolio(n); }} placeholder="https://..." />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CERTIFICATIONS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Award size={20} className="text-primary"/> Certifications</CardTitle>
                <CardDescription>Relevant licenses or certificates you have earned.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCertifications([...certifications, { name: "", issuer: "", year: "", link: "" }])}>
                <PlusCircle size={14} className="mr-2"/> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-slate-50 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500" onClick={() => setCertifications(certifications.filter((_, i) => i !== index))}>
                    <Trash2 size={16}/>
                  </Button>
                  <div className="space-y-2">
                    <Label>Certificate Name</Label>
                    <Input value={cert.name} onChange={(e) => { const n = [...certifications]; n[index].name = e.target.value; setCertifications(n); }} placeholder="e.g. AWS Solutions Architect" />
                  </div>
                  <div className="space-y-2 pr-10">
                    <Label>Issuing Organization</Label>
                    <Input value={cert.issuer} onChange={(e) => { const n = [...certifications]; n[index].issuer = e.target.value; setCertifications(n); }} placeholder="e.g. Amazon Web Services" />
                  </div>
                  <div className="space-y-2">
                    <Label>Year Earned</Label>
                    <Input value={cert.year} onChange={(e) => { const n = [...certifications]; n[index].year = e.target.value; setCertifications(n); }} placeholder="2024" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Credential URL</Label>
                    <Input value={cert.link} onChange={(e) => { const n = [...certifications]; n[index].link = e.target.value; setCertifications(n); }} placeholder="https://..." />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
             <Button size="lg" onClick={handleSaveProfile} disabled={saving} className="w-full md:w-auto px-10">
               {saving ? "Saving Profile..." : "Publish Freelancer Profile"}
             </Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
