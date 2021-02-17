import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ReservationsService } from './reservations.service';
import { Reservation } from '../reservation';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  reservations: Reservation[];
  id: number;

  private routeSubscription: Subscription;
  constructor(
      private reservationsService: ReservationsService,
      private route: ActivatedRoute
    ) { 
      this.routeSubscription = route.params.subscribe(params=>this.id=params['id']);
    }
  
  //TODO: implement methods in reservations.service for receiving and transmitting data to the server
  ngOnInit(): void { 
    let reservationsFromService = this.reservationsService.takeReservations();
    if (reservationsFromService !== undefined) {
      this.reservations = reservationsFromService;
    }
    else {
      if (this.route.toString().includes('rooms')) {
        this.reservationsService.getReservations(this.id,'room')
          .subscribe(reservations => this.reservations = reservations);
      }
      else if (this.route.toString().includes('users')) {
        this.reservationsService.getReservations(this.id,'user')
          .subscribe(reservations => this.reservations = reservations);
      }
    }
  }

  deleteReservation(reservationId: number): void {
    this.reservations = this.reservations.filter(reservation => reservation.id !== reservationId);
    this.reservationsService.deleteReservation(reservationId).subscribe();
  }

}
