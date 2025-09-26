"use server"

import { createClient } from "@supabase/supabase-js"
import { IDBAppointment } from "../types/IDBAppointment"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function selectDBAppointmentsAction(cookieUserId: string | null): Promise<IDBAppointment[] | string> {
  if (!cookieUserId) return "no cookie userId"

  const response = await supabase.from("appointments").select("*").eq("user_id", cookieUserId)
  return response.data as unknown as IDBAppointment[]
}
