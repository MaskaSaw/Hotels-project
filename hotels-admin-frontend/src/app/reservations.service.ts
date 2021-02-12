import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation } from './reservation'

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  reservations: Reservation[];

  constructor(
    private router: Router
  ) { }
}
