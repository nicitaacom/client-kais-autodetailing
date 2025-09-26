"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function deleteDBAppointmentAction(id: string): Promise<void | string> {
  if (!id) return "no cookie appointment id to delete"

  const { error } = await supabase.from("appointments").delete().eq("id", id)
  if (error?.message) return error.message
}
