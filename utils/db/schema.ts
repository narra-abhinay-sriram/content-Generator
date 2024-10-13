import {pgTable,integer,serial,timestamp,varchar,text,boolean} from 'drizzle-orm/pg-core'

export const Users=pgTable('users',{
    id:serial('id').primaryKey(),
    stripecutomerid:text('stripe_cutomer_id').unique(),
    email:text('email').notNull().unique(),
    name:text('name'),
    points:integer('points').default(50),
    createdAt:timestamp('created_at').defaultNow()
})

export const Subscribers=pgTable('subscribers',{
    id:serial('id').primaryKey(),
    userid:integer('userid').references(()=>Users.id).notNull(),
    stripesubscriptionid:varchar('stripe_subscription_id',{length:255}).notNull(),
    plan:varchar('plan',{length:50}).notNull(),
    currentstart:timestamp('current_start').notNull(),
    currentend:timestamp('current_end').notNull(),
    cancelperiod:boolean('cancelperiod').notNull().default(false)

})

export const Generatedcontent=pgTable('generated_content',{
    id:serial('id').primaryKey(),
    userid:integer('userid').references(()=>Users.id).notNull(),
    content:text('content').notNull(),
    prompt:text('prompt').notNull(),
    contenttype:varchar("content_type",{length:50}).notNull(),
    createdAT:timestamp('created_at').notNull()
})