import BaseLayout from "@/src/app/components/base-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/src/app/components/ui/radio-group";
import { Label } from "@/src/app/components/ui/label";

export default function Register() {
  return (
    <BaseLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Sign up as a client or freelancer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <div className="space-y-3">
                <Label>Account Type</Label>
                <RadioGroup defaultValue="freelancer">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label
                      htmlFor="client"
                      className="font-normal cursor-pointer"
                    >
                      I&apos;m a Client (Looking for freelancers)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="freelancer" id="freelancer" />
                    <Label
                      htmlFor="freelancer"
                      className="font-normal cursor-pointer"
                    >
                      I&apos;m a Freelancer (Looking for projects)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button className="w-full">Register</Button>
            </form>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Login here
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
