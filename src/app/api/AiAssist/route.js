import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { userProfileCollection,db } from "@/models/name";
import { database} from "@/models/server/config";
import { Permission } from "node-appwrite";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const { content, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    let credits = 0;
    const now = Date.now();

    try {
      const userProfile = await database.getDocument(
        db,
        userProfileCollection,
        userId
      );

      credits = userProfile.credits ?? 0;
      const lastReset = new Date(userProfile.lastReset);

      if (now - lastReset.getTime() > 24 * 60 * 60 * 1000) {
        await database.updateDocument(
          db,
          userProfileCollection,
          userId,
          {
            credits: 5,
            lastReset: new Date().toISOString(),
          }
        );
        credits = 5;
      }

      if (credits <= 0) {
        return NextResponse.json(
          { error: "Insufficient credits" },
          { status: 403 }
        );
      }
    } catch {
      await database.createDocument(
        db,
        userProfileCollection,
        userId,
        {
          credits: 5,
          lastReset: new Date().toISOString(),
          userId,
        },
        [
          Permission.read(`user:${userId}`),
          Permission.update(`user:${userId}`),
        ]
      );

      credits = 5;
    }

    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: content,
    });

    if (!response?.text) {
      throw new Error("No response from AI");
    }


    await database.updateDocument(
      db,
      userProfileCollection,
      userId,
      { credits: credits - 1 }
    );

    return NextResponse.json({ response: response.text });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
