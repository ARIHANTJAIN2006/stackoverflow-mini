import {Permission} from "node-appwrite"
import {db,commentCollection} from "../name"
import {database} from "./config"

export default async function createcommentCollection(){
    await database.createCollection(db,
        commentCollection
        ,commentCollection,
        [
            Permission.create("users"),
            Permission.delete("users"),
            Permission.update("users"),
            Permission.read("any"),
            Permission.read("users"),

        ]
    )
    await Promise.all([
        database.createStringAttribute(db,commentCollection,"content",10000,true),
        database.createEnumAttribute(db,commentCollection,"type",["question","answer"],true),
        database.createStringAttribute(db,commentCollection,"typeId",50,true),
        database.createStringAttribute(db,commentCollection,"authorId",50,true)
    ])
}