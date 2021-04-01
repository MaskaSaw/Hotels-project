export class ReservationService {
  id: number;
  name: string;
  cost: number;
  reservationId: number;

  constructor() {
    this.id = 0;
    this.name = '';
    this.cost = 0;
    this.reservationId = 0;
  }
}