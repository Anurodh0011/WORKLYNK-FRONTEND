import BaseLayout from "@/src/app/components/base-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Badge } from "@/src/app/components/ui/badge";
import { DollarSign, Users, Calendar } from "lucide-react";

const projectsData = [
  {
    id: 1,
    title: "E-commerce Platform Development",
    description: "Build a modern e-commerce platform with payment integration",
    budget: "5000-8000",
    duration: "3-4 months",
    applicants: 12,
    skills: ["React", "Node.js", "MongoDB"],
    level: "Intermediate",
  },
  {
    id: 2,
    title: "Mobile App Design",
    description: "Design UI/UX for a fitness tracking mobile application",
    budget: "2000-3000",
    duration: "1-2 months",
    applicants: 8,
    skills: ["Figma", "UI Design", "UX"],
    level: "Intermediate",
  },
  {
    id: 3,
    title: "Cloud Infrastructure Setup",
    description: "Set up AWS infrastructure and deployment pipeline",
    budget: "3000-5000",
    duration: "2-3 weeks",
    applicants: 5,
    skills: ["AWS", "Docker", "Terraform"],
    level: "Advanced",
  },
  {
    id: 4,
    title: "Content Writing - Tech Blog",
    description: "Write 20 technical blog posts on web development topics",
    budget: "1500-2500",
    duration: "1-2 months",
    applicants: 15,
    skills: ["Technical Writing", "SEO", "Web Dev"],
    level: "Intermediate",
  },
];

export default function BrowseProjects() {
  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse Projects</h1>
          <p className="text-lg text-muted-foreground">
            Find the perfect project to work on
          </p>
        </div>

        <div className="space-y-4">
          {projectsData.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Badge>{project.level}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">${project.budget}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{project.applicants} applicants</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full">View Details & Apply</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}
