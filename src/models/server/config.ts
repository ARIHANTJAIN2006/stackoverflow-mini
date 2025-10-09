import {env} from '@/env'
import {Storage,Users,Avatars,Client,Databases} from "node-appwrite"

const client = new Client();
client.setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(env.appwrite.apikey) // Your secret API key
;
const users = new Users(client)
const database = new Databases(client)
const storage = new Storage(client)
const avatars= new Avatars(client)
 
export {users,database,storage,avatars}