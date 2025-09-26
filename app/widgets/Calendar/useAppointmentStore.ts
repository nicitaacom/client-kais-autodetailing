import { create } from "zustand"
import { IDBAppointment } from "./types/IDBAppointment"

interface AppointmentState {
  selectedDate: string | null
  selectedTime: string | null
  selectedTimezone: string // e.g Europe/London
  channel: string // e.g telegram/email/google-meet

  sendNotificationTo: string
  inputNotificationTo: string
  step: number
  editingId: string | null
  appointments: IDBAppointment[]
  error: string
  userId: string

  appointmentNote: string
  appointmentNoteError: string
  setAppointmentNote: (note: string) => void
  setAppointmentNoteError: (note: string) => void

  firstName: string
  firstNameError: string
  setFirstName: (firstName: string) => void
  setFirstNameError: (firstName: string) => void

  phone: string
  phoneError: string
  setPhone: (phone: string) => void
  setPhoneError: (phoneError: string) => void

  setSelectedDate: (date: string) => void
  setSelectedTime: (time: string) => void
  setSelectedTimezone: (tz: string) => void
  setChannel: (ch: string) => void

  email?: string
  emailError: string
  setEmail: (email: string) => void
  setEmailError: (emailError: string) => void

  vehicle?: string
  vehicleError: string
  setVehicle: (vehicle: string) => void
  setVehicleError: (vehicleError: string) => void

  setSendNotificationTo: (to: string) => void
  setInputNotificationTo: (input: string) => void
  setNextStep: () => void
  setEditingId: (id: string | null) => void
  setAppointments: (appts: IDBAppointment[]) => void
  setError: (error: string) => void
  setUserId: (error: string) => void

  resetInputs: () => void
}

export const useAppointmentStore = create<AppointmentState>(set => ({
  selectedDate: null,
  selectedTime: null,
  selectedTimezone: "Europe/London",

  channel: "google-meets",

  sendNotificationTo: "telegram",
  inputNotificationTo: "",
  step: 4,
  editingId: null,
  appointments: [],
  error: "",
  userId: "",

  phone: "",
  phoneError: "",
  setPhone: phone => set({ phone }),
  setPhoneError: phoneError => set({ phoneError }),

  appointmentNote: "",
  appointmentNoteError: "",
  setAppointmentNote: appointmentNote => set({ appointmentNote }),
  setAppointmentNoteError: appointmentNoteError => set({ appointmentNoteError }),

  firstName: "",
  firstNameError: "",
  setFirstName: firstName => set({ firstName }),
  setFirstNameError: firstNameError => set({ firstNameError }),

  setSelectedDate: selectedDate => set({ selectedDate }),
  setSelectedTime: selectedTime => set({ selectedTime }),
  setSelectedTimezone: selectedTimezone => set({ selectedTimezone }),
  setChannel: channel => set({ channel }),

  email: "",
  emailError: "",
  setEmail: email => set({ email }),
  setEmailError: emailError => set({ emailError }),

  vehicle: "",
  vehicleError: "",
  setVehicle: vehicle => set({ vehicle }),
  setVehicleError: vehicleError => set({ vehicleError }),

  setSendNotificationTo: sendNotificationTo => set({ sendNotificationTo }),
  setInputNotificationTo: inputNotificationTo => set({ inputNotificationTo }),
  setNextStep: () => set(s => ({ step: s.step + 1 })),
  setEditingId: editingId => set({ editingId }),
  setAppointments: appointments => set({ appointments }),
  setError: error => set({ error }),
  setUserId: userId => set({ userId }),

  resetInputs: () =>
    set({
      selectedDate: "",
      selectedTime: "",
      firstName: "",
      phone: "",
      email: "",
      appointmentNote: "",
    }),
}))
