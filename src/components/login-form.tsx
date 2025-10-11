"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/Auth"
import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"



export default function Loginform({ className }: { className?: string }) {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
   

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
      setError("Please fill out both the fields")
      setIsLoading(false)
      return
    }

    setError("")
    setIsLoading(true)

    const loginResponse = await login(email.toString(), password.toString())
    if (loginResponse.error) {
      setError(loginResponse.error?.message)
      setIsLoading(false)
    } else {
      setError("")
      router.push("/")
    }
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <Card  className="bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlesubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="destructive"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                />

                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
              {error && (
                <div>
                  <Alert variant="destructive">
                    <Terminal />
                    <AlertTitle>ERROR!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
