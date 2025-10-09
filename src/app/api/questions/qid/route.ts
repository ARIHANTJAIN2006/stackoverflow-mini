import { answerCollection, db, questionCollection} from "@/models/name";
import { database} from "@/models/server/config";


import {NextRequest,NextResponse} from "next/server"
import { Query } from "node-appwrite";
export async function POST(request:NextRequest){
    try{
      const message = "Unanswered"
   const {qid} = await request.json()
   const response = await database.listDocuments(db,answerCollection,[
  Query.equal("questionId", qid)
])
   const res = await database.getDocument(db,questionCollection,qid)

   const questiontitle = res.title
   const questioncontent = res.content
   const answers = response.documents
   if(response.total === 0){
   return NextResponse.json({data:{message,questiontitle,questioncontent},success:true},{status:200})
   }
   return NextResponse.json({data:{answers,questiontitle,questioncontent},success:true},{status:200})
    }catch(error:unknown){
      console.error("Error in /api/questions/qid:", error);

      let message = 'Internal Server Error';
                    
              if (error instanceof Error) {
                message = error.message;
              }
            
              return NextResponse.json({ error: message }, { status: 500 });
    }
}