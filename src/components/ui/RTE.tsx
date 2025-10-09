'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Editor from '@uiw/react-md-editor';

// Dynamically import the Markdown Editor to avoid SSR issues
const RTE = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export const MarkdownPreview = Editor.Markdown;

export default function AskQuestion() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState<string | undefined>(''); // markdown content

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // You can now send `title` and `body` to your backend (e.g. via fetch or axios)
    console.log('Title:', title);
    console.log('Body:', body);

    // Reset form (optional)
    setTitle('');
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Ask a Question</h1>

      <input
        type="text"
        placeholder="Enter your question title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 text-lg border rounded-lg bg-zinc-800 text-white placeholder:text-zinc-400"
        required
      />

      <div className="bg-zinc-900 text-white p-2 rounded-md">
        <RTE
          value={body}
          onChange={setBody}
          height={300}
        />
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
      >
        Submit Question
      </button>
    </form>
  );
}
