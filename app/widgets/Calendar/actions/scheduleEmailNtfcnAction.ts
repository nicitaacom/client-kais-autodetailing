"use server"

import { createClient } from "@supabase/supabase-js"
import moment from "moment-timezone"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function scheduleEmailNotification(
  message: string,
  selectedDate: string | null,
  at: string,
  channel: string,
  sendNotificationTo: string,
  inputNotificationTo: string,
) {
  if (!selectedDate) return "You need to select a date"

  const date = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate
  if (!date) return "Missing date for scheduling"

  const bookingDate = moment(date).format("YYYY-MM-DD")
  const baseTime = moment.tz(`${bookingDate} ${at}`, "Europe/Moscow").seconds(0).milliseconds(0)

  if (baseTime.isBefore(moment())) return "Scheduling time is in the past"

  const scheduleTimes = [
    {
      scheduledFor: baseTime.clone().subtract(30, "minutes").toISOString(),
      subject: "Meeting Reminder - 30 minutes",
      html: `<p>Reminder about meeting in 30 minutes:</p><p>${message}</p>`,
    },
    {
      scheduledFor: baseTime.toISOString(),
      subject: "Meeting Time",
      html: `<p>${message}</p>`,
    },
  ]

  for (const { scheduledFor, subject, html } of scheduleTimes) {
    const { error } = await supabase.from("email_notifications").insert({
      email: sendNotificationTo || inputNotificationTo,
      subject,
      html,
      scheduled_for: scheduledFor,
    })

    if (error) {
      console.error("Error scheduling email:", error)
      return `Error scheduling: ${error.message}`
    }
  }
}
