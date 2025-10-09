"use client";

import React from "react";
import { ChevronUp } from "lucide-react";

export default function UpvoteButton({
  voted,
  onClick,
}: {
  voted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-full border flex items-center justify-center
        transition-colors duration-200
        ${voted ? "bg-blue-100 border-blue-300 text-blue-600" : "bg-transparent border-zinc-700 text-zinc-400 hover:text-white"}`}
    >
      <ChevronUp size={25} />
    </button>
  );
}
