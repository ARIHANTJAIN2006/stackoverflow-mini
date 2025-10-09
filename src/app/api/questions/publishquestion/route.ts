import { NextRequest, NextResponse } from "next/server";
import {database} from "@/models/server/config";
import {db, questionCollection} from "@/models/name";
import { ID } from "node-appwrite";

export async function POST(request:NextRequest){
    try{
        const {title,content,userId} = await request.json();
        const newquestion = await database.createDocument(db,questionCollection,ID.unique(),
            {
                content:content,
                title:title,
                tags:[],
                authorId:userId,
                attachmentId:[]
            }
        )
        
        return NextResponse.json({data:newquestion,success:true}, {status:200});
    } catch (error: unknown) {
        console.error("Error in publish question:", error);
        let message = 'Internal Server Error';
        
        if (error instanceof Error) {
            message = error.message;
        }
        
        return NextResponse.json({ error: message }, { status: 500 });
    }
}