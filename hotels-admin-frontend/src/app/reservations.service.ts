import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Reservation } from './reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  reservations: Reservation[] = [];

  constructor(
  ) { }

  saveReservations( reservations: Reservation[]): void {
    this.reservations = reservations;
    //localStorage.setItem('reservations', JSON.stringify(this.reservations));
  }

  getReservations(): Reservation[] {
    return this.reservations
  }
}
