import { Component, OnInit } from '@angular/core';
import { Reservation } from '../reservation';
import { ReservationsService } from './reservations.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.less']
})
export class ReservationComponent implements OnInit {

  reservation: Reservation = new Reservation;
  roomCost: number = 0;
  
  constructor(
    private reservationsService: ReservationsService,
  ) { }

  ngOnInit(): void {
    this.reservation = this.reservationsService.takeReservation();
    this.roomCost = this.reservationsService.getRoomCost();
  }

  getSummary(): number {
    let summary = this.roomCost * this.getDatesDiff();
    this.reservation.reservationServices.forEach (service => summary += service.cost);
    return summary;
  }

  getDatesDiff(): number {
    const a = moment(this.reservation.endDate).startOf('day');
    const b = moment(this.reservation.startDate).startOf('day');
    return a.diff(b, 'days');
  }

  test(): void {
    console.log("test");
  }

}
