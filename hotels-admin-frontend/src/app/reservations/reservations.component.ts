import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';

import { ReservationsService } from '../reservations.service';
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
      private reservationService: ReservationsService,
      private route: ActivatedRoute
    ) { 
      this.routeSubscription = route.params.subscribe(params=>this.id=params['id']);
    }
  
  //TODO: implement methods in reservations.service for receiving and transmitting data to the server
  ngOnInit(): void { 
    let reservationsFromService = this.reservationService.getReservations();
    if (reservationsFromService !== undefined) {
      this.reservations = reservationsFromService;
    }
    else {
      if (this.route.toString().includes('users')) {
        this.reservations = [
          {
            id: 0, 
            roomId: 0, 
            userId: this.id, 
            startDate: new Date(), 
            endDate: new Date(), 
            arrivalTime: new Date(), 
            parking: true, 
            massage: false, 
            extraTowels: true
          }
        ];
      }
      if (this.route.toString().includes('rooms')) {
        this.reservations = [
          {
            id: 0, 
            roomId: this.id, 
            userId: 0, 
            startDate: new Date(), 
            endDate: new Date(), 
            arrivalTime: new Date(), 
            parking: true, 
            massage: false, 
            extraTowels: true
          }
        ];
      }
    }
  }

}
