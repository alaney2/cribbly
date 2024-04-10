import { pgTable } from "@/db/utils"
import { sql } from "drizzle-orm"
import { numeric, pgEnum, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { databasePrefix } from "@/lib/constants"
import { generateId } from "@/lib/utils"
import { int } from "drizzle-orm/mysql-core"

export const statusEnum = pgEnum(`${databasePrefix}_status`, [
  "todo",
  "in-progress",
  "done",
  "canceled",
])

export const priorityEnum = pgEnum(`${databasePrefix}_priority`, [
  "low",
  "medium",
  "high",
])

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  // id: varchar("id", { length: 30 })
  //   .$defaultFn(() => generateId())
  //   .primaryKey(),
  user_id: uuid("user_id").notNull(),
  code: varchar("code", { length: 256 }),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description"),
  status: statusEnum("status").notNull().default("todo"),
  priority: priorityEnum("priority").notNull().default("low"),
  cost: numeric("cost").default("0.0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
