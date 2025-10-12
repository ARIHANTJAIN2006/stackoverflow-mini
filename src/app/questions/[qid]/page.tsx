"use client";
import { useParams, useRouter } from "next/navigation";
import { TracingBeam } from "@/components/ui/tracingbeam";
import { Particles } from "@/components/magicui/particles";
import FetchAnswers from "@/helpers/fetchanswers";
import Link from "next/link";
import "@/styles/borderstyle.css";
import { useAuthStore } from "@/store/Auth";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// NavItem component
function NavItem({ href, text }: { href: string; text: string }) {
  const { hydrated, session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !session) {
      router.push("/auth/login");
    }
  }, [hydrated, session, router]);

  if (!hydrated || !session) return null;

  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-full hover:bg-white/10 transition text-sm"
    >
      {text}
    </Link>
  );
}

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const qid = params.qid as string;

  const routing = () => {
    router.push("/questions/ask-question");
  };

  const {  user } = useAuthStore();
  const [answerContent, setAnswerContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAnswer = async () => {
    if (!answerContent.trim()) return toast.error("Answer cannot be empty 😅");
    if (!user || !user.$id) return toast.error("User not found 😬");

    setLoading(true);
    try {
      await axios.post("/api/answer", {
        questionId: qid,
        answer: answerContent,
        authorId: user.$id,
      });
      toast.success("Answer submitted successfully! ✌️");
      setAnswerContent(""); // clear textarea
      router.refresh(); // refresh answers
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit answer 😬");
    } finally {
      setLoading(false);
    }
  };

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

        {/* Navbar */}
        <nav className="w-full px-6 py-6 flex justify-center items-center">
          <div className="flex gap-4 border border-white/30 rounded-full px-6 py-2 backdrop-blur-sm">
            <NavItem href="/dashboard" text="Dashboard" />
            <NavItem href="/questions" text="Questions" />
            <NavItem href="/logout" text="Logout" />
          </div>
        </nav>

        {/* Ask Question Button */}
        <div className="relative isolate z-50 ml-210">
          <button className="askq mt-30" onClick={routing}>
            Ask a Question
          </button>
        </div>

        {/* Existing answers */}
        <FetchAnswers qid={qid} />

        {/* ⬇ Create Answer Section */}
        <div className="mt-6 border-t border-white/30 pt-4">
          <textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="Write your answer here..."
            className="w-full p-3 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={5}
          />
          <button
            onClick={handleCreateAnswer}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-600 transition"
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </button>
        </div>
      </div>
    </TracingBeam>
  );
}
