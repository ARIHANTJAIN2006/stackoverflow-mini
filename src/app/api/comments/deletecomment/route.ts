import { commentCollection, db } from "@/models/name";
import { database } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { commentId} = await request.json();
        const deleteddocument = await database.deleteDocument(db, commentCollection,commentId);

        return NextResponse.json({ data: deleteddocument,success:true}, { status: 200 });
    } catch (error: unknown) {
        console.error("Error in delete comment:", error);
        let message = 'Internal Server Error';
        if (error instanceof Error) {
            message = error.message;
        }
        
        return NextResponse.json({ error: message }, { status: 500 });
    }
}