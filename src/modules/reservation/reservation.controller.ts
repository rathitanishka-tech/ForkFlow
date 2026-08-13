import { ReservationService } from "./reservation.service";
import { ReservationWithGuest } from "./reservation.types";
import { createReservationSchema, updateReservationSchema } from "./reservation.validator";

/**
 * Controller for handling reservation-related API requests.
 *
 * All methods that access reservations receive the server-resolved
 * restaurantId to enforce data isolation.
 */
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  async getReservations(restaurantId: string): Promise<ReservationWithGuest[]> {
    return this.reservationService.getReservations(restaurantId);
  }

  async create(
    body: unknown,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    const input = createReservationSchema.parse(body);
    return this.reservationService.createReservation({
      ...input,
      restaurantId,
    });
  }

  async confirm(
    id: string,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    return this.reservationService.confirmReservation(id, restaurantId);
  }

  async seatGuest(
    id: string,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    return this.reservationService.seatGuest(id, restaurantId);
  }

  async completeDining(
    id: string,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    return this.reservationService.completeDining(id, restaurantId);
  }

  async cancel(
    id: string,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    return this.reservationService.cancelReservation(id, restaurantId);
  }

  async markNoShow(
    id: string,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    return this.reservationService.markNoShow(id, restaurantId);
  }

  async update(
    id: string,
    body: unknown,
    restaurantId: string,
  ): Promise<ReservationWithGuest> {
    const input = updateReservationSchema.parse(body);
    return this.reservationService.updateReservation(id, restaurantId, input);
  }

  async delete(id: string, restaurantId: string): Promise<void> {
    return this.reservationService.deleteReservation(id, restaurantId);
  }
}
