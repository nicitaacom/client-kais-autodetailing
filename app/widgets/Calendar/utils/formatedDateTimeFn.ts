import moment from "moment-timezone"
import { useAppointmentStore } from "../useAppointmentStore"

export function formatedDateTimeFn(isBook: boolean) {
  const { selectedDate, selectedTime, selectedTimezone } = useAppointmentStore.getState()
  return selectedDate && selectedTime
    ? `Appointment ${isBook ? "booked" : "rescheduled"} for ${moment(`${selectedDate} ${selectedTime}`).tz(selectedTimezone).format("DD MMM YYYY HH:mm")} ${selectedTimezone}\n`
    : "Invalid date/time"
}
