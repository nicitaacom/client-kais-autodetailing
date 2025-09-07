import { createClient } from "@supabase/supabase-js"
import moment from "moment-timezone"

import { useAppointmentStore } from "../useAppointmentStore"
import { convertCurrentToTargetTimezone } from "../utils/convertCurrentToTargetTimezone"
import { formatedDateTimeFn } from "../utils/formatedDateTimeFn"
import { sendEmailAction } from "../actions/sendEmailAction"
import { scheduleEmailNotification } from "../actions/scheduleEmailNtfcnAction"
import { IDBAppointment } from "../types/IDBAppointment"
import { updateDBAppointmentsAction } from "../actions/updateAppointmentsAction"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function rescheduleAppointmentFn(id: string) {
  const { firstName, phone, email, appointmentNote } = useAppointmentStore.getState()
  const {
    sendNotificationTo,
    inputNotificationTo,
    channel,
    userId,
    selectedDate,
    selectedTime,
    selectedTimezone,
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
    await sendEmailAction(message)
    const response = await scheduleEmailNotification(
      message,
      selectedDate,
      atMSK,
      channel,
      sendNotificationTo,
      inputNotificationTo,
    )
    if (typeof response === "string") throw Error(response)

    if (!selectedDate) throw Error("It's no selected date")
    if (!selectedTime) throw Error("It's no selected time")

    const appointmentObj: Omit<IDBAppointment, "id" | "created_at"> = {
      date: selectedDate,
      time: selectedTime,
      user_id: userId,
      channel,
      notification_to: inputNotificationTo,
      timezone: selectedTimezone,
      first_name: firstName,
      phone: phone,
      email: email,
      note: appointmentNote,
    }
    // do it in server action because seems like it lacks some RLS (seems like under the hood it select it first then delete then insert)
    // but it's not select RLS that's why it fails
    const updateDBResp = await updateDBAppointmentsAction(id, appointmentObj)
    if (updateDBResp.error) throw Error(updateDBResp.error.message)
    console.log(66, "appointmentObj - ", appointmentObj)
    return appointmentObj
  } catch (error) {
    error instanceof Error ? setError(`Error rescheduling: ${error.message}`) : setError("Error rescheduling")
  }
}
