"use client";
import axios from "axios";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react"; // Lucide icon for trash
import "@/styles/borderstyle.css"

interface CommentSectionProps {
  parentId: string;
  type: "question" | "answer";
  userId: string;
}

export function FetchComments({ parentId, type, userId }: CommentSectionProps) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState<
    { $id: string; authorId: string; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComment, setNewComment] = useState("");

  const toggleComments = async () => {
    if (commentsVisible) {
      setCommentsVisible(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/comments/fetchcomments", {
        typeId: parentId,
        type,
        userId,
      });

      if (response.status === 200) {
        setComments(response.data.data);
        setCommentsVisible(true);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post("/api/comments/addcomment", {
        content: newComment,
        typeId: parentId,
        type,
        userId,
      });

      if (response.status === 200) {
        setComments((prev) => [...prev, response.data.data]);
        setNewComment("");
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await axios.post("/api/comments/deletecomment", {
        commentId,
        userId,
      });

      if (response.status === 200) {
        setComments((prev) => prev.filter((c) => c.$id !== commentId));
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="comments-section mt-4">
       <div className="relative isolate z-50 flex gap-2">
        <button
          onClick={toggleComments}
          className="btn"
        >
          {loading ? "Loading..." : commentsVisible ? "Hide Comments" : "View Comments"}
        </button>

        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="btn"
        >
          {showAddForm ? "Cancel" : "Add Comment"}
        </button>
      </div>

      {showAddForm && (
        <div className="mt-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your comment..."
            className="w-full p-2 bg-zinc-800 text-white rounded"
          />
          <button
            onClick={handleAddComment}
            className="post-comment-btn mt-2 px-4 py-2 "
          >
            Post Comment
          </button>
        </div>
      )}

      {commentsVisible && (
        <div className="space-y-3 mt-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.$id} className="bg-zinc-800 p-3 rounded flex justify-between items-start group">
                <div>
                  <p>{comment.content}</p>
                  <span className="text-xs text-yellow-400">By: {comment.authorId}</span>
                </div>

                {/* Delete button for own comments */}
                {comment.authorId === userId && (
                  <button
                    onClick={() => handleDeleteComment(comment.$id)}
                    className="ml-2 text-red-500 hover:scale-125 transition-transform duration-200"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 mt-2">No comments available</p>
          )}
        </div>
      )}
      <Separator className="bg-zinc-700 h-[1px] mt-2" />
    </div>
  );
}
