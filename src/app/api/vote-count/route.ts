import { db, votesCollection } from "@/models/name";
import { database} from "@/models/server/config";


import {NextRequest,NextResponse} from "next/server"
import { Query } from "node-appwrite";
export async function   POST(request: NextRequest){
    try{
      
          const {typeid,type} = await request.json()
          let votesresultant= 0
          const response = await database.listDocuments(db,
            votesCollection,
            [
             Query.equal("type", type), 
             Query.equal("typeId", typeid) 
            ]
          )
          response.documents.forEach((q: { voteStatus: string; }) => {
           
            if(q.voteStatus === "upvoted")
                votesresultant++
            
                else if(q.voteStatus === "downvoted")
                    votesresultant--
                 
          })
          return  NextResponse.json(
            {data:votesresultant,
            success:true},
            {status:200}
          )
    }catch(error:unknown){
      console.error("aenfofoifioaejfajefopajefpfjpjafoeaoiaeoinfuifnoewn",error)
         let message = 'Internal Server Error';
                    
              if (error instanceof Error) {
                message = error.message;
              }
            
              return NextResponse.json({ error: message }, { status: 500 });
    }
}