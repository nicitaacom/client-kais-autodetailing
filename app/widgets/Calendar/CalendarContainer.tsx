"use client"

import { useEffect, useState } from "react"
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
  appointmentNotePlaceholder?: string
  maxBookingDaysInAdvance: number
  phonePlaceholder?: string
}

export default function CalendarContainer({
  businessHours,
  appointmentNotePlaceholder = "Appointment note",
  maxBookingDaysInAdvance,
  phonePlaceholder = "Phone",
}: CalendarContainerProps) {
  const {
    selectedDate,
    selectedTime,
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

  const [firstName, setFirstName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const availableTimes = generateAvailableTimes(
    businessHours,
    appointments.map(appt => moment.tz(`${appt.date} ${appt.time}`, "YYYY-MM-DD HH:mm", appt.timezone)),
  )

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
    if (!firstName || !phone) return setError("First name and phone required")
    // 1. Validate date is not in the past
    const selected = moment(selectedDate).startOf("day")
    const today = moment().startOf("day")
    if (selected.isBefore(today)) return setError("Cannot book past dates")
    // 2. Book or reschedule
    editingId ? await rescheduleAppointmentFn(editingId) : await bookACallFn()
    // 3. Refresh appointments
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

  const isDateAvailable = (date: Date) => {
    const momentDate = moment(date)
    const today = moment().startOf("day")
    const maxBookingDate = moment().add(maxBookingDaysInAdvance, "days").startOf("day")
    return (
      momentDate.isSameOrAfter(today) &&
      momentDate.isSameOrBefore(maxBookingDate) &&
      availableTimes.some(time => momentDate.isSame(time, "day"))
    )
  }

  const filteredTimes = selectedDate ? availableTimes.filter(time => moment(time).isSame(selectedDate, "day")) : []

  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  maxDate.setDate(maxDate.getDate() + maxBookingDaysInAdvance)

  return (
    <div className="w-full max-w-4xl mx-auto bg-foreground p-6 rounded-lg">
      {error && (
        <motion.div
          className="bg-danger/10 border border-danger/30 rounded p-3 flex items-center gap-3 mb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}>
          <FiAlertCircle className="text-danger flex-shrink-0" />
          <p className="text-danger flex-1">{error}</p>
          <button className="p-1 hover:bg-danger/20 rounded" onClick={() => setError("")}>
            <FiX className="text-danger" />
          </button>
        </motion.div>
      )}

      <style>{`
        .react-calendar {
          background: hsl(var(--background)) !important;
          color: hsl(var(--title)) !important;
          border: 1px solid hsl(var(--border-color) / 0.3) !important;
          border-radius: 8px !important;
          padding: 16px !important;
          width: 100% !important;
        }
        .react-calendar__navigation {
          margin-bottom: 16px;
          background: hsl(var(--foreground-accent)) !important;
          border-radius: 6px;
          padding: 8px;
        }
        .react-calendar__navigation button {
          min-width: 32px;
          height: 32px;
          border: none;
          background: transparent !important;
          color: hsl(var(--brand)) !important;
          border-radius: 4px;
          cursor: pointer;
        }
        .react-calendar__navigation button:hover {
          background: hsl(var(--brand) / 0.1) !important;
        }
        .react-calendar__navigation__label {
          font-weight: 600;
          color: hsl(var(--title));
          pointer-events: none !important;
        }
        .react-calendar__month-view__weekdays {
          font-size: 12px;
          color: hsl(var(--subTitle));
          margin-bottom: 8px;
        }
        .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          gap: 2px !important;
        }
        .react-calendar__tile {
          background: hsl(var(--background)) !important;
          color: hsl(var(--title));
          border: 1px solid hsl(var(--border-color) / 0.2) !important;
          border-radius: 4px !important;
          aspect-ratio: 1;
          font-size: 14px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .react-calendar__tile:hover {
          background: hsl(var(--brand) / 0.1) !important;
        }
        .react-calendar__tile--active {
          background: hsl(var(--brand)) !important;
          color: hsl(var(--title-foreground)) !important;
        }
        .react-calendar__tile:disabled {
          background: hsl(var(--foreground) / 0.5) !important;
          color: hsl(var(--subTitle) / 0.4) !important;
          pointer-events: none;
        }
      `}</style>

      <div className="grid laptop:grid-cols-2 gap-6 mb-6">
        <Calendar
          onChange={v => {
            const date = v as Date
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, "0")
            const day = date.getDate().toString().padStart(2, "0")
            setSelectedDate(`${year}-${month}-${day}`)
          }}
          value={
            selectedDate
              ? new Date(
                  Number(selectedDate.slice(0, 4)),
                  Number(selectedDate.slice(5, 7)) - 1,
                  Number(selectedDate.slice(8, 10)),
                )
              : null
          }
          minDate={minDate}
          maxDate={maxDate}
          tileDisabled={({ date, view }) => view === "month" && !isDateAvailable(date)}
          formatMonthYear={(locale, date) => moment(date).format("MMM YYYY")}
        />

        <div>
          <p className="text-subTitle mb-3">{selectedDate ? "Available times" : "Select a date"}</p>
          {selectedDate ? (
            filteredTimes.length ? (
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
                {filteredTimes.map(time => (
                  <button
                    key={time.format()}
                    onClick={() => setSelectedTime(time.format("HH:mm"))}
                    className={`px-3 py-2 text-sm rounded transition-colors ${
                      selectedTime === time.format("HH:mm")
                        ? "bg-brand text-title-foreground"
                        : "bg-background text-title border border-border-color hover:bg-brand/10"
                    }`}>
                    {time.format("h:mm A")}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-subTitle">No available times</p>
            )
          ) : null}
        </div>
      </div>

      <div className="grid tablet:grid-cols-2 gap-3 mb-4">
        <input
          className="bg-background border border-border-color rounded px-3 py-2 text-title"
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="First name"
        />
        <input
          className="bg-background border border-border-color rounded px-3 py-2 text-title"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder={phonePlaceholder}
        />
      </div>

      <input
        className="bg-background border border-border-color rounded px-3 py-2 w-full mb-3 text-title"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email (optional)"
      />

      <textarea
        className="bg-background border border-border-color rounded px-3 py-2 w-full h-20 mb-4 resize-none text-title"
        value={appointmentNote}
        onChange={e => setAppointmentNote(e.target.value)}
        placeholder={appointmentNotePlaceholder}
      />

      <button
        onClick={handleBook}
        disabled={!selectedDate || !selectedTime || !firstName || !phone}
        className="bg-brand hover:bg-brand/90 disabled:bg-brand/50 text-title-foreground px-6 py-3 rounded w-full font-medium mb-4">
        {editingId ? "Update" : "Book"}
      </button>

      <BookedAppointments appointments={appointments} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
