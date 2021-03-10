import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ReservationsService } from './reservations.service';
import { Reservation } from '../reservation';
import { AuthService } from '../login/auth.service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.less'],
  providers: [ AuthGuard ]
})
export class ReservationsComponent implements OnInit {

  reservations: Reservation[];
  reservation: Reservation;
  routePart: string;
  id: number;
  edit: boolean;

  private routeSubscription: Subscription;
  constructor(
      private reservationsService: ReservationsService,
      private route: ActivatedRoute,
      private authService: AuthService
    ) { 
      this.routeSubscription = route.params.subscribe(params=>this.id=params['id']);
      this.reservation = new Reservation(); 
    }
  
  ngOnInit(): void { 
    let reservationsFromService = this.reservationsService.takeReservations();
    if (this.isRoom()) {
      this.routePart = 'room';
    }
    else if (this.isUser()) {
      this.routePart = 'user';
    }
    if (reservationsFromService !== undefined) {
      this.reservations = reservationsFromService;
    }
    else {
      this.reservationsService.getReservations(this.id, this.routePart)
        .subscribe(reservations => this.reservations = reservations
      );
    }

    this.dateIsValid = true;
    this.edit = false;
  }

  addReservation(): void {
    this.reservationsService.addReservation(this.reservation)
      .subscribe(reservation => {
        if (reservation !== undefined) {
          this.reservations.push(reservation);
        }
      });

    this.reservation = new Reservation();
  }

  editMode(reservationId: number): void {
    this.reservation = this.reservations.find(reservation => reservation.id === reservationId);
    this.edit = true;
  }

  updateReservation(): void {
    this.reservationsService.updateReservation(this.reservation)
      .subscribe();
    this.cancelEdit();
  }

  deleteReservation(reservationId: number): void {
    this.reservations = this.reservations.filter(reservation => reservation.id !== reservationId);
    this.reservationsService.deleteReservation(reservationId).subscribe();  
  }

  cancelEdit(): void {
    this.reservation = new Reservation();
    this.edit = false;
  }

  parseDate(dateString: string): Date{
    if (dateString) {
      return new Date(dateString);
    }
    
    return null;
  }

  isRoom(): boolean {
    if (this.route.toString().includes('rooms')) {
      this.reservation.roomId = this.id;
      return true;
    }

    return false;
  }

  isUser(): boolean {
    if (this.route.toString().includes('users')) {
      this.reservation.userId = this.id;
      return true;
    }

    return false;
  } 
}
