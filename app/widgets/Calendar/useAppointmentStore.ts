import { create } from "zustand"

export type TAppointment = {
  id: string
  date: string
  time: string
  timezone: string
  note: string
  channel: string
  notification_to: string
}

interface AppointmentState {
  selectedDate: string | null
  selectedTime: string | null
  selectedTimezone: string
  appointmentNote: string
  channel: string
  sendNotificationTo: string
  inputNotificationTo: string
  step: number
  editingId: string | null
  appointments: TAppointment[]
  error: string
  userId: string
  setSelectedDate: (date: string) => void
  setSelectedTime: (time: string) => void
  setSelectedTimezone: (tz: string) => void
  setAppointmentNote: (note: string) => void
  setChannel: (ch: string) => void
  setSendNotificationTo: (to: string) => void
  setInputNotificationTo: (input: string) => void
  setNextStep: () => void
  setEditingId: (id: string | null) => void
  setAppointments: (appts: TAppointment[]) => void
  setError: (error: string) => void
  setUserId: (error: string) => void
}

export const useAppointmentStore = create<AppointmentState>(set => ({
  selectedDate: null,
  selectedTime: null,
  selectedTimezone: "Europe/London",
  appointmentNote: "",
  channel: "google-meets",
  sendNotificationTo: "telegram",
  inputNotificationTo: "",
  step: 4,
  editingId: null,
  appointments: [],
  error: "",
  userId: "",
  setSelectedDate: selectedDate => set({ selectedDate }),
  setSelectedTime: selectedTime => set({ selectedTime }),
  setSelectedTimezone: selectedTimezone => set({ selectedTimezone }),
  setAppointmentNote: appointmentNote => set({ appointmentNote }),
  setChannel: channel => set({ channel }),
  setSendNotificationTo: sendNotificationTo => set({ sendNotificationTo }),
  setInputNotificationTo: inputNotificationTo => set({ inputNotificationTo }),
  setNextStep: () => set(s => ({ step: s.step + 1 })),
  setEditingId: editingId => set({ editingId }),
  setAppointments: appointments => set({ appointments }),
  setError: error => set({ error }),
  setUserId: userId => set({ userId }),
}))
