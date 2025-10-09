import { db, questionCollection } from "@/models/name";
import { database } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function POST(request:NextRequest){
    try{
    const { userId } = await request.json();
    const response = await database.listDocuments(
        db,questionCollection,[
            Query.equal("authorId",userId),
        ]
    );
    if(response.documents.length === 0) {
        return NextResponse.json({ message: "No questions found for this user." }, { status: 404 });
    }
    const questions = response.documents
    
    return NextResponse.json({data:questions});
}catch(error:unknown){
    console.error("Error in /api/questions/userquestions:", error);

    let message = 'Internal Server Error';
                    
    if (error instanceof Error) {
        message = error.message;
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
}
}