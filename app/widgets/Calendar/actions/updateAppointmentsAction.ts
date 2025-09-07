"use server"

import { createClient } from "@supabase/supabase-js"
import { IDBAppointment } from "../types/IDBAppointment"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function updateDBAppointmentsAction(id: string, appointment: Omit<IDBAppointment, "id" | "created_at">) {
  const response = await supabase.from("appointments").update(appointment).eq("id", id)
  return response
}
