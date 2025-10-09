import {env} from "@/env"
import { Client,Account,Avatars,Databases,Storage } from "appwrite";

const client = new Client()
    .setEndpoint(env.appwrite.endpoint!)
    .setProject(env.appwrite.projectId!);


const account = new Account(client)
const database = new Databases(client)
const storage = new Storage(client)
const avatars= new Avatars(client)
 
export {account,database,storage,avatars}
