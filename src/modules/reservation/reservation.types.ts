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

  customerName: string;

  phone: string;

  reservationDate: Date;

  guests: number;

  occasion?: string | null;

  status: ReservationStatus;

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
