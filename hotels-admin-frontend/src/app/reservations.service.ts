import { Injectable } from '@angular/core';

import { Reservation } from './reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  //TODO: create service methods for receiving and transmitting data to the server
  reservations: Reservation[];

  constructor(
  ) { }

  saveReservations( reservations: Reservation[]): void {
    this.reservations = reservations;
  }

  getReservations(): Reservation[] {
    return this.reservations
  }
}
