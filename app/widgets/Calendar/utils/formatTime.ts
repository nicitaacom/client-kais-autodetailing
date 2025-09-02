import moment from "moment-timezone"

/**
 * 
 * @param timeISO - ISO time string e.g "2023-11-12T08:41:03.348842+00:00"
 *  
 ```tsx
 * const inputTime = "2023-11-12T08:41:03.348842+00:00"
 * 
 * console.log(formatTime(inputTime)) // Output: "12.11.2023 at 09:41 (Europe/Berlin)"
 * ```

 */
export function formatTime(timeISO: string): string {
  const userTimeZone = moment.tz.guess()
  return moment(timeISO).tz(userTimeZone).format(`DD.MM.YYYY [at] HH:mm [${userTimeZone}]`)
}
