import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

import { ReservationsService } from './reservations.service';
import { Reservation } from '../reservation';
import { RESERVATION } from '../initializer';
import { TimeSpan } from '../users/timespan';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.less']
})
export class ReservationsComponent implements OnInit {

  reservations: Reservation[];
  formattedTime: string;
  reservation: Reservation;
  routePart: string = '13:00';
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
    if (reservationsFromService !== undefined) {
      this.reservations = reservationsFromService;
    }
    else {
      if (this.route.toString().includes('rooms')) {
        this.routePart = 'room';
      }
      else if (this.route.toString().includes('users')) {
        this.routePart = 'user'
      }

      this.reservationsService.getReservations(this.id, this.routePart)
        .subscribe(reservations => this.reservations = reservations
      );
    }
  }

  addReservation(): void {
    this.reservation.arrivalTime = this.timeReverseFormatting(this.formattedTime);
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

  timeFormatting(rawTime: TimeSpan) : string {
    let formattedTime = rawTime.hours + ':' + rawTime.minutes;
    return moment(formattedTime, 'hh:mm').format('LT');
  }

  timeReverseFormatting(formattedTime: string): TimeSpan {
    let splitTime = formattedTime.split(':');
    return {
      ticks: 0,
      days: 0,
      hours: +splitTime[0],
      milliseconds: 0,
      minutes: +splitTime[1],
      seconds: 0,
      totalDays: 0,
      totalHours: 0,
      totalMilliseconds: 0,
      totalMinutes: 0,
      totalSeconds: 0
    }
  }

}
