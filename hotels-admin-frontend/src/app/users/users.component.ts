import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { ReservationsService } from '../reservations.service';
import { Reservation } from '../reservation';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  //TODO: create users.service and implement methods for receiving and transmitting data to the server
  users: User[] = [
    {
      id: 0, 
      login: 'login', 
      password: 'password', 
      role: 'role', 
      reservations: [
      { 
        id: 0, 
        roomId: 0, 
        userId: 0, 
        startDate: new Date(), 
        endDate: new Date(), 
        arrivalTime: new Date(), 
        parking: true, 
        massage: false, 
        extraTowels: true
      }
    ]}
  ];

  constructor(
    private reservationsService: ReservationsService,
    private router: Router
  ) { }

  openReservations(userId: number): void {
    this.reservationsService.saveReservations(this.users.find(user => user.id == userId)?.reservations as Reservation[]);
    this.router.navigate([`/users/${userId}/reservations`]);
  }

  ngOnInit(): void {
  }

}
