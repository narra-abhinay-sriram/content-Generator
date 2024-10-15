import {eq,sql,desc} from "drizzle-orm"
import {db} from "./dbconfig"
import { Users,Subscribers,Generatedcontent } from "./schema"
export async function createorupdateuser (clerkuserid:string,name:string,email:string){
    try{
        const [existingUser]=await db.select().from(Users).where(eq(Users.stripecutomerid,clerkuserid)).limit(1).execute()
        if(existingUser){
            const [updateduser]=await db.update(Users).set({name,email}).where(eq(Users.stripecutomerid,clerkuserid)).returning()
            console.log(updateduser)
            return updateduser
        }
        const [newuser]=await db.insert(Users).values({email,name,stripecutomerid:clerkuserid,points:50}).returning().execute()
        console.log("new user created",newuser)

    }catch(e){
        console.error('error creating or updating user',e)
        return null

    }
}


export async function createorupdatesubscription(
    userId:string,
    stripesubscriptionid:string,
    plan:string,
    status:string,
    currentstart:Date,
    currentend:Date
){
    try{
        const [user]=await db.select({id:Users.id}).from(Users).where(eq(Users.stripecutomerid,userId)).limit(1)
        if (!user) {
            console.error(`No user found with stripeCustomerId: ${userId}`);
            return null;
          }

          const existingsub=await db.select().from(Subscribers).where(eq(Subscribers.stripesubscriptionid,stripesubscriptionid)).limit(1)
          let subscription
          if(existingsub)
          {
            [subscription]=await db.update(Subscribers).set({plan,status,currentstart,currentend}).where(eq(Subscribers.stripesubscriptionid,stripesubscriptionid)).returning().execute()
          }else{
            [subscription]=await db.insert(Subscribers).values({userid:user.id,stripesubscriptionid,plan,status,currentstart,currentend}).returning().execute()
          }
          return subscription
      

    }catch(e){
        console.error("Error creating or updating subscription:", e);
    return null;
    }
}

export async function updatepoints(userId:string,points:number){


try{
    const [updateduser]=await db.update(Users).set({points:sql`${Users.points} + ${points}`}).where(eq(Users.stripecutomerid,userId)).returning().execute()
    return updateduser

}catch(e){
    console.error("Error updating user points:", e);
    return null;

}


}