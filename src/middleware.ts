
import {NextResponse} from "next/server"
import  getorcreateDB  from "./models/server/dbSetup";
import getorcreatebucket from './models/server/storageSetup'



export async function middleware(){
    await Promise.all([
        getorcreateDB(),
        getorcreatebucket()
    ])
    
return NextResponse.next();
}


export const config = {
  matcher: [
    /*
      Match all paths except:
      - /api/*
      - /_next/static/*
      - /_next/image/*
      - /favicon.ico
    */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};


