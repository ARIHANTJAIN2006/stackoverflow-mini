import {Permission} from "node-appwrite"
import {votesCollection,db} from "../name"
import {database} from "./config"

export default async function createvotecollection(){
    await database.createCollection(db,votesCollection,votesCollection,
        [
            Permission.create("users"),
            Permission.delete("users"),
            Permission.update("users"),
            Permission.read("users"),
            Permission.read("any")
        ]
    )
    await Promise.all([
        database.createEnumAttribute(db,votesCollection,"type",["question","answer"],true),
        database.createStringAttribute(db,votesCollection,"typeId",50,true),
        database.createEnumAttribute(db,votesCollection,"voteStatus",["downvoted","upvoted"],true),
         database.createStringAttribute(db,votesCollection,"votedById",50,true),
    ])
}
