import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ReservationsService } from './reservations.service';
import { Reservation } from '../reservation';
import { RESERVATION } from '../initializer';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.less']
})
export class ReservationsComponent implements OnInit {

  reservations: Reservation[];
  reservation: Reservation;
  routePart: string;
  id: number;

  private routeSubscription: Subscription;
  constructor(
      private reservationsService: ReservationsService,
      private route: ActivatedRoute
    ) { 
      this.routeSubscription = route.params.subscribe(params=>this.id=params['id']);
      this.reservation = Object.assign({}, RESERVATION);
    }
  
  ngOnInit(): void { 
    let reservationsFromService = this.reservationsService.takeReservations();
    if (this.isRoom()) {
      this.routePart = 'room';
    }
    else if (this.isUser()) {
      this.routePart = 'user'
    }
    if (reservationsFromService !== undefined) {
      this.reservations = reservationsFromService;
    }
    else {
      this.reservationsService.getReservations(this.id, this.routePart)
        .subscribe(reservations => this.reservations = reservations
      );
    }
  }

  addReservation(): void {
    this.reservationsService.addReservation(this.reservation)
      .subscribe(reservation => {
        if (reservation !== undefined) {
          this.reservations.push(reservation)
        }
      });
    this.reservation = Object.assign({}, RESERVATION); 
  }

  deleteReservation(reservationId: number): void {
    this.reservations = this.reservations.filter(reservation => reservation.id !== reservationId);
    this.reservationsService.deleteReservation(reservationId).subscribe();
  }

  isRoom(): boolean {
    if (this.route.toString().includes('rooms')) {
      this.reservation.roomId = this.id;
      return true
    }

    return false
  }

  isUser(): boolean {
    if (this.route.toString().includes('users')) {
      this.reservation.userId = this.id;
      return true
    }

    return false
  } 
}
