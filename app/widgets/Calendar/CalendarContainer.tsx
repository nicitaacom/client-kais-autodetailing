"use client"

import { useEffect } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import moment from "moment-timezone"
import { motion } from "framer-motion"
import { FiAlertCircle, FiX } from "react-icons/fi"

import { useAppointmentStore } from "./useAppointmentStore"
import BookedAppointments from "./BookedAppointments"
import { cancelAppointmentFn } from "./functions/cancelAppointmentFn"
import { bookAppointmentFn } from "./functions/bookAppointmentFn"
import { useDebounce } from "./hooks/useDebounce"
import { validateEmail } from "./utils/validateEmailFn"
import { selectDBAppointmentsAction } from "./actions/selectAppointmentsAction"
import { IDBAppointment } from "./types/IDBAppointment"
import { deleteDBAppointmentAction } from "./actions/deleteDBAppointmentAction"

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
      !bookedTimes?.some(b => b.isSame(slot)) && times.push(slot.clone())
      slot.add(30, "minutes")
    }
  }
  return times
}

type BusinessHours = {
  [key: string]: { opens: string; closes: string } | null
}

type CalendarContainerProps = {
  businessHours: BusinessHours
  maxBookingDaysInAdvance: number
  defaultTimezone: string
  businessOwnerPhone?: string // to receive notifictions about bookings
  businessOwnerEmail?: string // to receive notifictions about bookings
  appointmentNotePlaceholder?: string
  phonePlaceholder?: string
}

