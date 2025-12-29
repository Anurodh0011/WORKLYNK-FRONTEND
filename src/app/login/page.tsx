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
import { Label } from "@/src/app/components/ui/label";

export default function Login() {
  return (
    <BaseLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full">Login</Button>
              <p className="text-sm text-center text-muted-foreground">
                <a
                  href="/recover-password"
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </p>
            </form>
            <p className="text-sm text-center text-muted-foreground mt-4">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-primary hover:underline">
                Register here
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
