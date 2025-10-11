"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/Auth"
import React from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function SignupForm({ className }: { className?: string }) {
 
  const { createAccount, login } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstname")
    const lastName = formData.get("lastname")
    const email = formData.get("email")
    const password = formData.get("password")

    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill out all the fields")
      return
    }

    const loadingToast = toast.loading("Creating your account...")

    const response = await createAccount(
      `${firstName} ${lastName}`,
      email.toString(),
      password.toString()
    )

    if (response.error) {
      toast.dismiss(loadingToast)
      toast.error(response.error.message)
      return
    }

    const loginResponse = await login(email.toString(), password.toString())

    toast.dismiss(loadingToast)

    if (loginResponse.error) {
      toast.error(loginResponse.error.message)
    } else {
      toast.success("Signup successful! Redirecting to Home Page...")
      router.push("/auth/login")
    }
  }

  return (
    <div className={cn("w-full max-w-md mx-auto bg-black", className)}>
      <Card className="bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="firstname">Firstname</Label>
                <Input
                  id="firstname"
                  type="text"
                  name="firstname"
                  placeholder="firstname"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lastname">Lastname</Label>
                <Input
                  id="lastname"
                  type="text"
                  name="lastname"
                  placeholder="lastname"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="web@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Signup
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/auth/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
