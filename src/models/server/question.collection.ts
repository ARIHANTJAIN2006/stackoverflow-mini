import {Permission,IndexType} from "node-appwrite"
import {db,questionCollection} from "../name"
import {database} from "./config"

export default async function createquestioncollection(){
    const res= await database.getCollection(db,questionCollection,questionCollection)
    if(res){
        console.log("question collection already exists")
    }
    else{
    await database.createCollection(db,questionCollection,
        questionCollection,[
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users")
]
    )

    console.log("question collection created")
    await Promise.all([
        database.createStringAttribute(db,questionCollection,"title",100,true),
        database.createStringAttribute(db,questionCollection,"content",10000,true),
        database.createStringAttribute(db,questionCollection,"authorId",50,true),
        database.createStringAttribute(db,questionCollection,"attachmentId",100,true,undefined,true),
        database.createStringAttribute(db,questionCollection,"tags",100,true,undefined,true),
    ])
    await Promise.all([
        database.createIndex(
            db,
            questionCollection,
            "title",
            IndexType.Fulltext,
            ["title"],
            ['asc']
        ),
        database.createIndex(
            db,
            questionCollection,
            "content",
            IndexType.Fulltext,
            ["content"],
            ['asc']
        )
    ])
}
}