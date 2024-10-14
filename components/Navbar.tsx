'use client'
import Link from "next/link"
import { Menu, X, Zap } from "lucide-react"
import { SignInButton,SignUpButton, UserButton,SignedIn,SignedOut,useAuth} from "@clerk/nextjs" 
import { useState } from "react"

export const Navbar=()=>{
    const {userId}=useAuth()
    const [ismenuopen,setismenuopen]=useState(false)
    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-100 bg-black">
            <nav className="container mx-auto px-4 py-4 sm:py-6 sm:px-8">
            <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center">
                <Link href={'/'} className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-blue-500"/>
                <span className="text-xl sm:text-2xl text-white font-bold">Neura Nova AI</span>
                </Link>

            </div>
            <button className="sm:hidden text-white focus:outline-none" onClick={()=>setismenuopen(!ismenuopen)}> 
                { ismenuopen? (<X className='w-6 h-6' />) : (<Menu className="w-6 h-6" />)}
            </button>
            <div className={`w-full sm:w-auto ${ismenuopen ? 'block' : 'hidden'} mt-4 sm:block sm:mt-0`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
                    {
                        ['Features','Pricing','Docs'].map((item)=>(
                            <Link href={`${item.toLowerCase( )}`} key={item} className="text-gray-400 hover:text-white py-2 sm:p-0 relative group hover:underline ">
                            {item}
                            </Link>
                        ))
                    }
                    {
                        userId && <Link href={`/generate`} className="text-gray-400 hover:text-white py-2 sm:p-0 relative group hover:underline ">
                        dashboard
                        </Link>
                    }
                    <SignedOut>

                        <SignInButton mode="modal">
                            <button className="text-gray-300 hover:text-white transition-colors mt-2 sm:mt-0">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                           <button className="bg-blue-700 hover:bg-blue-800 px-3 py-3 rounded-lg text-white transition-colors mt-2 sm:mt-0">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton appearance={{elements:{avatarBox:'w-10 h-10'}}}>

                        </UserButton>
                    </SignedIn>

                </div>

            </div>

            </div>
            </nav>
            
        </header>
    )

}