export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SEATED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export interface ReservationResponse {
  id: string;
  restaurantId: string;
  tableId: string;
  guestId: string;
  reservationTime: Date;
  partySize: number;
  occasion?: string | null;
  seatingPreference?: string | null;
  noisePreference?: string | null;
  status: ReservationStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateReservationResult = ReservationResponse;

export interface ReservationError {
  message: string;
  code?: string;
  field?: string;
}

export interface ReservationFilters {
  restaurantId?: string;
  tableId?: string;
  guestId?: string;
  status?: ReservationStatus;
  from?: Date;
  to?: Date;
}
