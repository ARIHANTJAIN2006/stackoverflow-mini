"use client"
import React, { useState } from 'react';
import { Particles } from "@/components/magicui/particles";
import Link from "next/link";

export default function Page() {
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [answersOpen, setAnswersOpen] = useState(false);

  const questionOptions = [
    "My  Questions",
    "Top Questions", 
    "Ask Question"
  ];

  const answerOptions = [
    "My Answers",
    "Top Answers",
  ]
  return (
    <div className="relative overflow-hidden min-h-screen w-full bg-black">
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={500}
        ease={150}
        color="#ffffff"
        refresh
      />
      
      <aside className="w-64 transparent border-r flex flex-col border-zinc-800 p-6 fixed inset-y-0 left-0 z-20">
        <h2 className="text-2xl font-bold mb-4 text-white">Stack It Up</h2>
        
        {/* Horizontal separator line */}
        <hr className="border-zinc-600 mb-6" />
        
        <nav className="flex flex-col space-y-2">
          {/* Questions with dropdown */}
          <div>
            <button
              onClick={() => setQuestionsOpen(!questionsOpen)}
              className="flex items-center justify-between w-full text-white hover:text-amber-200 transition-colors py-2 text-left"
            >
              <span>Questions</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  questionsOpen ? 'rotate-90' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            
            {questionsOpen && (
              <div className="ml-4 mt-2 space-y-2">
                {questionOptions.map((option, index) => (
                  <Link
                    key={index}
                    href={`/questions/${option.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-gray-300 hover:text-sky-300 transition-colors py-1 text-sm"
                  >
                    {option}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Answers with dropdown */}
          <div>
            <button
              onClick={() => setAnswersOpen(!answersOpen)}
              className="flex items-center justify-between w-full text-white hover:text-amber-200 transition-colors py-2 text-left"
            >
              <span>Answers</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  answersOpen ? 'rotate-90' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            
            {answersOpen && (
              <div className="ml-4 mt-2 space-y-2">
                {answerOptions.map((option, index) => (
                  <Link
                    key={index}
                    href={`/answers/${option.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-gray-300 hover:text-sky-300 transition-colors py-1 text-sm"
                  >
                    {option}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* AI Help - simple link without dropdown */}
          <Link 
            href="/ai-help" 
            className="text-white hover:text-amber-200 transition-colors py-2"
          >
            AI Help
          </Link>
        </nav>
      </aside>
    </div>
  );
}