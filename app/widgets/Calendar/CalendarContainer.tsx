"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import moment from "moment-timezone"
import { motion } from "framer-motion"
import { FiAlertCircle, FiX } from "react-icons/fi"

import { useAppointmentStore } from "./useAppointmentStore"
import BookedAppointments from "./BookedAppointments"
import { rescheduleAppointmentFn } from "./functions/rescheduleAppointmentFn"
import { bookACallFn } from "./functions/bookACallFn"
import { useDebounce } from "./hooks/useDebounce"
import { validateEmail } from "./utils/validateEmailFn"
import { selectDBAppointmentsAction } from "./actions/selectAppointmentsAction"
import { IDBAppointment } from "./types/IDBAppointment"

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

function generateAvailableTimes(businessHours: BusinessHours, bookedTimes: moment.Moment[], maxDays: number) {
  const times: moment.Moment[] = []
  const start = moment().startOf("day")
  const end = moment().add(maxDays, "days").endOf("day")
  for (let day = start.clone(); day.isBefore(end); day.add(1, "days")) {
    const weekday = day.format("dddd").toLowerCase()
    if (!businessHours[weekday]) continue
    const { opens, closes } = businessHours[weekday]
    let slot = moment(`${day.format("YYYY-MM-DD")} ${opens}`)
    const closeSlot = moment(`${day.format("YYYY-MM-DD")} ${closes}`)
    while (slot.isBefore(closeSlot)) {
      !bookedTimes.some(b => b.isSame(slot)) && times.push(slot.clone())
      slot.add(30, "minutes")
    }
  }
  return times
}

type BusinessHours = {
  [key: string]: { opens: string; closes: string }
}

type CalendarContainerProps = {
  businessHours: BusinessHours
  maxBookingDaysInAdvance: number
  defaultTimezone: string
  appointmentNotePlaceholder?: string
  phonePlaceholder?: string
}

