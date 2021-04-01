import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { RoomsService } from '../room/rooms.service';
import { Room } from '../room';
import { Reservation } from '../reservation';
import { ReservationsService } from './reservations.service';
import { UserReservation } from '../user-reservation';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.less']
})
export class ReservationComponent implements OnInit {

  reservation: Reservation = new Reservation;
  room: Room = new Room();
  createdReservation: UserReservation = new UserReservation();
  
  constructor(
    private reservationsService: ReservationsService, 
    private roomsService: RoomsService,
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.reservation = this.reservationsService.takeReservation();
    this.roomsService.getRoom(this.reservation.roomId)
      .subscribe(room => this.room = room)
  }

  getSummary(): number {
    let summary = this.room.cost * this.getDatesDiff();
    this.reservation.reservationServices.forEach (service => summary += service.cost);
    return summary;
  }

  getDatesDiff(): number {
    const a = moment(this.reservation.endDate).startOf('day');
    const b = moment(this.reservation.startDate).startOf('day');
    return a.diff(b, 'days');
  }

  addReservation(): void {
    this.reservationsService.addReservation(this.reservation)
      .subscribe(reservation => this.createdReservation = reservation);
    this.router.navigate(['/hotels']);
  }

  goBack(): void {
    this.location.back();
  }

}
