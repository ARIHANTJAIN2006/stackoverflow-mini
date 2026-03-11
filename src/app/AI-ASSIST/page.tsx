"use client";
import { useState } from "react";
import axios from "axios";
import { Particles } from "@/components/magicui/particles";
import { useAuthStore } from "@/store/Auth";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIASSISTPage() {
  const { user } = useAuthStore();
  const userId = user?.$id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const enterHandler = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    setLoading(true);

    try {
      const response = await axios.post("/api/AiAssist", {
        content: userMessage,
        userId,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.response,
        },
      ]);
    } catch (err: any) {
      let errorMessage = "Something went wrong. Try again.";

      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.error ||
          err.response?.statusText ||
          "Server error";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${errorMessage}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white p-4">
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={500}
        ease={150}
        color="#ffffff"
        refresh
      />

      <div className="relative z-10 flex flex-col gap-3 max-w-2xl mx-auto mb-20">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] px-4 py-2 rounded-xl text-sm
              ${
                msg.role === "user"
                  ? "ml-auto bg-blue-600 text-right"
                  : "mr-auto bg-gray-800 text-left"
              }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* INPUT BAR */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl flex gap-2 px-4 z-10">
        <input
          className="flex-1 rounded-lg px-4 py-2 text-black"
          type="text"
          placeholder={
            loading ? "AI is thinking..." : "Enter your message"
          }
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enterHandler()}
        />
        <button
          onClick={enterHandler}
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
