"use server"

import { createClient } from "@/utils/supabase/server"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { tasks, type Task } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { customAlphabet } from "nanoid"

import { getErrorMessage } from "@/lib/handle-error"
import { generateId } from "@/lib/utils"

import type { CreateTaskSchema, UpdateTaskSchema } from "./validations"
import { update } from "lodash"


export async function createTask(
  input: CreateTaskSchema & { anotherTaskId: string }
) {
  noStore()
  const supabase = createClient()
  const { data: { user }} = await supabase.auth.getUser()
  if (!user) {
    return {
      data: null,
      error: "User not found",
    }
  }

  try {
    await supabase.from('shadcn_tasks').insert({
      id: generateId(),
      user_id: user.id,
      code: `TASK-${customAlphabet("0123456789", 4)()}`,
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      cost: input.cost,
    })

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateTask(input: UpdateTaskSchema & { id: string }) {
  noStore()
  try {
    const supabase = createClient()
    const { data: { user }} = await supabase.auth.getUser()
    if (!user) return;
    await supabase.from('shadcn_tasks').update({
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      cost: input.cost,
      updated_at: new Date(),
    }).eq('id', input.id)
      .eq('user_id', user.id)

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteTask(input: { id: string }) {
  try {
    const supabase = createClient()
    const { data: { user }} = await supabase.auth.getUser()
    if (!user) return;
    await supabase.from('shadcn_tasks').delete()
      .eq('id', input.id)
      .eq('user_id', user.id)
    // await db.delete(tasks).where(eq(tasks.id, input.id))

    revalidatePath("/")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
