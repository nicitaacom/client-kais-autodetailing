import moment from "moment-timezone"

type BusinessHours = {
  [key: string]: { opens: string; closes: string }
}

export function generateAvailableTimes(
  businessHours: BusinessHours,
  bookedTimes: moment.Moment[],
  timezone: string = "Europe/London",
): moment.Moment[] {
  const availableTimes: moment.Moment[] = []
  const now = moment().tz(timezone)
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

  // 1. Generate times for the next 7 days
  for (let i = 0; i < 7; i++) {
    const currentDay = now.clone().add(i, "days")
    const dayName = days[currentDay.day()]
    const { opens, closes } = businessHours[dayName]

    // 2. Parse open/close times
    const openTime = moment.tz(`${currentDay.format("YYYY-MM-DD")} ${opens}`, "YYYY-MM-DD HH:mm", timezone)
    const closeTime = moment.tz(`${currentDay.format("YYYY-MM-DD")} ${closes}`, "YYYY-MM-DD HH:mm", timezone)

    // 3. Generate 1-hour slots
    let currentTime = openTime.clone()
    while (currentTime.isBefore(closeTime)) {
      // 4. Only include future times and exclude booked times
      const isBooked = bookedTimes.some(bookedTime => bookedTime.isSame(currentTime))
      if (currentTime.isAfter(now) && !isBooked) availableTimes.push(currentTime.clone())
      currentTime.add(1, "hour")
    }
  }

  return availableTimes
}
