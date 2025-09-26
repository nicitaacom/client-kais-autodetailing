"use server"

import { createClient } from "@supabase/supabase-js"
import { IDBAppointment } from "../types/IDBAppointment"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function insertDBAppointmentAction(appointmentObj: IDBAppointment): Promise<void | string> {
  const { error } = await supabase.from("appointments").insert(appointmentObj)
  return error?.message
}
