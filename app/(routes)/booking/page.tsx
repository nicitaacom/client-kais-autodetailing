import { businessInfo } from "@/consts/businessInfo"
import CalendarContainer from "@/widgets/Calendar/CalendarContainer"

export default function Booking() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <CalendarContainer businessHours={businessInfo.businessHours} maxBookingDaysInAdvance={28} />
    </div>
  )
}
