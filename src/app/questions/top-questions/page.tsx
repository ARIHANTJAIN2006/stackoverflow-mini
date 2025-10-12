"use client"

import { Particles } from "@/components/magicui/particles"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/store/Auth"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

type Question = {
  $id: string
  title: string
  description?: string
  voteCount: number
}

export default function TopQuestionsPage() {

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();
  const isLoggedIn = useAuthStore(state => !!state.jwt);
  const {hydrated} = useAuthStore()
  useEffect(() => {
    if(!hydrated) return
    if (!isLoggedIn) {
      // Start showing toast every 3 seconds
      const interval = setInterval(() => {
        toast.error('You are not logged in, Lil bro 😎');
      }, 1000);

      // Redirect after 5 second
      setTimeout(() => {
        router.replace('/auth/login');
      }, 1000);

      // Clean up the interval
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, router,hydrated]);
  

  useEffect(() => {
    async function fetchTopQuestions() {
      try {
        setLoading(true)
        const res = await axios.get("/api/questions/topquestions")
        if (res.status === 200) {
          setQuestions(res.data)
        } else {
          setError("Failed to load questions")
        }
      } catch (err) {
        console.error(err)
        setError("Something went wrong 😭")
      } finally {
        setLoading(false)
      }
    }

    fetchTopQuestions()
  }, [])
if(!isLoggedIn) return null;
  if (loading) return <p className="text-zinc-400 mt-8">Loading top questions...</p>
  if (error) return <p className="text-red-400 mt-8">{error}</p>

  return (
    <div className="mt-10 mr-30">
      <Particles
                className="fixed inset-0 h-full w-full"
                quantity={500}
                ease={150}
                color="#ffffff"
                refresh
              />
      <h1 className="text-white text-2xl font-semibold mb-4">🔥 Top Questions</h1>
      <Separator className="bg-zinc-700 h-[1px]" />

      {questions.length === 0 ? (
        <p className="text-zinc-400 mt-6">No questions found.</p>
      ) : (
        questions.map((q) => (
          <div key={q.$id} className="flex items-start space-x-4 mt-6">
            {/* Votes */}
            <div className="text-center text-white w-12">
              <p className="font-semibold text-lg text-amber-200">
                {q.voteCount ?? "–"}
              </p>
              <p className="text-sm text-zinc-400">votes</p>
              <hr className="mt-4 w-12 border-zinc-700" />
            </div>

            {/* Question */}
            <div className="flex-1">
              <Link
                href={`/questions/${q.$id}`}
                className="text-white text-xl font-semibold no-underline hover:underline"
              >
                {q.title}
              </Link>
              <p className="text-zinc-400 text-base mt-1">
                {q.description || "No description provided."}
              </p>
              <Separator className="bg-zinc-700 h-[1px] mt-4" />
            </div>
          </div>
        ))
      )}
    </div>
  )
}
