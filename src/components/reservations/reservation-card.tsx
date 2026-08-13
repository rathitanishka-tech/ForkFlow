import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReservationWithGuest } from "@/modules/reservation/reservation.types";
import { ReservationActions } from "./reservation-actions";
import {
  Clock,
  Users,
  Hash,
  CheckCircle,
  XCircle,
  CircleSlash,
  Ban,
} from "lucide-react";

type ReservationCardProps = {
  reservation: ReservationWithGuest;
  onActionSuccess: () => void;
};

const statusConfig = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500 text-white",
    icon: <Clock className="h-4 w-4" />,
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-500 text-white",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  SEATED: {
    label: "Seated",
    className: "bg-emerald-500 text-white",
    icon: <Users className="h-4 w-4" />,
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-gray-500 text-white",
    icon: <CircleSlash className="h-4 w-4" />,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-500 text-white",
    icon: <XCircle className="h-4 w-4" />,
  },
  NO_SHOW: {
    label: "No Show",
    className: "bg-neutral-400 text-white",
    icon: <Ban className="h-4 w-4" />,
  },
};

export function ReservationCard({
  reservation,
  onActionSuccess,
}: ReservationCardProps) {
  const { guest, tableId, reservationTime, partySize, status } = reservation;
  const config = statusConfig[status];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{guest.name}</CardTitle>
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="flex items-center">
            <Hash className="mr-2 h-4 w-4" /> Table: {tableId.slice(0, 8)}
          </p>
          <p className="flex items-center">
            <Users className="mr-2 h-4 w-4" /> Party Size: {partySize}
          </p>
          <p className="flex items-center">
            <Clock className="mr-2 h-4 w-4" /> Time:{" "}
            {new Date(reservationTime).toLocaleTimeString()}
          </p>
        </div>
        <ReservationActions
          reservation={reservation}
          onActionSuccess={onActionSuccess}
        />
      </CardContent>
    </Card>
  );
}
