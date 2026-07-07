import { ReservationService } from "./reservation.service";
import { ReservationResponse } from "./reservation.types";
import { createReservationSchema } from "./reservation.validator";

export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  async create(body: unknown): Promise<ReservationResponse> {
    const input = createReservationSchema.parse(body);

    return this.reservationService.createReservation(input);
  }
}
