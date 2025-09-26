import moment from "moment-timezone"

export function formatedDateTimeFn(
  book: "🗓️ booked" | "❌ canceled",
  selectedDate: string,
  selectedTime: string,
  selectedTimezone: string,
) {
  return selectedDate && selectedTime
    ? `Appointment ${book} for ${moment(`${selectedDate} ${selectedTime}`).tz(selectedTimezone).format("DD MMM YYYY HH:mm")} ${selectedTimezone}\n`
    : "Invalid date/time"
}
