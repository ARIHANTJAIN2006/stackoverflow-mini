"use client"
import { useParams, useRouter } from "next/navigation";

import { TracingBeam } from "@/components/ui/tracingbeam"
import { Particles } from "@/components/magicui/particles"
import FetchAnswers from "@/helpers/fetchanswers"
import Link from "next/link";
import "@/styles/borderstyle.css"
import { useAuthStore } from "@/store/Auth";
import { useEffect } from "react";
import toast from "react-hot-toast";
//votedById,voteStatus,type,typeId
function NavItem({ href, text }: { href: string; text: string }) {
   const {hydrated} = useAuthStore()
     const router = useRouter()
  const isLoggedIn = useAuthStore(state => !!state.jwt);

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
  }, [isLoggedIn, router]);
  if(!isLoggedIn) return null;
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-full  hover:bg-white/10 transition text-sm"
    >
      {text}
    </Link>
  );
}
export  default function QuestionPage(){
   const params = useParams();
   const router = useRouter()
  const qid = params.qid as string;
  const routing = () => {
  router.push("/questions/askquestion",)
  }
return(
 
 
      <TracingBeam className="container">
          <div className="relative   min-h-screen w-full bg-black">
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
          <NavItem href="/logout" text="Logout" />
          
        </div>
      </nav>
             <div className="relative isolate z-50 ml-210">
  <button className="askq mt-30 " onClick={routing}>Ask a Question</button>
</div>
<FetchAnswers qid={qid} />

            
          </div>
        </TracingBeam>
        
)
}