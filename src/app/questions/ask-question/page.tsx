'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import "@/styles/borderstyle.css"
import { Particles } from '@/components/magicui/particles';
import axios from 'axios';
import {useAuthStore} from "@/store/Auth";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';



// Dynamically import the Markdown Editor (no SSR)
const RTE = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export default function AskQuestionCard() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState<string | undefined>('');
  
   const {user} = useAuthStore()
   const userId = user?.$id


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
  if(!isLoggedIn) return null;
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log({ title, body });

  try {
    const res = await axios.post("/api/questions/publishquestion", {
      title: title,
      content: body,
      userId: userId,
    });

    if (res.status === 200) {
      toast.success("Your question has been published successfully!", {
        duration: 5000,
      });

      // Clear form fields
      setTitle('');
      setBody('');

      // Redirect to /questions after a short delay to let the toast show
      setTimeout(() => {
        router.push('/questions');
      }, 500); // 0.5s delay
    } else {
      toast.error("There was an error publishing your question. Please try again.");
    }
  } catch (err) {
    console.error(err);
    toast.error("There was an error publishing your question. Please try again.");
  }
};

  return (
   
              <div className="relative   min-h-screen w-full bg-black">
                <Particles
                  className="fixed inset-0 h-full w-full"
                  quantity={500}
                  ease={150}
                  color="#ffffff"
                  refresh
                />
               
                 <div className="relative isolate z-50">
                      <div className="askcard  mx-auto mt-12 p-6 "
    >
      
      <h1 className=" text-2xl font-bold text-white mb-4">Ask a Question</h1>
      

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Enter your question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 text-lg border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500"
          required
        />

        <div className="bg-zinc-800 rounded-lg border border-zinc-700">
          <RTE
            value={body}
            onChange={setBody}
            height={300}
            className="prose prose-invert p-2"
          />
        </div>
        
<button

          type="submit"
          className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
        >
          Submit Question
        </button>
      </form>
    </div>
                 </div>
   
    </div>
  );
}
