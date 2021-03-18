import { Component, OnInit } from '@angular/core';
import { Reservation } from '../reservation';
import { ReservationsService } from './reservations.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.less']
})
export class ReservationComponent implements OnInit {

  reservation: Reservation = new Reservation;
  
  constructor(
    private reservationsService: ReservationsService
  ) { }

  ngOnInit(): void {
    this.reservation = this.reservationsService.takeReservation()
  }

}
