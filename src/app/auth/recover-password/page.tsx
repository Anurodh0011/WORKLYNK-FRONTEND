import BaseLayout from "@/components/base-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RecoverPassword() {
  return (
    <BaseLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Recover Password</CardTitle>
            <CardDescription>Enter your email to reset your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <Button className="w-full">Send Recovery Link</Button>
            </form>
            <p className="text-sm text-center text-muted-foreground mt-4">
              <a href="/login" className="text-primary hover:underline">
                Back to login
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  )
}
