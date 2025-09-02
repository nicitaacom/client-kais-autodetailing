import { useAppointmentStore } from "../useAppointmentStore"
import { convertCurrentToTargetTimezone } from "../utils/convertCurrentToTargetTimezone"
import { formatedDateTimeFn } from "../utils/formatedDateTimeFn"
import { sendTelegramMessageAction } from "../actions/sendTelegramMessageAction"
import { scheduleTgNtfctnAction } from "../actions/scheduleTgNtfctnAction"
import { createClient } from "@supabase/supabase-js"
import moment from "moment-timezone"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function bookACallFn() {
  const { sendNotificationTo, inputNotificationTo, channel, userId, selectedDate, selectedTime, selectedTimezone } =
    useAppointmentStore.getState()
  const { setNextStep, appointmentNote, setError } = useAppointmentStore.getState()

  // 1. Validate date is not in the past
  const selected = moment(selectedDate).startOf("day")
  const today = moment().startOf("day")
  if (selected.isBefore(today)) return setError("Cannot book appointments in the past")

  const atMSK = convertCurrentToTargetTimezone(selectedTime, selectedTimezone, "Europe/Moscow")

  let message = formatedDateTimeFn(true)
  inputNotificationTo.length > 3
    ? (message += `Send notification to ${sendNotificationTo}: ${inputNotificationTo}\n`)
    : null
  appointmentNote.length > 3 ? (message += `Appointment note: ${appointmentNote}\n`) : null
  message += `Where: ${channel === "google-meets" ? '<a href="https://meet.google.com/yiy-pbnd-ygo?pli=1">google-meets</a>' : channel}\n`

  try {
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

    const { error } = await supabase.from("appointments").insert({
      date: selectedDate,
      user_id: userId,
      time: selectedTime,
      timezone: selectedTimezone,
      note: appointmentNote,
      channel,
      notification_to: inputNotificationTo,
    })
    if (error) throw Error(error.message)
    setNextStep()
  } catch (error) {
    error instanceof Error ? setError(`Error booking: ${error.message}`) : setError("Error booking")
  }
}