export default function CalendarContainer({
  businessHours,
  maxBookingDaysInAdvance,
  defaultTimezone,
  appointmentNotePlaceholder = "Appointment note",
  phonePlaceholder = "Phone",
}: CalendarContainerProps) {
  const { firstName, setFirstName, firstNameError, setFirstNameError } = useAppointmentStore()
  const { phone, setPhone, phoneError, setPhoneError } = useAppointmentStore()
  const { appointmentNote, setAppointmentNote, appointmentNoteError, setAppointmentNoteError } = useAppointmentStore()
  const { editingId, appointments, error, setEditingId, setAppointments, setError, setUserId, resetInputs } =
    useAppointmentStore()
  const { selectedDate, setSelectedDate, selectedTime, setSelectedTime, email, setEmail, emailError, setEmailError } =
    useAppointmentStore()

  moment.tz.setDefault(defaultTimezone ?? "Europe/London")

  const availableTimes = generateAvailableTimes(
    businessHours,
    appointments.map(appt => moment.tz(`${appt.date} ${appt.time}`, "YYYY-MM-DD HH:mm", appt.timezone)),
    maxBookingDaysInAdvance,
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
      console.log(102, "cookieUserId - ", cookieUserId)
      const selectResponse = await selectDBAppointmentsAction(cookieUserId)
      selectResponse.error ? console.error(selectResponse.error) : setAppointments(selectResponse.data || [])
    }
    fetchAppts()
  }, [setAppointments, setUserId])

  // 1. Validate first name (max 16 chars, a-z/A-Z)
  const validateFirstName = (name: string) =>
    /^[a-zA-Z]{0,16}$/.test(name) ? "" : "Name must be 16 chars max, letters only"

  // 2. Validate phone (max 17 chars, + and 0-9)
  const validatePhone = (phone: string) =>
    /^\+?[0-9 ]{0,16}$/.test(phone) ? "" : "Phone must be 17 chars max, numbers, spaces and + only"

  // 3. Handle input changes with validation
  const handleFirstNameChange = (value: string) => {
    setFirstName(value)
    setFirstNameError(validateFirstName(value))
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    setPhoneError(validatePhone(value))
  }

  const handleAppointmentNoteChange = (value: string) => {
    const trimmed = value.slice(0, 300)
    setAppointmentNote(trimmed)
    setAppointmentNoteError(trimmed.length === 300 ? "Note limited to 300 characters" : "")
  }

  const handleBook = async () => {
    // 1. Validate inputs
    if (!firstName || !phone) return setError("First name and phone required")
    if (firstNameError || phoneError || appointmentNoteError) return setError("Please fix input errors")
    // 2. Validate date is not in the past
    const selected = moment(selectedDate).startOf("day")
    const today = moment().startOf("day")
    if (selected.isBefore(today)) return setError("Cannot book past dates")
    // 3. Book or reschedule

    if (editingId) {
      const response = await rescheduleAppointmentFn(editingId)
      if (typeof response === "object") {
        setAppointments(
          appointments.map(appt =>
            appt.id === editingId ? { ...response, id: appt.id, created_at: appt.created_at } : appt,
          ),
        )
        setEditingId(null)
        resetInputs()
      }
    } else {
      const response = await bookACallFn()
      if (typeof response === "object") {
        setAppointments([...appointments, response])
        resetInputs()
      }
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id)
    error ? setError("Error deleting") : setAppointments(appointments.filter(a => a.id !== id))
  }

  const handleEdit = (appt: IDBAppointment) => {
    // 1. Pre-fill form with existing appointment data
    setSelectedDate(appt.date)
    setSelectedTime(appt.time)
    setAppointmentNote(appt.note || "")
    setFirstName(appt.first_name)
    setPhone(appt.phone)
    setEmail(appt.email || "")
    setEditingId(appt.id)
    // 2. Validate pre-filled data
    setFirstNameError(validateFirstName(appt.first_name))
    setPhoneError(validatePhone(appt.phone))
    setAppointmentNoteError(appt.note?.length === 300 ? "Note limited to 300 characters" : "")
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

  const debouncedEmail = useDebounce(email, 500)

  // 4. Clear email error
  useEffect(() => {
    if (!debouncedEmail) {
      setEmailError("")
      return
    }
    const result = validateEmail(debouncedEmail)
    setEmailError(result === true ? "" : result)
  }, [debouncedEmail, setEmailError])

  const filteredTimes = selectedDate ? availableTimes.filter(time => moment(time).isSame(selectedDate, "day")) : []

  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  maxDate.setDate(maxDate.getDate() + maxBookingDaysInAdvance)

  return (
    <div className="w-full max-w-4xl mx-auto bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 hover:border-brand/30 p-6 shadow-2xl shadow-black/50 transition-all duration-300">
      {error && (
        <motion.div
          className="bg-brand/10 border border-brand/30 rounded-xl p-3 flex items-center gap-3 mb-4 backdrop-blur-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}>
          <FiAlertCircle className="text-brand flex-shrink-0" />
          <p className="text-brand flex-1">{error}</p>
          <button className="p-1 hover:bg-brand/20 rounded transition-colors" onClick={() => setError("")}>
            <FiX className="text-brand" />
          </button>
        </motion.div>
      )}

      <style>{`
        .react-calendar {
          background: rgba(0, 0, 0, 0.3) !important;
          backdrop-filter: blur(8px) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          padding: 16px !important;
          width: 100% !important;
        }
        .react-calendar__navigation {
          margin-bottom: 16px;
          background: rgba(0, 0, 0, 0.4) !important;
          backdrop-filter: blur(4px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px;
          padding: 8px;
        }
        .react-calendar__navigation button {
          min-width: 32px;
          height: 32px;
          border: none;
          background: transparent !important;
          color: #ef4444 !important;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .react-calendar__navigation button:hover {
          background: rgba(239, 68, 68, 0.2) !important;
        }
        .react-calendar__navigation__label {
          font-weight: 600;
          color: white;
          pointer-events: none !important;
        }
        .react-calendar__month-view__weekdays {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }
        .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          gap: 2px !important;
        }
        .react-calendar__tile {
          background: rgba(0, 0, 0, 0.3) !important;
          backdrop-filter: blur(4px) !important;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 6px !important;
          aspect-ratio: 1;
          font-size: 14px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.2s;
        }
        .react-calendar__tile:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          border-color: rgba(239, 68, 68, 0.3) !important;
        }
        .react-calendar__tile--active {
          background: #ef4444 !important;
          color: white !important;
          border-color: #ef4444 !important;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3) !important;
        }
        .react-calendar__tile--active:hover {
          background: #ef4444 !important;
          color: white !important;
        }
        .react-calendar__tile:disabled {
          background: rgba(0, 0, 0, 0.2) !important;
          color: rgba(255, 255, 255, 0.3) !important;
          pointer-events: none;
          border-color: rgba(255, 255, 255, 0.05) !important;
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

        <div className="flex flex-col">
          <p className="text-white/70 mb-3 drop-shadow-sm">{selectedDate ? "Available times" : "Select a date"}</p>
          <div className="flex-1 min-h-[320px]">
            {selectedDate ? (
              filteredTimes.length ? (
                <div className="grid grid-cols-3 gap-2 h-full overflow-y-auto pr-2 content-start scrollbar-thin scrollbar-thumb-red-500/30 scrollbar-track-transparent">
                  {filteredTimes.map(time => (
                    <button
                      key={time.format()}
                      onClick={() => setSelectedTime(time.format("HH:mm"))}
                      className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 h-fit backdrop-blur-sm ${
                        selectedTime === time.format("HH:mm")
                          ? "bg-brand text-white border border-brand shadow-lg shadow-brand/30"
                          : "bg-black/30 text-white border border-white/10 hover:bg-brand/20 hover:border-brand/30"
                      }`}>
                      {time.format("h:mm A")}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white/70">No available times</p>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/70">Select a date to view available times</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid tablet:grid-cols-2 gap-3 mb-4">
        <div>
          <input
            className="bg-black/30 backdrop-blur-sm border border-white/10 hover:border-brand/30 focus:border-brand/50 rounded-lg px-3 py-2 text-white w-full transition-all duration-200 placeholder:text-white/50"
            type="text"
            value={firstName}
            onChange={e => handleFirstNameChange(e.target.value)}
            placeholder="First name"
          />
          {firstNameError && <p className="text-brand text-sm mt-1">{firstNameError}</p>}
        </div>
        <div>
          <input
            className="bg-black/30 backdrop-blur-sm border border-white/10 hover:border-brand/30 focus:border-brand/50 rounded-lg px-3 py-2 text-white w-full transition-all duration-200 placeholder:text-white/50"
            type="tel"
            value={phone}
            onChange={e => handlePhoneChange(e.target.value)}
            placeholder={phonePlaceholder}
          />
          {phoneError && <p className="text-brand text-sm mt-1">{phoneError}</p>}
        </div>
      </div>

      <div className="mb-3">
        <input
          className="bg-black/30 backdrop-blur-sm border border-white/10 hover:border-brand/30 focus:border-brand/50 rounded-lg px-3 py-2 w-full text-white transition-all duration-200 placeholder:text-white/50"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email (optional)"
        />
        {emailError && <p className="text-brand text-sm mt-1">{emailError}</p>}
      </div>

      <div className="mb-3">
        <textarea
          className="bg-black/30 backdrop-blur-sm border border-white/10 hover:border-brand/30 focus:border-brand/50 rounded-lg px-3 py-2 w-full h-20 resize-none text-white transition-all duration-200 placeholder:text-white/50"
          value={appointmentNote}
          onChange={e => handleAppointmentNoteChange(e.target.value)}
          placeholder={appointmentNotePlaceholder}
        />
        {appointmentNoteError && <p className="text-brand text-sm mt-1">{appointmentNoteError}</p>}
      </div>

      <button
        onClick={handleBook}
        disabled={
          !selectedDate ||
          !selectedTime ||
          !firstName ||
          !phone ||
          !!firstNameError ||
          !!phoneError ||
          !!appointmentNoteError
        }
        className="bg-brand hover:bg-brand disabled:bg-brand/30 text-white px-6 py-3 rounded-lg w-full font-medium mb-4 transition-all duration-200 backdrop-blur-sm shadow-lg disabled:shadow-none hover:shadow-brand/20">
        {editingId ? "Update" : "Book"}
      </button>

      <BookedAppointments
        editingId={editingId}
        appointments={appointments}
        onEdit={handleEdit}
        handleBook={handleBook}
        onDelete={handleDelete}
      />
    </div>
  )
}
