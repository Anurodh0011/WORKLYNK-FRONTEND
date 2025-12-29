import { Star, MapPin } from "lucide-react";
import BaseLayout from "../components/base-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const freelancersData = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Full Stack Developer",
    rating: 4.9,
    reviews: 142,
    hourlyRate: 85,
    location: "USA",
    skills: ["React", "Node.js", "PostgreSQL"],
    bio: "Experienced full stack developer with 8+ years in web development.",
  },
  {
    id: 2,
    name: "Amit Patel",
    title: "UI/UX Designer",
    rating: 4.8,
    reviews: 98,
    hourlyRate: 65,
    location: "India",
    skills: ["Figma", "UI Design", "Prototyping"],
    bio: "Creative designer focused on user-centric design solutions.",
  },
  {
    id: 3,
    name: "Emma Wilson",
    title: "Mobile Developer",
    rating: 4.7,
    reviews: 76,
    hourlyRate: 75,
    location: "UK",
    skills: ["React Native", "iOS", "Android"],
    bio: "Specialist in cross-platform mobile app development.",
  },
  {
    id: 4,
    name: "Carlos Martinez",
    title: "DevOps Engineer",
    rating: 4.9,
    reviews: 52,
    hourlyRate: 95,
    location: "Mexico",
    skills: ["AWS", "Docker", "Kubernetes"],
    bio: "Expert in cloud infrastructure and deployment pipelines.",
  },
];

export default function BrowseFreelancers() {
  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse Freelancers</h1>
          <p className="text-lg text-muted-foreground">
            Find talented professionals for your projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancersData.map((freelancer) => (
            <Card key={freelancer.id}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardTitle>{freelancer.name}</CardTitle>
                    <CardDescription>{freelancer.title}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{freelancer.rating}</span>
                  <span className="text-muted-foreground">
                    ({freelancer.reviews} reviews)
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{freelancer.location}</span>
                </div>
                <p className="text-sm">{freelancer.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-bold">${freelancer.hourlyRate}/hr</span>
                  <Button size="sm">View Profile</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}
