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
      <h3 className="text-lg font-semibold mb-2 text-subTitle">Booked Appointments</h3>
      <ul>
        {appointments?.length ? (
          appointments.map(appt => (
            <li
              key={appt.id}
              className={`bg-foreground-accent p-2 mb-2 rounded flex justify-between items-center ${editingId ? "bg-brand/5 border border-brand" : ""}`}>
              <div>
                <span className="text-title">
                  {moment(`${appt.date} ${appt.time}`).tz(appt.timezone).format("DD MMM YYYY HH:mm")} ({appt.timezone})
                </span>
                <p className="text-subTitle">{appt.note}</p>
              </div>
              <div>
                {editingId ? (
                  <button onClick={handleBook} className="text-success mr-2">
                    <MdOutlineDoneOutline />
                  </button>
                ) : (
                  <button onClick={() => onEdit(appt)} className="text-info mr-2">
                    <MdEdit />
                  </button>
                )}
                <button onClick={() => onDelete(appt.id)} className="text-danger">
                  <MdDelete />
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-subTitle">No appointments</p>
        )}
      </ul>
    </div>
  )
}
