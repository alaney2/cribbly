import { tasks } from "@/db/schema"
import { desc } from "drizzle-orm"
import * as z from "zod"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  cost: z.number().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getTasksSchema = searchParamsSchema

export type GetTasksSchema = z.infer<typeof getTasksSchema>

export const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(tasks.status.enumValues),
  priority: z.enum(tasks.priority.enumValues),
  cost: z.coerce.number().min(0).default(0),
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(tasks.status.enumValues).optional(),
  priority: z.enum(tasks.priority.enumValues).optional(),
  cost: z.coerce.number().min(0).optional(),
})

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>
