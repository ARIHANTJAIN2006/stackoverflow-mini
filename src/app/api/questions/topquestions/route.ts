import { db, questionCollection, votesCollection } from "@/models/name"
import { database } from "@/models/server/config"
import { Query } from "node-appwrite"

export async function GET() {
  // Fetch votes & questions
  const votesDoc = await database.listDocuments(db, votesCollection, [
    Query.equal("type", "question"),
  ]);
  const questionsDoc = await database.listDocuments(db, questionCollection);

  // Step 1: Create a map of questionId -> voteCount
  const voteCountMap: Record<string, number> = {};

  votesDoc.documents.forEach((v: { typeid: string; voteStatus: string; }) => {
    const { typeid, voteStatus } = v;
    if (!voteCountMap[typeid]) voteCountMap[typeid] = 0;
    if (voteStatus === "upvoted") voteCountMap[typeid]++;
    else if (voteStatus === "downvoted") voteCountMap[typeid]--;
  });

  // Step 2: Attach vote counts to questions
  const questionsWithVotes = questionsDoc.documents.map((q: { $id: string | number; }) => ({
    ...q,
    voteCount: voteCountMap[q.$id] || 0,
  }));

  // Step 3: Sort by votes descending
  questionsWithVotes.sort((a: { voteCount: number; }, b: { voteCount: number; }) => b.voteCount - a.voteCount);

  // Step 4: Take top 5
  const topQuestions = questionsWithVotes.slice(0, 5);

  return new Response(JSON.stringify(topQuestions), { status: 200 });
}
