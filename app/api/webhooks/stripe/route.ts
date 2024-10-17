import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createorupdatesubscription, updatepoints } from "@/utils/db/actions";
console.log("h1")

const stripe = new Stripe(process.env.SECRET_API_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  if (!signature) {
    return NextResponse.json({ error: "No Stripe signature" }, { status: 404 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const subscriptionId = session.subscription as string;

    if (!userId || !subscriptionId) {
      console.error("Missing userId or subscriptionId in session", { session });
      return NextResponse.json({ error: "Invalid session data" }, { status: 400 });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      if (!subscription.items.data.length) {
        console.error("No items found in subscription", { subscription });
        return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 });
      }

      const priceId = subscription.items.data[0].price.id;
      let plan: string;
      let pointsToAdd: number;

      // Map price IDs to plan names and points
      switch (priceId) {
        case "price_1Q9px9JnUVBJvrgj1tunSykk":
          plan = "Basic";
          pointsToAdd = 100;
          break;
        case "price_1Q9pbmJnUVBJvrgjNBl0YCSM":  
          plan = "Pro";
          pointsToAdd = 500;
          break;
        default:
          console.error("Unknown price ID", { priceId });
          return NextResponse.json({ error: "Unknown price ID" }, { status: 400 });
      }

      const updatedsub=await createorupdatesubscription(
        userId,
        subscriptionId,
        plan,
        "active",
        new Date(subscription.current_period_start*1000),
        new Date(subscription.current_period_end*1000))
        if (!updatedsub) {
            console.error("Failed to create or update subscription");
            return NextResponse.json(
              { error: "Failed to create or update subscription" },
              { status: 500 }
            );
          }
          console.log("h2")

          await updatepoints(userId,pointsToAdd)

    } catch (e) {
      console.error("Error retrieving subscription:", e);
      return NextResponse.json({ error: "Error retrieving subscription" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
