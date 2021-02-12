import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../reservations.service'

import { Reservation } from '../reservation';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  reservations: Reservation[] = [
    //{ id: 0, roomId: 0, userId: 0, startDate: new Date(), endDate: new Date(), arrivalTime: new Date(), parking: true, massage: false, extraTowels: true}
  ];

  constructor(
    private reservationService: ReservationsService
  ) { }

  ngOnInit(): void {
    this.reservations = this.reservationService.reservations
  }

}
