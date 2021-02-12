import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { ReservationsService } from '../reservations.service'
import { Reservation } from '../reservation';
import { Router } from '@angular/router'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [
    {id: 0, login: 'login', password: 'password', role: 'role', reservations: [
      { id: 0, roomId: 0, userId: 0, startDate: new Date(), endDate: new Date(), arrivalTime: new Date(), parking: true, massage: false, extraTowels: true}
    ]}
  ];

  constructor(
    private reservationsService: ReservationsService,
    private router: Router
  ) { }

  openReservations(userId: number): void {
    this.reservationsService.reservations = this.users.find(user => user.id == userId)?.reservations as Reservation[];
    this.router.navigate([`/users/${userId}/reservations`]);
  }

  ngOnInit(): void {
  }

}