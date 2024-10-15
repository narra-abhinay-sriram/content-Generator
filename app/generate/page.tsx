'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select,SelectItem,SelectTrigger,SelectValue,SelectContent } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Clock, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Generatecontent(){


return(
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white">
        <Navbar/>
        <div className="container mx-auto px-4 mb-8 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-14">
                <div className="lg:col-span-1 bg-gray-800 rounded-2xl p-6 overflow-y-auto h-[calc(100vh-12rem)]">
                    <div className="flex items-center justify-between mb-6 ">
                        <h2 className="text-2xl font-semibold text-blue-400">History</h2>
                        <Clock className="h-6 w-6 text-blue-500"/>
                    </div>


                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-800 p-6 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center">
                            <Zap className="w-8 h-8 text-yellow-400 mr-3" />
                            <div>
                            <p className="text-sm text-gray-400">Available Points</p>
                              <p className="text-2xl font-bold text-yellow-400">
                                 {0}
                                  </p>
                            </div>
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-full transition-colors">
                             <Link href="/pricing">Get More Points</Link>
                             </Button>
                             </div>
                    <div className="bg-gray-600 p-6 rounded-2xl space-y-6">

                    </div>

                </div>

            </div>

        </div>

    </div>
)

}