import moment from "moment-timezone"

import { useAppointmentStore } from "../useAppointmentStore"
import { convertCurrentToTargetTimezone } from "../utils/convertCurrentToTargetTimezone"
import { formatedDateTimeFn } from "../utils/formatedDateTimeFn"
import { IDBAppointment } from "../types/IDBAppointment"
import { sendEmailAction } from "../actions/sendEmailAction"
import { scheduleEmailNtfcnAction } from "../actions/scheduleEmailNtfcnAction"
import { insertDBAppointmentAction } from "../actions/insertDBAppointmentAction"

export async function bookAppointmentFn(appointmentId: string, timezone: string) {
  const { userId } = useAppointmentStore.getState()
  const { setNextStep, setError } = useAppointmentStore.getState()
  const { selectedDate, selectedTime, selectedTimezone } = useAppointmentStore.getState()
  const { firstName, vehicle, email, phone, appointmentNote } = useAppointmentStore.getState()

  // 1. Validate date is not in the past
  const selected = moment(selectedDate).startOf("day")
  const today = moment().startOf("day")
  if (selected.isBefore(today)) return setError("Cannot book appointments in the past")

  const atTimezone = convertCurrentToTargetTimezone(selectedTime, selectedTimezone, timezone)

  try {
    if (!selectedDate) throw Error("It's no selected date")
    if (!selectedTime) throw Error("It's no selected time")

    let message = formatedDateTimeFn("🗓️ booked", selectedDate, selectedTime, selectedTimezone)
    message += `First name: ${firstName}\n`
    message += `Vehicle: ${vehicle}\n`
    message += `Phone: ${phone}\n`
    message += email?.length && email.length > 4 ? `Email: ${email}\n` : ""
    message += appointmentNote.length > 3 ? `Appointment note: ${appointmentNote}\n` : ""

    const subject = `New Booking - ${selectedDate}`

    // 1. Notify about a new booking with insta email
    const sendEmailResp = await sendEmailAction(message, subject, selectedDate, atTimezone, email)
    if (typeof sendEmailResp === "string") throw Error(sendEmailResp)

    // 2.2 schedule Email reminder
    const emailNtfcnResp = await scheduleEmailNtfcnAction(message, selectedDate, atTimezone, appointmentId)
    if (typeof emailNtfcnResp === "string") throw Error(emailNtfcnResp)

    const appointmentObj: IDBAppointment = {
      id: appointmentId,
      created_at: moment().toISOString(),
      date: selectedDate,
      user_id: userId,
      time: selectedTime,
      timezone: selectedTimezone,
      first_name: firstName,
      email: email,
      phone: phone,
      note: appointmentNote,
    }

    const insertApptResp = await insertDBAppointmentAction(appointmentObj)
    if (typeof insertApptResp === "string") throw Error(insertApptResp)

    setNextStep()

    return appointmentObj
  } catch (error) {
    error instanceof Error ? setError(`Error booking: ${error.message}`) : setError("Error booking")
  }
}
