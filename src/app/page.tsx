import Link from "next/link";
import { ArrowRight, Briefcase, Users } from "lucide-react";
import BaseLayout from "./components/base-layout";
import { Button } from "./components/ui/button";

export default function Home() {
  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* hero section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6">
            Connect with Top Freelance Talent in Nepal
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find skilled freelancers or exciting projects. Build amazing things
            together.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/browse-projects">Browse Projects</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/browse-freelancers">Find Freelancers</Link>
            </Button>
          </div>
        </div>

        {/* features */}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex gap-4">
            <Briefcase className="w-12 h-12 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-2">For Clients</h2>
              <p className="text-muted-foreground mb-4">
                Post projects, find talented freelancers, and manage your work
                with ease.
              </p>
              <Button asChild variant="ghost" className="gap-2">
                <Link href="/browse-freelancers">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex gap-4">
            <Users className="w-12 h-12 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-2">For Freelancers</h2>
              <p className="text-muted-foreground mb-4">
                Discover projects that match your skills and grow your freelance
                career.
              </p>
              <Button asChild variant="ghost" className="gap-2">
                <Link href="/browse-projects">
                  Explore <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
