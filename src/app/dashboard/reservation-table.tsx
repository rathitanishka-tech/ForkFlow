function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Confirmed: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30 dark:text-emerald-300 dark:ring-emerald-400/20",
    Seated: "bg-sky-500/10 text-sky-700 ring-sky-500/30 dark:text-sky-300 dark:ring-sky-400/20",
    Pending: "bg-amber-500/10 text-amber-700 ring-amber-500/30 dark:text-amber-300 dark:ring-amber-400/20",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status] ?? "bg-muted text-muted-foreground ring-border"}`}
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
    <div className="rounded-2xl border border-border bg-card shadow-xs">
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Recent Reservations</h2>
          <p className="mt-1 text-xs text-muted-foreground">Latest bookings and guest arrivals</p>
        </div>
      </div>
      <div className="overflow-x-auto pb-2">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Guest</th>
              <th className="px-5 py-3 font-semibold">Table</th>
              <th className="px-5 py-3 font-semibold">Time</th>
              <th className="px-5 py-3 font-semibold">Guests</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No reservations for today.
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr
                  key={`${reservation.guest}-${reservation.time}`}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    {reservation.guest}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {reservation.table}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{reservation.time}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {reservation.guests}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={reservation.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
