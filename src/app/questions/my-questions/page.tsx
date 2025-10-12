"use client"
import { Particles } from "@/components/magicui/particles";
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/store/Auth"
import axios from "axios"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react"
type Question = {
  $id: string;
  title: string;
  content: string;
};
type User = {
  $id: string;
} | null | undefined;
import { useState } from "react"
import toast from "react-hot-toast";

export default function UserQuestionsPage(){
    let user: User | null | undefined;
    const [isAnswer,setIsAnswer] = useState(false)
   let userId:string | undefined
   
    const [questions, setQuestions] = useState<Question[]>([])
    const {hydrated} = useAuthStore()

const router = useRouter();
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
  }, [isLoggedIn, router,hydrated]);
  
    useEffect(() => {
     
      if (!hydrated || !user?.$id) return
        async function fetchuserquestions(){
           const res = await axios.post("/api/questions/userquestions", {userId:userId})
            setQuestions(res.data.data)
            if(res.status === 404){
                setIsAnswer(false)
            }
            else{
              setIsAnswer(true)
            }
        }
        fetchuserquestions()
    }, [userId])
    if(!isLoggedIn) return null;
    return(
      (isAnswer &&
       <div className="mt-35 mr-30">
        <Particles/>
      <Separator className="bg-zinc-700 h-[1px]"/>
     {questions.map((q) => (
  <div key={q.$id} className="flex items-start space-x-4 mt-5">
    
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

    </div>)
    ||( <div className="mt-35 mr-30">
      <Particles
          className="fixed inset-0 h-full w-full"
          quantity={500}
          ease={150}
          color="#ffffff"
          refresh
        />
      <Separator className="bg-zinc-700 h-[1px]"/>
     {questions.map((q:Question) => (
  <div key={q.$id} className="flex items-start space-x-4 mt-5">
    
    {/* Question Content */}
  
  </div>
 ))}
  <p className="text-zinc-400 mt-6">You have not asked any questions yet.</p>
    </div>
    )
  )
}