import {Permission} from "node-appwrite"
import {questionAttachmentcollection} from "../name"
import {storage} from "./config"

export default async function getorcreatebucket(){
    try{
    await storage.getBucket(questionAttachmentcollection)
    console.log("Storage connected")
    }catch(error){
    try{
          console.error("Oops:", error);

        await storage.createBucket(questionAttachmentcollection,
            questionAttachmentcollection,
            [
                Permission.create("users"),
                Permission.read("users"),
                Permission.update("users"),
                Permission.delete("users"),
                Permission.read("any")
            ],
            false,
            undefined,
            undefined,
            ["jpg","png","gif","jpeg","webp","heic"]
        )
        console.log("Storage created and connected")
    }catch(error:unknown){
        if(error instanceof Error){
            console.log("Error creating storage",error.message)
        }
        else{
            console.log("Error creating storage",error)
        }
    }
    }
}