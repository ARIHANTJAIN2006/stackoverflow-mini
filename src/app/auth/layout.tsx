"use client"

import {useAuthStore} from "@/store/Auth"
import {useRouter} from "next/navigation"
import React, { useEffect } from "react"
import toast from "react-hot-toast"
const Layout = ({children}:{children:React.ReactNode}) => {
const {session,hydrated} = useAuthStore()
const router = useRouter()
 const isLoggedIn = useAuthStore(state => !!state.jwt);
    
      useEffect(() => {
        if(!hydrated) return
        console.log(isLoggedIn," ",hydrated)
        if (isLoggedIn) {
          
          const interval = setInterval(() => {
            toast.error('You are already logged in');
          }, 1000);
    
          
          setTimeout(() => {
            router.replace('/');
          }, 1000);
    
          // Clean up the interval
          return () => clearInterval(interval);
        }
      }, [isLoggedIn, router,hydrated]);
if(session)
    return null
return(
    <div className = "">
<div className="">{children}</div>
    </div>
)
}
export default Layout
