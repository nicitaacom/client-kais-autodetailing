"use server"

import { createClient } from "@supabase/supabase-js"
import moment from "moment-timezone"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

function validateInputs(message: string, selectedDate: string | null, at: string): string | null {
  if (!message) return "Message is required"
  if (!selectedDate) return "You need to select a date"
  if (!at) return "Time is required"
  return null
}

export async function scheduleEmailNtfcnAction(
  message: string,
  selectedDate: string | null,
  appointment_at: string,

  appointmentId?: string,
): Promise<void | string> {
  // 1. Validate inputs
  const validationError = validateInputs(message, selectedDate, appointment_at)
  if (validationError) return validationError

  const date = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate
  if (!date) return "Missing date for scheduling"

  // 2. Parse and validate scheduling time
  const bookingDate = moment(date).format("YYYY-MM-DD")
  const baseTime = moment.tz(`${bookingDate} ${appointment_at}`, "Europe/Moscow").seconds(0).milliseconds(0)

  if (baseTime.isBefore(moment())) return "Scheduling time is in the past"

  // 3. Insert email notification
  const scheduledFor = baseTime.clone().subtract(30, "minutes")
  const notificationId = crypto.randomUUID()
  const { error: insertError } = await supabase.from("email_notifications").insert({
    id: notificationId,
    appointment_id: appointmentId,
    email: `notifications@${process.env.NEXT_PUBLIC_EMAIL_FROM_DOMAIN}`,
    message,
    scheduled_for: scheduledFor.toISOString(),
  })

  if (insertError) {
    console.error("Error inserting notification:", insertError)
    return `Error scheduling: ${insertError.message}`
  }

  // 4. Create pg_cron schedule
  const cronJobName = `email_notification_${notificationId}`
  const cronSchedule = `${scheduledFor.minute()} ${scheduledFor.hour()} ${scheduledFor.date()} ${
    scheduledFor.month() + 1
  } ${scheduledFor.day()}`

  const edgeFunctionUrl = "https://mdltdmheelhfcvbglhxr.supabase.co/functions/v1/email-reminder"

  const query = `
    SELECT cron.schedule(
      '${cronJobName}',
      '${cronSchedule}',
      $$SELECT net.http_post(
        url := '${edgeFunctionUrl}',
        headers := '{"Authorization": "Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}", "Content-Type": "application/json"}',
        body := '{"notificationId": "${notificationId}"}'
      )$$
    );
  `

  const { error: cronError } = await supabase.rpc("execute_any_sql", { query })
  if (cronError) {
    console.error("Error scheduling cron job:", cronError)
    return `Error scheduling cron: ${cronError.message}`
  }
}
