import { Component, OnInit } from '@angular/core';
import { Reservation } from '../reservation';
import { ReservationsService } from './reservations.service';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { RoomsService } from '../room/rooms.service';
import { Room } from '../room';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.less']
})
export class ReservationComponent implements OnInit {

  reservation: Reservation = new Reservation;
  room: Room = new Room();
  
  constructor(
    private reservationsService: ReservationsService,
    private roomsService: RoomsService,
    private location: Location
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

  goBack(): void {
    this.location.back();
  }

}
