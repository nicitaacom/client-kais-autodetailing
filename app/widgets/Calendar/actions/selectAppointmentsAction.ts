"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function selectDBAppointmentsAction(cookieUserId: string | null) {
  if (!cookieUserId) throw Error("no cookie userId")

  const response = await supabase.from("appointments").select("*").eq("user_id", cookieUserId)
  return response
}
