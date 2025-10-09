import { db, votesCollection } from "@/models/name";
import {answerCollection} from "@/models/name";
import { database, users,} from "@/models/server/config";
import {questionCollection} from "@/models/name";

import {NextRequest,NextResponse} from "next/server"
import { ID } from "node-appwrite";
import { Query } from "node-appwrite";

export async function   POST(request: NextRequest){
            try{
            const {votedById,voteStatus,type,typeId} = await request.json()
            
            const questionoranswer = await database.getDocument(db,type == "question" ? questionCollection:answerCollection,
            typeId
            )
            const response = await database.listDocuments(db,votesCollection,[
                Query.equal("type",type),
                Query.equal("typeId",typeId),
                Query.equal("votedById",votedById)
            ])
            if(response.documents.length >0 ){
            await database.deleteDocument(db,votesCollection,response.documents[0].$id) 
            const authorPrefs = await users.getPrefs(questionoranswer.authorId)
            await users.updatePrefs(questionoranswer.authorId,{
                 reputation:response.documents[0].voteStatus === "upvoted" ? Number(authorPrefs.reputation)-1:Number(authorPrefs.reputation)+1
            })
            }
            if(response.documents.length >0 )
            if(response.documents[0]?.voteStatus !== voteStatus){
                 await database.createDocument(db,votesCollection,ID.unique(),{
                    type,
                    typeId,
                    voteStatus,
                    votedById
                })      
        }
             else{
                      const authorPrefs = await users.getPrefs(questionoranswer.authorId)
            await users.updatePrefs(questionoranswer.authorId,{
                 reputation:voteStatus === "downvoted" ? Number(authorPrefs.reputation)-1:Number(authorPrefs.reputation)+1
            }) }
            if(response.documents.length === 0){
              await database.createDocument(db,votesCollection,ID.unique(),{
                    type,
                    typeId,
                    voteStatus,
                    votedById
              })
              const authorPrefs = await users.getPrefs(questionoranswer.authorId)
              await users.updatePrefs(questionoranswer.authorId,{
                 reputation:voteStatus === "downvoted" ? Number(authorPrefs.reputation)-1:Number(authorPrefs.reputation)+1
            })
            }
            const [upvotes,downvotes] = await Promise.all([
                database.listDocuments(db,votesCollection,[
                    Query.equal("type",type),
                    Query.equal("typeId",typeId),
                    Query.equal("voteStatus","upvoted"),
                    Query.equal("votedById",votedById),
                    Query.limit(1)
                ]),
            
                database.listDocuments(db,votesCollection,[
                    Query.equal("type",type),
                    Query.equal("typeId",typeId),
                    Query.equal("voteStatus","downvoted"),
                    Query.equal("votedById",votedById),
                    Query.limit(1)
            ])
            ])
            return NextResponse.json({
                data:{
                    document:null,
                   voteResult: upvotes.total > downvotes.total ? "upvoted" : downvotes.total > upvotes.total ? "downvoted" : "neutral"

                },
                message:"vote handled"
            },
        {
            status:200
        })
            }catch(error:unknown){
                console.error("qwertykaeoifjajfejffnesnclnrlignslngrlg",error)
                    let message = 'Internal Server Error';
                    
              if (error instanceof Error) {
                message = error.message;
              }
            
              return NextResponse.json({ error: message }, { status: 500 });
}}
