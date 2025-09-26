"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function deleteEmailNtfcnAction(appointmentId: string): Promise<string> {
  // 1. Delete notifications by appointment_id
  const { error } = await supabase.from("email_notifications").delete().eq("appointment_id", appointmentId)
  return error
    ? (console.error("Error deleting notifications:", error), `Error deleting: ${error.message}`)
    : "Notification deleted successfully"
}
