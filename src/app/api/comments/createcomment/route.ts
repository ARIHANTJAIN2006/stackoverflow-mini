import { commentCollection, db } from "@/models/name";
import { database } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request:NextRequest){
    try {
        const { content, typeId, type, userId } = await request.json();
        const newComment = await database.createDocument(db, commentCollection, ID.unique(), {
            content,
            typeId,
            type,
            authorId: userId,
        });

        return NextResponse.json({ data: newComment }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error in create comment:", error);
        let message = 'Internal Server Error';
        
        if (error instanceof Error) {
            message = error.message;
        }
        
        return NextResponse.json({ error: message }, { status: 500 });
    }

}