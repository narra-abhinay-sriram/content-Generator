import { url } from "inspector";

export default{
    dialect:'postgresql',
    schema:'./utils/db/schema.ts',
    out:',/drizzle',
    dbCredentials:{
        url:'postgresql://neondb_owner:Y96HnqCKUDBA@ep-wispy-lab-a17djfuh.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
        connectionString:'postgresql://neondb_owner:Y96HnqCKUDBA@ep-wispy-lab-a17djfuh.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
    }
}