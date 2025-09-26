export interface IDBAppointment {
  id: string
  created_at: string
  user_id: string
  date: string
  time: string
  timezone: string
  first_name: string
  phone: string
  email?: string
  note: string
}
