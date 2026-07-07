function Card({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section
      className={`rounded-xl border border-neutral-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-neutral-950">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Seated: "bg-blue-50 text-blue-700 ring-blue-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}

interface Reservation {
  guest: string;
  table: string;
  time: string;
  guests: string;
  status: string;
}

export function ReservationTable({
  reservations,
}: {
  reservations: Reservation[];
}) {
  return (
    <Card>
      <SectionHeader
        title="Recent Reservations"
        subtitle="Latest bookings and guest arrivals"
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-170 text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Guest</th>
              <th className="px-5 py-3 font-semibold">Table</th>
              <th className="px-5 py-3 font-semibold">Time</th>
              <th className="px-5 py-3 font-semibold">Guests</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {reservations.map((reservation) => (
              <tr
                key={`${reservation.guest}-${reservation.time}`}
                className="hover:bg-neutral-50"
              >
                <td className="px-5 py-4 font-medium text-neutral-950">
                  {reservation.guest}
                </td>
                <td className="px-5 py-4 text-neutral-600">
                  {reservation.table}
                </td>
                <td className="px-5 py-4 text-neutral-600">
                  {reservation.time}
                </td>
                <td className="px-5 py-4 text-neutral-600">
                  {reservation.guests}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={reservation.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
