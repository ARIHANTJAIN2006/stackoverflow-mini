import {db} from "../name"
import createanswerCollection from "./answer.collection"
import createcommentCollection from "./comment.collection"
import createquestioncollection from "./question.collection"
import getorcreatebucket from './storageSetup'
import createvotesCollection from "./vote.collection"
import createUserProfileCollection from "./user_profile.collection"
import {database} from "./config"

export default async function getorcreateDB(){
    try{
        await database.get(db)
        console.log("database connection")
    }catch(error){
        console.error("Oops:", error);
        await database.create(db,"stackoverflow DB")
        console.log("database created")
    }

    await Promise.all([
        createquestioncollection(),
        createcommentCollection(),
        createanswerCollection(),
        createvotesCollection(),
        createUserProfileCollection(),
        getorcreatebucket(),
    ])
    
    console.log("collections ensured")
    return database
}
