function Card({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section
      className={`rounded-[1.5rem] border border-border bg-card ${className}`}
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
    <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[#7f948b]">{subtitle}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Confirmed: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
    Seated: "bg-sky-500/10 text-sky-300 ring-sky-400/20",
    Pending: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
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
  guests: number | string;
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
          <thead className="border-b border-border bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Guest</th>
              <th className="px-5 py-3 font-semibold">Table</th>
              <th className="px-5 py-3 font-semibold">Time</th>
              <th className="px-5 py-3 font-semibold">Guests</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#29443C]">
            {reservations.map((reservation) => (
              <tr
                key={`${reservation.guest}-${reservation.time}`}
                className="hover:bg-muted"
              >
                <td className="px-5 py-4 font-medium text-foreground">
                  {reservation.guest}
                </td>
                <td className="px-5 py-4 text-slate-400">
                  {reservation.table}
                </td>
                <td className="px-5 py-4 text-slate-400">{reservation.time}</td>
                <td className="px-5 py-4 text-slate-400">
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
