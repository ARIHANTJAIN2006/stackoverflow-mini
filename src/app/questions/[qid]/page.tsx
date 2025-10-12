"use client"
import { useParams, useRouter } from "next/navigation"
import { TracingBeam } from "@/components/ui/tracingbeam"
import { Particles } from "@/components/magicui/particles"
import FetchAnswers from "@/helpers/fetchanswers"
import Link from "next/link"
import "@/styles/borderstyle.css"
import { useAuthStore } from "@/store/Auth"
import { useEffect } from "react"
import toast from "react-hot-toast"

// 🧭 Nav item component
function NavItem({
  href,
  text,
  onClick,
}: {
  href?: string
  text: string
  onClick?: () => void
}) {
  const { hydrated } = useAuthStore()
  const router = useRouter()
  const isLoggedIn = useAuthStore((state) => !!state.jwt)

  useEffect(() => {
    if (!hydrated) return
    if (!isLoggedIn) {
      // Annoy the user until they log in 😎
      const interval = setInterval(() => {
        toast.error("You are not logged in, lil bro 😎")
      }, 1000)

      // yeet them to login
      setTimeout(() => {
        router.replace("/auth/login")
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isLoggedIn, router, hydrated])

  if (!isLoggedIn) return null

  // if onClick provided, render button style; else render link
  return onClick ? (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full hover:bg-white/10 transition text-sm"
    >
      {text}
    </button>
  ) : (
    <Link
      href={href || "#"}
      className="px-4 py-2 rounded-full hover:bg-white/10 transition text-sm"
    >
      {text}
    </Link>
  )
}

export default function QuestionPage() {
  const params = useParams()
  const router = useRouter()
  const qid = params.qid as string
  const { logout } = useAuthStore()

  const routing = () => {
    router.push("/questions/askquestion")
  }

  // 🧨 logout handler
  const handleLogout = async () => {
    try {
      await logout()

      // 🚮 Manually clear Appwrite cookies
      if (typeof document !== "undefined") {
        const cookies = document.cookie.split(";")
        for (const cookie of cookies) {
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        }
      }

      toast.success("Logged out successfully ✌️")
      router.replace("/auth/login")
    } catch (err) {
      console.error(err)
      toast.error("Failed to log out, bro 😬")
    }
  }
  return (
    <TracingBeam className="container">
      <div className="relative min-h-screen w-full bg-black">
        <Particles
          className="fixed inset-0 h-full w-full"
          quantity={500}
          ease={150}
          color="#ffffff"
          refresh
        />
        <nav className="w-full px-6 py-6 flex justify-center items-center">
          <div className="flex gap-4 border border-white/30 rounded-full px-6 py-2 backdrop-blur-sm">
            <NavItem href="/dashboard" text="Dashboard" />
            <NavItem href="/questions" text="Questions" />
            <NavItem text="Logout" onClick={handleLogout} />
          </div>
        </nav>

        <div className="relative isolate z-50 ml-210">
          <button className="askq mt-30" onClick={routing}>
            Ask a Question
          </button>
        </div>

        <FetchAnswers qid={qid} />
      </div>
    </TracingBeam>
  )
}
