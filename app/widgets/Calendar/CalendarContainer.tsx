import { useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import moment from "moment-timezone"
import { motion } from "framer-motion"
import { FiAlertCircle, FiX } from "react-icons/fi"

import { useAppointmentStore, type TAppointment } from "./useAppointmentStore"
import BookedAppointments from "./BookedAppointments"
import { rescheduleAppointmentFn } from "./functions/rescheduleAppointmentFn"
import { bookACallFn } from "./functions/bookACallFn"
import { generateAvailableTimes } from "./functions/generateAvailableTimesFn"

moment.tz.setDefault("Europe/London")

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  return parts.length === 2 ? parts.pop()?.split(";").shift() || null : null
}
function setCookie(name: string, value: string, days: number) {
  let expires = ""
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = "; expires=" + date.toUTCString()
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

type BusinessHours = {
  [key: string]: { opens: string; closes: string }
}

type CalendarContainerProps = {
  businessHours: BusinessHours
}

export default function CalendarContainer({ businessHours }: CalendarContainerProps) {
  const {
    selectedDate,
    selectedTime,
    selectedTimezone,
    appointmentNote,
    editingId,
    appointments,
    error,
    userId,
    setSelectedDate,
    setSelectedTime,
    setAppointmentNote,
    setEditingId,
    setAppointments,
    setError,
    setUserId,
  } = useAppointmentStore()

  const availableTimes = generateAvailableTimes(
    businessHours,
    appointments.map(appt => moment.tz(`${appt.date} ${appt.time}`, "YYYY-MM-DD HH:mm", appt.timezone)),
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    // 1. Get or set userId from cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      return parts.length === 2 ? parts.pop()?.split(";").shift() || null : null
    }
    const setCookie = (name: string, value: string, days: number) => {
      let expires = ""
      if (days) {
        const date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        expires = "; expires=" + date.toUTCString()
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/"
    }
    let cookieUserId = getCookie("user_id")
    if (!cookieUserId) {
      cookieUserId = crypto.randomUUID()
      setCookie("user_id", cookieUserId, 365)
    }
    setUserId(cookieUserId)
    // 2. Fetch user-specific appointments
    async function fetchAppts() {
      const { data, error } = await supabase.from("appointments").select("*").eq("user_id", cookieUserId)
      error ? console.error(error) : setAppointments(data || [])
    }
    fetchAppts()
  }, [setAppointments, setUserId])

  useEffect(() => {
    if (typeof window === "undefined") return
    // 1. Get or set userId from cookie
    let cookieUserId = getCookie("user_id")
    if (!cookieUserId) {
      cookieUserId = crypto.randomUUID()
      setCookie("user_id", cookieUserId, 365)
    }
    setUserId(cookieUserId)
    // 2. Fetch user-specific appointments
    async function fetchAppts() {
      const { data, error } = await supabase.from("appointments").select("*").eq("user_id", cookieUserId)
      error ? console.error(error) : setAppointments(data || [])
    }
    fetchAppts()
  }, [setAppointments, setUserId])

  const handleBook = async () => {
    // 1. Validate date is not in the past
    const selected = moment(selectedDate).startOf("day")
    const today = moment().startOf("day")
    if (selected.isBefore(today)) return setError("Cannot book appointments in the past")

    editingId ? await rescheduleAppointmentFn(editingId) : await bookACallFn()
    const { data, error } = await supabase.from("appointments").select("*").eq("user_id", userId)
    error ? setError(error.message) : (setAppointments(data || []), setEditingId(null))
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id)
    error ? setError("Error deleting") : setAppointments(appointments.filter(a => a.id !== id))
  }

  const handleEdit = (appt: TAppointment) => {
    setSelectedDate(appt.date)
    setSelectedTime(appt.time)
    setAppointmentNote(appt.note)
    setEditingId(appt.id)
  }

  return (
    <div className="bg-foreground p-4 rounded-lg text-title max-w-md mx-auto">
      {error && (
        <motion.div
          className="bg-danger/6 border border-danger/20 rounded-md p-2 flex items-start gap-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}>
          <FiAlertCircle className="text-danger mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-danger text-sm">{error}</p>
          </div>
          <button type="button" className="p-0.5 rounded hover:bg-danger/10" onClick={() => setError("")}>
            <FiX className="text-danger" />
          </button>
        </motion.div>
      )}
      <style>{`.react-calendar{background:hsl(var(--background));color:hsl(var(--title));border:1px solid hsl(var(--border-color));border-radius:0.5rem;padding:1rem;}.react-calendar__tile{background:hsl(var(--foreground));color:hsl(var(--subTitle));border-radius:50%;aspect-ratio:1;display:grid;place-items:center;opacity:0.9;}.react-calendar__tile--active{background:hsl(var(--brand));color:hsl(var(--title-foreground));}.react-calendar__tile--now{background:hsl(var(--foreground-accent));}.react-calendar__navigation button{color:hsl(var(--title));background:none;}.react-calendar__tile:hover{background:hsl(var(--brand)/0.8);color:hsl(var(--title-foreground));opacity:1;}`}</style>
      <Calendar
        onChange={v => setSelectedDate(moment(v as Date).format("YYYY-MM-DD"))}
        value={selectedDate ? moment(selectedDate).toDate() : null}
        className="mb-4"
        minDate={new Date()} // Prevent selecting past dates
      />
      <select
        value={selectedTime || ""}
        onChange={e => setSelectedTime(e.target.value)}
        className="bg-background text-title border border-border-color p-2 rounded mb-2 w-full">
        <option value="" disabled>
          Select a time
        </option>
        {availableTimes
          .filter(time => moment(time).isSame(selectedDate, "day"))
          .map(time => (
            <option key={time.format()} value={time.format("HH:mm")}>
              {time.format("h:mm A")}
            </option>
          ))}
      </select>
      <textarea
        value={appointmentNote}
        onChange={e => setAppointmentNote(e.target.value)}
        placeholder="Appointment note"
        className="bg-background text-title border border-border-color p-2 rounded mb-4 w-full h-20"
      />
      <button onClick={handleBook} className="bg-brand text-title-foreground px-4 py-2 rounded w-full mb-4">
        {editingId ? "Update" : "Book"}
      </button>
      <BookedAppointments appointments={appointments} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
