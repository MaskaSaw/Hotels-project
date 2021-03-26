import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Room } from '../room';
import { RoomsService } from './rooms.service';
import { Reservation } from '../reservation';
import { ReservationsService } from '../reservation/reservations.service';
import { Service } from '../service';
import { AuthService } from '../authentication/auth.service';
import { ReservationService } from '../reservationService';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit {

  room: Room = new Room();
  id : number = 0;
  reserving: boolean = false;
  reservation: Reservation = new Reservation();
  services: Service[] = [];
  includedServices: boolean[] = [];

  constructor(
    private roomsService: RoomsService,
    private authService: AuthService,
    private reservationsService: ReservationsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.getRoom();
    this.roomsService.getServices(this.id)
      .subscribe(services => this.services = services);
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
    this.reservation.userId = this.authService.getId;
    const dates = JSON.parse(localStorage.getItem('dates')!);
    this.reservation.startDate = dates.startDate;
    this.reservation.endDate = dates.endDate;
    for (let i = 0; i < this.services.length; i++) {
      this.includedServices.push(false);
    }
  }

  confirmReservation() {
    this.includeServices();
    this.reservationsService.saveReservation(this.reservation);
    this.router.navigate([`/reservation/confirm`]);
  }

  includeServices(): void {
    this.reservation.reservationServices = [];
    this.services.forEach((service, i) => {
      if (this.includedServices[i]) {
        const newService = new ReservationService();
        newService.name = service.name;
        newService.cost = service.cost;
        this.reservation.reservationServices.push(newService);
      }
    })
  }

}
