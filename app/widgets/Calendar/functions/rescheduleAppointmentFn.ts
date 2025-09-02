import { createClient } from "@supabase/supabase-js"
import { useAppointmentStore } from "../useAppointmentStore"
import { sendTelegramMessageAction } from "../actions/sendTelegramMessageAction"
import { scheduleTgNtfctnAction } from "../actions/scheduleTgNtfctnAction"
import { convertCurrentToTargetTimezone } from "../utils/convertCurrentToTargetTimezone"
import { formatedDateTimeFn } from "../utils/formatedDateTimeFn"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function rescheduleAppointmentFn(id: string) {
  const {
    sendNotificationTo,
    inputNotificationTo,
    channel,
    userId,
    selectedDate,
    selectedTime,
    selectedTimezone,
    appointmentNote,
    setError,
  } = useAppointmentStore.getState()

  const atMSK = convertCurrentToTargetTimezone(selectedTime, selectedTimezone, "Europe/Moscow")

  let message = formatedDateTimeFn(false)
  inputNotificationTo.length > 3
    ? (message += `Send notification to ${sendNotificationTo}: ${inputNotificationTo}\n`)
    : null
  appointmentNote.length > 3 ? (message += `Appointment note: ${appointmentNote}\n`) : null
  message += `Where: ${channel === "google-meets" ? '<a href="https://meet.google.com/yiy-pbnd-ygo?pli=1">google-meets</a>' : channel}\n`

  try {
    // Assuming sendTelegramMessageAction and scheduleTgNtfctnAction are implemented elsewhere
    await sendTelegramMessageAction(message)
    const response = await scheduleTgNtfctnAction(
      message,
      selectedDate,
      atMSK,
      channel,
      sendNotificationTo,
      inputNotificationTo,
    )
    if (typeof response === "string") throw Error(response)

    const { error } = await supabase
      .from("appointments")
      .update({
        date: selectedDate,
        time: selectedTime,
        user_id: userId,
        timezone: selectedTimezone,
        note: appointmentNote,
        channel,
        notification_to: inputNotificationTo,
      })
      .eq("id", id)
    if (error) throw Error(error.message)
  } catch (error) {
    error instanceof Error ? setError(`Error rescheduling: ${error.message}`) : setError("Error rescheduling")
  }
}
