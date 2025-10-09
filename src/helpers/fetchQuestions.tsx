"use client"
import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";


type Question = {
  $id: string;
  title: string;
  content: string;
};

export default function FetchQuestions({ questions }: { questions: Question[] }) {
  const router = useRouter()
  const {session,hydrated} = useAuthStore()
  
  const [votesResult, setVotesResult] = useState<Record<string, number>>({});
  useEffect(() => {
    if (hydrated && !session) {
      router.push("/auth/login");
    }
  }, [hydrated, session, router]);

  // ⏳ Wait while Zustand rehydrates or redirect happens
  

  useEffect(() => {
    
    async function fetchVotes() {
      const result: Record<string, number> = {};

      for (const q of questions) {
        try {
          const res = await axios.post("/api/vote-count", { typeid: q.$id,type: "question"});
          result[q.$id] = res.data.data;
        } catch {
          result[q.$id] = 0;
        }
      }

      setVotesResult(result);
    }

    fetchVotes();
  }, [questions]);
if (!hydrated || !session) {
    return null; // or show a loading spinner
  }
  return (
    <div className="mt-35 mr-30">
      <Separator className="bg-zinc-700 h-[1px]"/>
     {questions.map((q) => (
  <div key={q.$id} className="flex items-start space-x-4 mt-5">
    {/* Votes Section */}
    <div className="text-center text-white w-12">
      <p className="font-semibold text-lg text-amber-200">{votesResult[q.$id] ?? "–"}</p>
      <p className="text-sm text-zinc-400">votes</p>
      <hr className="mt-6 w-17" ></hr>
    </div>

    {/* Question Content */}
    <div className="flex-1">
      <Link
        href={`/questions/${q.$id}`}
        className="text-white text-xl font-semibold no-underline"
      >
        {q.title}
      </Link>
      <p className="text-zinc-400 text-base mt-1">{q.content}</p>
      <Separator className="bg-zinc-700 h-[1px] mt-4" />
    </div>
  </div>
))}

    </div>
  );
}
