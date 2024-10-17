import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe =new Stripe(process.env.SECRET_API_KEY!,{
    apiVersion:"2024-09-30.acacia"
})  

export async function POST (req:Request){
    try{
         const {priceId,userId}=await req.json()
         if(!priceId || !userId)
         {
            return NextResponse.json({error:"missing price or userid",status:400})
         }
         const session=await stripe.checkout.sessions.create({
            mode:'subscription',
            payment_method_types:['card','amazon_pay','paypal'],
            line_items:[{
                price:priceId,
                quantity:1,
            },
        ],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/generate?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
        client_reference_id: userId,
         })
         return NextResponse.json({sessionId:session.id})

    }catch(error:any){
        return NextResponse.json( { error: "Error creating checkout session", details: error.message },
            { status: 500 })

    }
}
