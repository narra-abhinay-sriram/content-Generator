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
    const [updateduser]=await db.update(Users).set({ points: sql`${Users.points} + ${points}` }).where(eq(Users.stripecutomerid,userId)).returning().execute()
    return updateduser

}catch(e){
    console.error("Error updating user points:", e);
    return null;

}


}

export async function savegencontent(userId:string,content:string,prompt:string,contenttype:string){


try{
    const [user] = await db
            .select({ id: Users.id })
            .from(Users)
            .where(eq(Users.stripecutomerid, userId))
            .limit(1)
            .execute();

        if (!user) {
            console.error(`No user found with stripeCustomerId: ${userId}`);
            return null;
        }
        const [savedcontent] = await db
        .insert(Generatedcontent)
        .values({
            userid: user.id,  // Use the fetched user ID
            content,
            prompt,
            contenttype,
            createdAT: new Date(),
        })
        .returning()
        .execute();

    return savedcontent;
}catch(e){
    console.error("Error saving generated content:", e);
    return null;
}

}

export async function getuserpoints(userId:string){
    try{
        const users=await db.select({points:Users.points,id:Users.id,email:Users.email}).from(Users).where(eq(Users.stripecutomerid,userId)).execute()
    
        if(users.length===0){
            return 0

        }
        return users[0].points
    } catch (error) {
        console.error("Error fetching user points:", error);
        return 0;
      }
}

export async function getGencontentHistory(userId:string,limit:number=10){
    try{


        const [user] = await db
        .select({ id: Users.id })
        .from(Users)
        .where(eq(Users.stripecutomerid, userId))
        .limit(1)
        .execute();

    if (!user) {
        console.error(`No user found with stripeCustomerId: ${userId}`);
        return [];
    }
    const history = await db
    .select({
        id: Generatedcontent.id,
        content: Generatedcontent.content,
        prompt: Generatedcontent.prompt,
        contenttype: Generatedcontent.contenttype,
        createdAT: Generatedcontent.createdAT,
    })
    .from(Generatedcontent)
    .where(eq(Generatedcontent.userid, user.id))  // Use user.id directly
    .orderBy(desc(Generatedcontent.createdAT))
    .limit(limit)
    .execute();

return history;


    }
    catch(e){
        console.error("Error fetching generated content history:", e);
    return [];
    }
}