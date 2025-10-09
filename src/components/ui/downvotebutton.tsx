"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export default function DownvoteButton({
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
        ${voted ? "bg-red-100 border-red-300 text-red-600" : "bg-transparent border-zinc-700 text-zinc-400 hover:text-white"}`}
    >
      <ChevronDown size={25} />
    </button>
  );
}
