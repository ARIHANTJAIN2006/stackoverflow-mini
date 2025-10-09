import {db} from "../name"
import createanswerCollection from "./answer.collection"
import createcommentCollection from "./comment.collection"
import createquestioncollection from "./question.collection"
import getorcreatebucket from './storageSetup'
import createvotesCollection from "./vote.collection"
import {database} from "./config"

export default async function getorcreateDB(){
    try{
        await database.get(db)
        console.log("database connection")
    }catch(error){
        try{
              console.error("Oops:", error);

            await database.create(db,"stackoverflow DB")
            console.log("database created")
            await Promise.all([
                createquestioncollection(),
                createcommentCollection(),
                createanswerCollection(),
                createvotesCollection(),
                getorcreatebucket(),

            ])
            console.log("collections created")
        }catch(error:unknown){
            if(error instanceof Error){
                console.log("Error creating databases or collections",error.message)
            }
            else{
                console.log("Error creating databases or collections",error)
            }
            
        }
    }
    return database
}