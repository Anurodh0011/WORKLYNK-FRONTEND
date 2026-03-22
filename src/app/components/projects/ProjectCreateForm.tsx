"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/src/hooks/context/AuthContext";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Label } from "@/src/app/components/ui/label";
import { Textarea } from "@/src/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/components/ui/select";
import { Badge } from "@/src/app/components/ui/badge";
import {
  X,
  Plus,
  Upload,
  Save,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/src/helpers/config";
import { mutationFetcher } from "@/src/helpers/fetcher";

const STEPS = [
  { id: 1, title: "Basics", description: "Project essentials" },
  { id: 2, title: "Skills", description: "What you need" },
  { id: 3, title: "Budget", description: "Pricing & timing" },
  { id: 4, title: "Finalize", description: "Checklist & files" },
];

const CATEGORIES = [
  "Web Development",
  "Mobile Apps",
  "Design & Creative",
  "Writing & Translation",
  "Admin & Customer Support",
  "Marketing & Sales",
  "Data Science & Analysis",
  "Engineering & Architecture",
];

const EXPERIENCE_LEVELS = [
  { value: "ENTRY", label: "Entry Level" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "EXPERT", label: "Expert" },
];

interface ProjectFormData {
  title: string;
  category: string;
  description: string;
  skillsRequired: string[];
  experienceLevel: string;
  duration: string;
  budgetType: string;
  budgetMin: string;
  budgetMax: string;
  checklist: string[];
  status: string;
  [key: string]: any; // Index signature for easier mapping
}

export default function ProjectCreateForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    category: "",
    description: "",
    skillsRequired: [],
    experienceLevel: "INTERMEDIATE",
    duration: "",
    budgetType: "FIXED",
    budgetMin: "",
    budgetMax: "",
    checklist: [],
    status: "DRAFT",
  });

  const [skillInput, setSkillInput] = useState("");
  const [checklistItemInput, setChecklistItemInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value as any }));
  };

  const addSkill = () => {
    if (
      skillInput.trim() &&
      !formData.skillsRequired.includes(skillInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  };

  const addChecklistItem = () => {
    if (
      checklistItemInput.trim() &&
      !formData.checklist.includes(checklistItemInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        checklist: [...prev.checklist, checklistItemInput.trim()],
      }));
      setChecklistItemInput("");
    }
  };

  const removeChecklistItem = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((i) => i !== item),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (status = "OPEN") => {
    setIsSubmitting(status === "OPEN");
    setIsSavingDraft(status === "DRAFT");

    try {
      const payload = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((val) => payload.append(`${key}[]`, val));
        } else {
          payload.append(key, formData[key] === "" ? "" : formData[key]);
        }
      });

      // Override status
      payload.set("status", status);

      // Append files
      files.forEach((file) => {
        payload.append("attachments", file);
      });

      const response = await mutationFetcher(`${API_BASE_URL}/projects`, {
        arg: payload,
      });

      if (response.success) {
        toast.success(response.message);
        router.push("/dashboard");
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(
        error.message || "Something went wrong while posting project.",
      );
    } finally {
      setIsSubmitting(false);
      setIsSavingDraft(false);
    }
  };

  // Step Components
  const renderStepBasics = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Build a modern E-commerce platform"
          value={formData.title}
          onChange={handleInputChange}
          className="text-lg py-6"
        />
        <p className="text-sm text-muted-foreground">
          Catchy titles attract better freelancers.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          onValueChange={(value) => handleSelectChange("category", value)}
          defaultValue={formData.category}
        >
          <SelectTrigger className="w-full py-6">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your project requirements, goals, and expectations..."
          value={formData.description}
          onChange={handleInputChange}
          className="min-h-[200px] text-base"
        />
      </div>
    </div>
  );

  const renderStepSkills = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <Label>Desired Skills</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. React, Node.js, UI Design"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addSkill())
            }
          />
          <Button
            type="button"
            onClick={addSkill}
            size="icon"
            variant="secondary"
          >
            <Plus size={18} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {formData.skillsRequired.map((skill) => (
            <Badge
              key={skill}
              variant="default"
              className="pl-3 pr-1 py-1 gap-1"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:bg-white/20 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
          {formData.skillsRequired.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Add at least one skill
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select
            onValueChange={(value) =>
              handleSelectChange("experienceLevel", value)
            }
            defaultValue={formData.experienceLevel}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Estimated Duration</Label>
          <Input
            id="duration"
            name="duration"
            placeholder="e.g. 3 months, 1 week"
            value={formData.duration}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );

  const renderStepBudget = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <Label>Budget Type</Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={formData.budgetType === "FIXED" ? "default" : "outline"}
            className="flex-1 py-10 text-lg flex-col gap-2"
            onClick={() => handleSelectChange("budgetType", "FIXED")}
          >
            <CheckCircle2
              size={24}
              className={formData.budgetType === "FIXED" ? "block" : "hidden"}
            />
            Fixed Price
          </Button>
          <Button
            type="button"
            variant={formData.budgetType === "HOURLY" ? "default" : "outline"}
            className="flex-1 py-10 text-lg flex-col gap-2"
            onClick={() => handleSelectChange("budgetType", "HOURLY")}
          >
            <CheckCircle2
              size={24}
              className={formData.budgetType === "HOURLY" ? "block" : "hidden"}
            />
            Hourly Rate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <Label htmlFor="budgetMin">Minimum Budget (NPR)</Label>
          <Input
            id="budgetMin"
            name="budgetMin"
            type="number"
            placeholder="0"
            value={formData.budgetMin}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budgetMax">Maximum Budget (NPR)</Label>
          <Input
            id="budgetMax"
            name="budgetMax"
            type="number"
            placeholder="5000"
            value={formData.budgetMax}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );

  const renderStepFinalize = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <Label>Freelancer Checklist (Requirements to meet)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Must have 5+ years of experience"
            value={checklistItemInput}
            onChange={(e) => setChecklistItemInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addChecklistItem())
            }
          />
          <Button
            type="button"
            onClick={addChecklistItem}
            size="icon"
            variant="secondary"
          >
            <Plus size={18} />
          </Button>
        </div>
        <div className="space-y-2">
          {formData.checklist.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
            >
              <span className="text-sm">{item}</span>
              <button
                type="button"
                onClick={() => removeChecklistItem(item)}
                className="text-destructive hover:scale-110 transition-transform"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {formData.checklist.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              List any specific requirements or checks.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Attachments (Documents, Mockups, etc.)</Label>
        <div className="border-2 border-dashed rounded-xl p-8 text-center transition-colors hover:border-primary group">
          <input
            type="file"
            multiple
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer space-y-2 block"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <div className="text-sm font-medium">
              Click to upload or drag and drop
            </div>
            <div className="text-xs text-muted-foreground">
              Any file up to 10MB
            </div>
          </label>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 pl-4 bg-muted/50 rounded-lg border"
              >
                <span className="text-xs font-medium truncate max-w-[200px]">
                  {file.name}
                </span>
                <Button
                  type="button"
                  onClick={() => removeFile(idx)}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:text-destructive"
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stepper Header */}
      <div className="flex justify-between items-center mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 -z-10" />
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-2 ${
                currentStep >= step.id
                  ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                  : "bg-background border-muted text-muted-foreground"
              }`}
            >
              {currentStep > step.id ? <CheckCircle2 size={20} /> : step.id}
            </div>
            <div className="text-center">
              <div
                className={`text-xs font-bold leading-none ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`}
              >
                {step.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="min-h-[450px] mb-12">
        {currentStep === 1 && renderStepBasics()}
        {currentStep === 2 && renderStepSkills()}
        {currentStep === 3 && renderStepBudget()}
        {currentStep === 4 && renderStepFinalize()}
      </div>

      {/* Persistence Controls */}
      <div className="flex flex-col sm:flex-row gap-4 border-t pt-8">
        <Button
          variant="ghost"
          onClick={() => handleSubmit("DRAFT")}
          disabled={isSavingDraft || isSubmitting}
          className="gap-2 order-2 sm:order-1"
        >
          {isSavingDraft ? (
            <span className="animate-spin mr-2">⟳</span>
          ) : (
            <Save size={18} />
          )}
          Save as Draft
        </Button>

        <div className="flex-1 sm:order-2" />

        <div className="flex gap-4 sm:order-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep} size="icon">
              <ChevronLeft size={20} />
            </Button>
          )}

          {currentStep < STEPS.length ? (
            <Button onClick={nextStep} className="gap-2 px-8">
              Next Step
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button
              onClick={() => handleSubmit("OPEN")}
              disabled={isSubmitting || isSavingDraft}
              className="px-8 gap-2 shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <span className="animate-spin mr-2">⟳</span>
              ) : (
                <CheckCircle2 size={18} />
              )}
              Post Project
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
