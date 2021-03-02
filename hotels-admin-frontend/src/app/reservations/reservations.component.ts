import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { ReservationsService } from './reservations.service';
import { Reservation } from '../reservation';
import { AuthService } from '../login/auth.service';

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
  edit: boolean;

  private routeSubscription: Subscription;
  constructor(
      private reservationsService: ReservationsService,
      private route: ActivatedRoute,
      private authService: AuthService
    ) { 
      if (this.authService.userLoggedIn) { 
        this.routeSubscription = route.params.subscribe(params=>this.id=params['id']);
        this.reservation = new Reservation();
      }
      else {
        this.authService.logout();
      }     
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

    this.edit = false;
  }

  addReservation(): void {
    if (this.authService.userLoggedIn) { 
      this.reservationsService.addReservation(this.reservation)
        .subscribe(reservation => {
          if (reservation !== undefined) {
            this.reservations.push(reservation);
          }
        });
    this.reservation = new Reservation();
    }
    else {
      this.authService.logout();
    }  
  }

  editMode(reservationId: number): void {
    this.reservation = this.reservations.find(reservation => reservation.id === reservationId);
    this.edit = true;
  }

  updateReservation(): void {
    if (this.authService.userLoggedIn) { 
      this.reservationsService.updateReservation(this.reservation)
        .subscribe();
      this.cancelEdit(); 
    }
    else {
      this.authService.logout();
    }
    
  }

  deleteReservation(reservationId: number): void {
    if (this.authService.userLoggedIn) { 
      this.reservations = this.reservations.filter(reservation => reservation.id !== reservationId);
      this.reservationsService.deleteReservation(reservationId).subscribe();
    }
    else {
      this.authService.logout();
    }   
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
