import { Permission, IndexType } from "node-appwrite";
import { db, questionCollection } from "../name";
import { database } from "./config";

export default async function createQuestionCollection() {
  try {
    // Try to get the collection
    await database.getCollection(db, questionCollection);
    console.log("✅ Question collection already exists");
  } catch (error) {
    // Collection doesn't exist, create it
    console.log("🛠️ Creating question collection...");

    try {
      await database.createCollection(
        db,
        questionCollection,
        questionCollection,
        [
          Permission.read("any"),
          Permission.read("users"),
          Permission.create("users"),
          Permission.update("users"),
          Permission.delete("users"),
        ]
      );

      console.log("🎉 Question collection created");

      // Create attributes
      await Promise.all([
        database.createStringAttribute(db, questionCollection, "title", 100, true),
        database.createStringAttribute(db, questionCollection, "content", 10000, true),
        database.createStringAttribute(db, questionCollection, "authorId", 50, true),
        database.createStringAttribute(db, questionCollection, "attachmentId", 100, true, undefined, true),
        database.createStringAttribute(db, questionCollection, "tags", 100, true, undefined, true),
      ]);

      // Create indexes
      await Promise.all([
        database.createIndex(
          db,
          questionCollection,
          "title",
          IndexType.Fulltext,
          ["title"],
          ["asc"]
        ),
        database.createIndex(
          db,
          questionCollection,
          "content",
          IndexType.Fulltext,
          ["content"],
          ["asc"]
        ),
      ]);

      console.log("✅ Attributes and indexes created successfully");
    } catch (err) {
      console.error("⚠️ Failed to create question collection:", err);
    }
  }
}
