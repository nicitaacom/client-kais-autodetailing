import moment from "moment-timezone"
import { useAppointmentStore } from "../useAppointmentStore"

export function convertCurrentToTargetTimezone(time: string | null, fromTz: string, toTz: string) {
  const { selectedDate } = useAppointmentStore.getState()
  return time && selectedDate ? moment.tz(`${selectedDate} ${time}`, fromTz).tz(toTz).format("HH:mm") : "00:00"
}