export default function CalendarContainer({
  businessHours,
  maxBookingDaysInAdvance,
  businessOwnerPhone,
  businessOwnerEmail,
  defaultTimezone,
  appointmentNotePlaceholder = "Appointment note (optional)",
  phonePlaceholder = "Phone",
}: CalendarContainerProps) {
  const { firstName, setFirstName, firstNameError, setFirstNameError } = useAppointmentStore()
  const { phone, setPhone, phoneError, setPhoneError } = useAppointmentStore()
  const { email, setEmail, emailError, setEmailError } = useAppointmentStore()
  const { vehicle, setVehicle, vehicleError, setVehicleError } = useAppointmentStore()
  const { appointmentNote, setAppointmentNote, appointmentNoteError, setAppointmentNoteError } = useAppointmentStore()
  const { editingId, appointments, error, setEditingId, setAppointments, setError, setUserId, resetInputs } =
    useAppointmentStore()
  const { selectedDate, setSelectedDate, selectedTime, setSelectedTime } = useAppointmentStore()
  const { selectedTimezone } = useAppointmentStore()

  moment.tz.setDefault(defaultTimezone ?? "Europe/London")

  const availableTimes = generateAvailableTimes(
    businessHours,
    appointments?.map(appt => moment.tz(`${appt.date} ${appt.time}`, "YYYY-MM-DD HH:mm", appt.timezone)),
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
      const selectResponse = await selectDBAppointmentsAction(cookieUserId)
      if (typeof selectResponse === "string") return console.error(selectResponse)
      else setAppointments(selectResponse)
    }
    fetchAppts()
  }, [setAppointments, setUserId])

  // 1. Validate first name (max 16 chars, a-z/A-Z)
  const validateFirstName = (name: string) =>
    /^[a-zA-Z]{0,16}$/.test(name) ? "" : "Name must be 16 chars max, letters only"

  // 2. Validate phone (min 10 digits)
  const validatePhone = (phone: string) =>
    phone.replace(/\D/g, "").length < 10 ? "Please enter a valid phone number" : ""

  const validateVehicle = (name: string) =>
    /^[a-zA-Z0-9-]{0,32}$/.test(name) ? "" : "Vehicle must be 32 chars max, letters, digits, and '-' only"

  // 3. Handle input changes with validation
  const handleFirstNameChange = (value: string) => {
    setFirstName(value)
    setFirstNameError(validateFirstName(value))
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setPhone(formatted)
    setPhoneError(validatePhone(formatted))
  }

  const handleVehicleChange = (value: string) => {
    setVehicle(value)
    setVehicleError(validateVehicle(value))
  }

  const handleAppointmentNoteChange = (value: string) => {
    const trimmed = value.slice(0, 300)
    setAppointmentNote(trimmed)
    setAppointmentNoteError(trimmed.length === 300 ? "Note limited to 300 characters" : "")
  }

  const handleBook = async () => {
    // 1. Validate inputs
    if (!firstName || !phone) return setError("First name and phone required")
    if (firstNameError || phoneError || appointmentNoteError || vehicleError) return setError("Please fix input errors")
    // 2. Validate date is not in the past
    const selected = moment(selectedDate).startOf("day")
    const today = moment().startOf("day")
    if (selected.isBefore(today)) return setError("Cannot book past dates")
    // 3. Book or reschedule

    const appointmentId = editingId || crypto.randomUUID()

    if (editingId) {
      const originalAppt = appointments.find(appt => appt.id === editingId)
      if (!originalAppt) return setError("Appointment not found")
      const hasChanges =
        selectedDate !== originalAppt.date ||
        selectedTime !== originalAppt.time ||
        firstName !== originalAppt.first_name ||
        phone !== originalAppt.phone ||
        (email || "") !== (originalAppt.email || "") ||
        (appointmentNote || "") !== (originalAppt.note || "") ||
        selectedTimezone !== originalAppt.timezone

      if (!hasChanges) {
        setEditingId(null)
        return
      }
      const cancelAppt = await cancelAppointmentFn(appointmentId, defaultTimezone, businessOwnerPhone)
      if (!cancelAppt?.ok) return

      const response = await bookAppointmentFn(appointmentId, defaultTimezone, businessOwnerPhone)
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
      const response = await bookAppointmentFn(appointmentId, defaultTimezone, businessOwnerPhone)
      if (typeof response === "object") {
        setAppointments([...appointments, response])
        resetInputs()
      }
    }
  }

  const handleDelete = async (id: string) => {
    const deleteResponse = await deleteDBAppointmentAction(id)
    typeof deleteResponse === "string"
      ? setError(deleteResponse)
      : setAppointments(appointments.filter(a => a.id !== id))
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

  // 5. Handle phone input key events
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right
    if ([8, 9, 27, 13, 46, 35, 36, 37, 39].includes(e.keyCode)) return
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88) && e.ctrlKey) return
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }
  // 1. Format phone number with mask +XX XXX XXX XX XX
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // If empty, return +44 prefix
    if (digits.length === 0) return "+44 "

    // Start with +44 if user hasn't provided country code
    let formattedDigits = digits.startsWith("44") ? digits : "44" + digits

    // Format as +XX XXX XXX XX XX
    if (formattedDigits.length <= 2) return `+${formattedDigits}`
    if (formattedDigits.length <= 5) return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2)}`
    if (formattedDigits.length <= 8)
      return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2, 5)} ${formattedDigits.slice(5)}`
    if (formattedDigits.length <= 10)
      return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2, 5)} ${formattedDigits.slice(5, 8)} ${formattedDigits.slice(8)}`

    return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2, 5)} ${formattedDigits.slice(5, 8)} ${formattedDigits.slice(8, 10)} ${formattedDigits.slice(10, 12)}`
  }

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
      .react-calendar__tile--active:hover {
        background: hsl(var(--brand)) !important;
        color: hsl(var(--title-foreground)) !important;
      }
      .react-calendar__tile:disabled {
        background: hsl(var(--foreground) / 0.5) !important;
        color: hsl(var(--subTitle) / 0.4) !important;
        pointer-events: none;
      }
      
      /* Custom scrollbar styling */
      .times-scroll::-webkit-scrollbar {
        width: 8px;
      }
      .times-scroll::-webkit-scrollbar-track {
        background: hsl(var(--background));
        border-radius: 4px;
      }
      .times-scroll::-webkit-scrollbar-thumb {
        background: hsl(var(--brand));
        border-radius: 4px;
      }
      .times-scroll::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--brand) / 0.8);
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

        <div className="flex flex-col h-[398px]">
          <p className="text-subTitle mb-3">{selectedDate ? "Available times" : "Select a date"}</p>
          <div className="flex-1 overflow-hidden">
            {selectedDate ? (
              filteredTimes.length ? (
                <div className="grid grid-cols-3 gap-2 h-full overflow-y-auto pr-2 content-start times-scroll">
                  {filteredTimes.map(time => (
                    <button
                      key={time.format()}
                      onClick={() => setSelectedTime(time.format("HH:mm"))}
                      className={`px-3 py-2 text-sm rounded transition-colors h-fit ${
                        selectedTime === time.format("HH:mm")
                          ? "bg-brand text-title-foreground"
                          : "bg-background text-title border border-border-color hover:bg-brand/10"
                      }`}>
                      {time.format("h:mm A")}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-subTitle">No available times</p>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-subTitle">Select a date to view available times</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid tablet:grid-cols-2 gap-3 mb-4">
        <input
          className={`bg-background border rounded px-3 py-2 text-title w-full transition-colors ${
            firstNameError
              ? "border-danger ring-2 ring-danger/20 focus:ring-danger/30"
              : "border-border-color focus:ring-2 focus:ring-brand/20"
          }`}
          type="text"
          value={firstName}
          tabIndex={1}
          onChange={e => handleFirstNameChange(e.target.value)}
          placeholder="First name"
        />

        <input
          className={`bg-background border rounded px-3 py-2 text-title w-full transition-colors ${
            vehicleError
              ? "border-danger ring-2 ring-danger/20 focus:ring-danger/30"
              : "border-border-color focus:ring-2 focus:ring-brand/20"
          }`}
          value={vehicle}
          tabIndex={2}
          onChange={e => handleVehicleChange(e.target.value)}
          placeholder="Vehicle"
        />
      </div>

      <div className="grid tablet:grid-cols-2 gap-3 mb-4">
        <input
          className={`bg-background border rounded px-3 py-2 text-title w-full transition-colors ${
            phoneError
              ? "border-danger ring-2 ring-danger/20 focus:ring-danger/30"
              : "border-border-color focus:ring-2 focus:ring-brand/20"
          }`}
          type="tel"
          value={phone}
          tabIndex={3}
          onKeyDown={handlePhoneKeyDown}
          onChange={e => handlePhoneChange(e.target.value)}
          placeholder={phonePlaceholder}
        />

        <input
          className={`bg-background border rounded px-3 py-2 w-full text-title transition-colors ${
            emailError
              ? "border-danger ring-2 ring-danger/20 focus:ring-danger/30"
              : "border-border-color focus:ring-2 focus:ring-brand/20"
          }`}
          type="email"
          value={email}
          tabIndex={4}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email (optional)"
        />
      </div>

      <div className="mb-4">
        <textarea
          className={`bg-background border rounded px-3 py-2 w-full h-20 resize-none text-title transition-colors ${
            appointmentNoteError
              ? "border-danger ring-2 ring-danger/20 focus:ring-danger/30"
              : "border-border-color focus:ring-2 focus:ring-brand/20"
          }`}
          value={appointmentNote}
          tabIndex={5}
          onChange={e => handleAppointmentNoteChange(e.target.value)}
          placeholder={appointmentNotePlaceholder}
        />
      </div>

      {/* 1. Consolidated error display section */}
      {(firstNameError || vehicleError || phoneError || emailError || appointmentNoteError) && (
        <motion.div
          className="bg-danger/5 border border-danger/20 rounded-lg p-4 mb-4 space-y-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}>
          <div className="flex items-center gap-2 mb-3">
            <FiAlertCircle className="text-danger flex-shrink-0" />
            <h4 className="text-danger font-medium">Please fix the following errors:</h4>
          </div>
          <div className="space-y-1.5">
            {firstNameError && (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-danger rounded-full mt-2 flex-shrink-0" />
                <p className="text-danger text-sm">
                  <span className="font-medium">First name:</span> {firstNameError}
                </p>
              </div>
            )}
            {vehicleError && (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-danger rounded-full mt-2 flex-shrink-0" />
                <p className="text-danger text-sm">
                  <span className="font-medium">Vehicle:</span> {vehicleError}
                </p>
              </div>
            )}
            {phoneError && (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-danger rounded-full mt-2 flex-shrink-0" />
                <p className="text-danger text-sm">
                  <span className="font-medium">Phone:</span> {phoneError}
                </p>
              </div>
            )}
            {emailError && (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-danger rounded-full mt-2 flex-shrink-0" />
                <p className="text-danger text-sm">
                  <span className="font-medium">Email:</span> {emailError}
                </p>
              </div>
            )}
            {appointmentNoteError && (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-danger rounded-full mt-2 flex-shrink-0" />
                <p className="text-danger text-sm">
                  <span className="font-medium">Notes:</span> {appointmentNoteError}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <button
        className="bg-brand hover:bg-brand/90 disabled:bg-brand/50 text-title-foreground px-6 py-3 rounded w-full font-medium mb-4 transition-colors"
        onClick={handleBook}
        tabIndex={5}
        disabled={
          !selectedDate ||
          !selectedTime ||
          !firstName ||
          !phone ||
          !!firstNameError ||
          !!phoneError ||
          !!appointmentNoteError ||
          !!vehicleError
        }>
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
