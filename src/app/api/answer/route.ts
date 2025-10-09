import {NextRequest,NextResponse} from "next/server"
import {database,users} from "@/models/server/config"
import { answerCollection, db } from "@/models/name";
import { ID } from "node-appwrite";

export async function POST(request:NextRequest){
    try{
    const {questionId,answer,authorId} = await request.json()
    const response = await database.createDocument(db,answerCollection,ID.unique(),{
        content:answer,
        authorId:authorId,
        questionId:questionId
    })
   const prefs = await users.getPrefs(authorId)
   await users.updatePrefs(authorId,{
    reputation:Number(prefs.reputation) + 1
   })
   return NextResponse.json(response,{status:201})
    }catch(error:unknown){
     let message = 'Internal Server Error';

  if (error instanceof Error) {
    message = error.message;
  }

  return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request:NextRequest){
    try{
    const {answerId} = await request.json()
    const answer = await database.getDocument(db,answerCollection,answerId)
    if (!answer) {
  return NextResponse.json({ error: "Answer not found" }, { status: 404 });
}
    const response = await database.deleteDocument(db,answerCollection,answerId)
    const prefs = await users.getPrefs(answer.authorId)
  await users.updatePrefs(answer.authorId,{
    reputation:Number(prefs.reputation) - 1
   })
   return NextResponse.json({data:response},{status:201})
    }catch(error:unknown){
        let message = 'Internal Server Error';

  if (error instanceof Error) {
    message = error.message;
  }

  return NextResponse.json({ error: message }, { status: 500 });
    }
}