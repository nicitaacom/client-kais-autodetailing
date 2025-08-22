export function timeAgo(date: string): string {
  const now = new Date()
  const inputDate = new Date(date.split(".").reverse().join("-")) // Convert 'DD.MM.YYYY' to 'YYYY-MM-DD'

  const diffInMilliseconds = now.getTime() - inputDate.getTime()
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7) // Convert days to weeks
  const diffInMonths = Math.floor(diffInDays / 30.436875) // Average days in a month
  const diffInYears = Math.floor(diffInDays / 365.25) // Average days in a year

  if (diffInSeconds < 60) {
    return diffInSeconds === 1 ? "1 second ago" : `${diffInSeconds} seconds ago`
  } else if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`
  } else if (diffInDays < 7) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`
  } else if (diffInWeeks < 5) {
    return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago` // Use weeks if less than 5 weeks
  } else if (diffInMonths < 12) {
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`
  } else if (diffInYears < 2) {
    return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`
  } else {
    return `${diffInYears} years ago`
  }
}
