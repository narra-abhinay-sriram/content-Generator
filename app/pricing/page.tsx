'use client'

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { ne } from "drizzle-orm";


const pricingPlans = [
    {
      name: "Basic",
      price: "1",
      priceId: "price_1Q9px9JnUVBJvrgj1tunSykk",
      features: [
        "100 AI-generated posts per month",
        "Twitter thread generation",
        "Basic analytics",
      ],
    },
    {
      name: "Pro",
      price: "2",
      priceId: "price_1Q9pbmJnUVBJvrgjNBl0YCSM",
      features: [
        "500 AI-generated posts per month",
        "Twitter, Instagram, and LinkedIn content",
        "Advanced analytics",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      priceId: '',
      features: [
        "Unlimited AI-generated posts",
        "All social media platforms",
        "Custom AI model training",
        "Dedicated account manager",
      ],
    },
  ];

  export default function PricingPage(){
    const {user,isSignedIn}=useUser()
    const [isload,setisload]=useState(false)
    const handlesubscribe=async(priceId:string)=>{

        if(!isSignedIn)
        {
            return user
        }
        setisload(true)
        try{

            const resp=await fetch('/api/create-checkout-session',
                {method:'POST',
                    headers:{"Content-Type": "application/json"},
                    body:JSON.stringify({
                        priceId,userId:user?.id
                    })})
                    if (!resp.ok) {
                        const errorData = await resp.json();
                        throw new Error( "Failed to create checkout session");
                      }
                      const {sessionId}=await resp.json()
                      console.log(sessionId)
                      const stripe=await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
                      console.log(stripe)
                      if(!stripe)
                      {
                        throw new Error ("failed to load stripe")

                      }
                      console.log("hi3")

                      await stripe.redirectToCheckout({sessionId})


        }catch(e){
            console.error("Error creating session"+e)

        }finally{
            setisload(false)
        }

    }

    return(
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="container mx-auto px-8 py-20">
                <h1 className="text-5xl font-bold text-center text-white mb-12">
                    Pricing Plans

                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {
                        pricingPlans.map((plan,index)=>(
                            <div key={index}
                    className="p-8 rounded-lg border border-gray-800 flex flex-col">
               <h2 className="text-2xl font-bold mb-4 text-white">
                {plan.name}
              </h2>
              <p className="text-4xl font-bold mb-6 text-white">
              ${plan.price}
                <span className="text-lg font-normal text-gray-400">
                  /month
                </span>
              </p>
              <ul className="mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center mb-3 text-gray-300"
                  >
                    <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
              onClick={()=>handlesubscribe(plan.priceId)}
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isload || !plan.priceId}
              >
                {isload ?"processing.." :"choose plan"}
              </Button>
              
              
              </div>
                        ))
                    }

                </div>
            </main>

        </div>
    )
  }
  