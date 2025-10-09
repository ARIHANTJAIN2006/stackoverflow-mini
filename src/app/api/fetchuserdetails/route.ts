import { users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
export async function POST (request:NextRequest){
try {
    const { authorId } = await request.json();
    const res = await users.get(authorId); // Appwrite Auth user
    const name = res.name;
    
    return NextResponse.json({ data:name });
  } catch (err:unknown) {
    console.error("error lol",err)
    return NextResponse.json({ error: "User not found or invalid ID" }, { status: 404 });
  }
}