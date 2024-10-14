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