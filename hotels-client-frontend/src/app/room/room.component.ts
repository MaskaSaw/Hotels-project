import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Room } from '../room';
import { RoomsService } from './rooms.service';
import { Reservation } from '../reservation';
import { ReservationsService } from '../reservation/reservations.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit {

  room: Room;
  id = +this.route.snapshot.paramMap.get('id');
  reserving: boolean;
  reservation: Reservation;

  constructor(
    private roomsService: RoomsService,
    private reservationsService: ReservationsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getRoom();
    this.reserving = false;
    this.reservation = new Reservation();
  }

  getRoom(): void {
    this.roomsService.getRoom(this.id)
      .subscribe(room => this.room = room);
  }

  goBack(): void {
    this.location.back();
  }

  initReservation(): void {
    this.reserving = true;
    this.reservation = new Reservation();
    this.reservation.roomId = this.id;
    this.reservation.userId = 16;
  }

  confirmReservation() {
    this.reservationsService.saveReservation(this.reservation);
    this.router.navigate([`/reservation/confirm`]);
  }

}
