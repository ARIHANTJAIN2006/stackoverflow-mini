import {Permission} from "node-appwrite"
import {db,answerCollection} from "../name"
import {database} from "./config"

export default async function createanswerCollection(){
    await database.createCollection(db,
        answerCollection
        ,answerCollection,
        [
            Permission.create("users"),
            Permission.delete("users"),
            Permission.update("users"),
            Permission.read("any"),
            Permission.read("users"),

        ]
    )
    await Promise.all([
        database.createStringAttribute(db,answerCollection,"content",10000,true),
        database.createStringAttribute(db,answerCollection,"questionId",50,true),
        database.createStringAttribute(db,answerCollection,"authorId",50,true)
    ])
}