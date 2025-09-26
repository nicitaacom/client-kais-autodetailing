import moment from "moment-timezone"
import { MdEdit, MdDelete } from "react-icons/md"
import { MdOutlineDoneOutline } from "react-icons/md"
import { IDBAppointment } from "./types/IDBAppointment"

interface BookedAppointmentsProps {
  appointments: IDBAppointment[]
  onEdit: (appt: IDBAppointment) => void
  handleBook: () => Promise<void>
  onDelete: (id: string) => void
  editingId: string | null
}

export default function BookedAppointments({
  appointments,
  onEdit,
  handleBook,
  onDelete,
  editingId,
}: BookedAppointmentsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-white drop-shadow-sm">Booked Appointments</h3>
      <ul className="space-y-3">
        {appointments.length ? (
          appointments.map(appt => (
            <li
              key={appt.id}
              className={`bg-black/30 backdrop-blur-sm p-4 rounded-xl border transition-all duration-300 flex justify-between items-center hover:scale-[1.01] ${
                editingId === appt.id
                  ? "bg-brand/20 border-brand/50 shadow-lg shadow-brand/20"
                  : "border-white/10 hover:border-brand/30 hover:bg-brand/20"
              }`}>
              <div className="flex-1">
                <span className="text-white font-medium drop-shadow-sm">
                  {moment(`${appt.date} ${appt.time}`).tz(appt.timezone).format("DD MMM YYYY HH:mm")} ({appt.timezone})
                </span>
                <p className="text-white/70 text-sm mt-1">{appt.note}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {editingId === appt.id ? (
                  <button
                    onClick={handleBook}
                    className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-all duration-200 backdrop-blur-sm">
                    <MdOutlineDoneOutline size={20} />
                  </button>
                ) : (
                  <button
                    onClick={() => onEdit(appt)}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200 backdrop-blur-sm">
                    <MdEdit size={20} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(appt.id)}
                  className="p-2 text-brand hover:text-brand hover:bg-brand/20 rounded-lg transition-all duration-200 backdrop-blur-sm">
                  <MdDelete size={20} />
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
            <p className="text-white/70">No appointments</p>
          </div>
        )}
      </ul>
    </div>
  )
}
