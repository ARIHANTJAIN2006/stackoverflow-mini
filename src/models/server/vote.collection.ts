import { Permission } from "node-appwrite";
import { votesCollection, db } from "../name";
import { database } from "./config";

export default async function createVoteCollection() {
  try {
    // Check if the collection already exists
    await database.getCollection(db, votesCollection);
    console.log("✅ Votes collection already exists");
  } catch (error) {
    // Collection doesn't exist, create it
    console.log("🛠️ Creating votes collection...");

    try {
      await database.createCollection(
        db,
        votesCollection,
        votesCollection,
        [
          Permission.create("users"),
          Permission.delete("users"),
          Permission.update("users"),
          Permission.read("users"),
          Permission.read("any"),
        ]
      );

      console.log("🎉 Votes collection created");

      // Create attributes
      await Promise.all([
        database.createEnumAttribute(db, votesCollection, "type", ["question", "answer"], true),
        database.createStringAttribute(db, votesCollection, "typeId", 50, true),
        database.createEnumAttribute(db, votesCollection, "voteStatus", ["downvoted", "upvoted"], true),
        database.createStringAttribute(db, votesCollection, "votedById", 50, true),
      ]);

      console.log("✅ Votes collection attributes created successfully");
    } catch (err) {
      console.error("⚠️ Failed to create votes collection:", err);
    }
  }
}
