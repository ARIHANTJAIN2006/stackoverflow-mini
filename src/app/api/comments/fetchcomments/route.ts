import { commentCollection, db } from "@/models/name";
import { database } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function POST(request:NextRequest){
    try{
    const { typeId, type } = await request.json();
    const response = await database.listDocuments(db,commentCollection,[
        Query.equal("typeId", typeId),
        Query.equal("type", type),
    ])
    const comments = response.documents
    if(!comments){
       
        return NextResponse.json({data:"No comments found"}, {status:404})
    }
    else{
        return NextResponse.json({data:comments}, {status:200})
    }

    }
    
    catch(error:unknown){
        console.error("error in fetch comments:  ",error)
                    let message = 'Internal Server Error';
                    
              if (error instanceof Error) {
                message = error.message;
              }
            
              return NextResponse.json({ error: message }, { status: 500 });
    }
}