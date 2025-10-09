
export const env = {
    appwrite:{
        endpoint:String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
        projectId:process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
        apikey:process.env.APPWRITE_PROJECT_KEY
    }
}
