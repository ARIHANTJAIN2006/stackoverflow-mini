import { Permission } from "node-appwrite";
import { db, commentCollection } from "../name";
import { database } from "./config";

export default async function createCommentCollection() {
  try {
    // Check if the collection already exists
    await database.getCollection(db, commentCollection);
    console.log("✅ Comment collection already exists");
  } catch (error) {
    // Collection doesn't exist, create it
    console.log("🛠️ Creating comment collection...");

    try {
      await database.createCollection(
        db,
        commentCollection,
        commentCollection,
        [
          Permission.create("users"),
          Permission.delete("users"),
          Permission.update("users"),
          Permission.read("any"),
          Permission.read("users"),
        ]
      );

      console.log("🎉 Comment collection created");

      // Create attributes
      await Promise.all([
        database.createStringAttribute(db, commentCollection, "content", 10000, true),
        database.createEnumAttribute(db, commentCollection, "type", ["question", "answer"], true),
        database.createStringAttribute(db, commentCollection, "typeId", 50, true),
        database.createStringAttribute(db, commentCollection, "authorId", 50, true),
      ]);

      console.log("✅ Comment collection attributes created successfully");
    } catch (err) {
      console.error("⚠️ Failed to create comment collection:", err);
    }
  }
}
