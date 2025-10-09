import { db, votesCollection } from "@/models/name";
import { database } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        const {typeid,type,votedById} = await request.json()
        const response  = await database.listDocuments(db,votesCollection,[
            Query.equal("type", type),
            Query.equal("typeId", typeid),
            Query.equal("votedById", votedById)
        ])
        if(!response){
            return NextResponse.json({ data:"Neutral" }, { status: 200 });
        }
        else{
        const voteStatus = response.documents[0].voteStatus;
        return NextResponse.json({data:voteStatus,success:true}, { status: 200 });
        }
    } catch (error: unknown) {
        console.error("Error in /status-check:", error);
        
        let message = 'Internal Server Error';
        if (error instanceof Error) {
        message = error.message;
        }
        
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
