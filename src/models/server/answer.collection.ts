import { Permission } from "node-appwrite";
import { db, answerCollection } from "../name";
import { database } from "./config";

export default async function createAnswerCollection() {
  try {
    // Check if the collection already exists
    await database.getCollection(db, answerCollection);
    console.log("✅ Answer collection already exists");
  } catch (error) {
    // Collection doesn't exist, create it
    console.log("🛠️ Creating answer collection...");

    try {
      await database.createCollection(
        db,
        answerCollection,
        answerCollection,
        [
          Permission.create("users"),
          Permission.delete("users"),
          Permission.update("users"),
          Permission.read("any"),
          Permission.read("users"),
        ]
      );

      console.log("🎉 Answer collection created");

      // Create attributes
      await Promise.all([
        database.createStringAttribute(db, answerCollection, "content", 10000, true),
        database.createStringAttribute(db, answerCollection, "questionId", 50, true),
        database.createStringAttribute(db, answerCollection, "authorId", 50, true),
      ]);

      console.log("✅ Answer collection attributes created successfully");
    } catch (err) {
      console.error("⚠️ Failed to create answer collection:", err);
    }
  }
}
