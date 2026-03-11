import { Permission } from "node-appwrite";
import { db, userProfileCollection } from "../name";
import { database } from "./config";

export default async function createUserProfileCollection() {
  try {
    await database.getCollection(db, userProfileCollection);
    console.log("✅ User profile collection already exists");
  } catch (error) {
    console.log("🛠️ Creating user profile collection...");

    await database.createCollection(
      db,
      userProfileCollection,
      userProfileCollection,
      [
        Permission.read("users"),
        Permission.create("users"),
      ]
    );

    await Promise.all([
      database.createIntegerAttribute(
        db,
        userProfileCollection,
        "credits",
        true
      ),
      database.createDatetimeAttribute(
        db,
        userProfileCollection,
        "lastReset",
        true
      ),
      database.createStringAttribute(db,userProfileCollection,"userId",50,true)
    ]);

    console.log("🎉 User profile collection created successfully");
  }
}
