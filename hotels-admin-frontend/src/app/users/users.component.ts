import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../user';
import { ReservationsService } from '../reservations/reservations.service';
import { UsersService } from './users.service'
import { Reservation } from '../reservation';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  //TODO: create users.service and implement methods for receiving and transmitting data to the server
  users: User[];

  constructor(
    private reservationsService: ReservationsService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  openReservations(userId: number): void {
    this.reservationsService.storeUserReservations(this.users.find(user => user.id == userId)?.reservations as Reservation[]);
    this.router.navigate([`/users/${userId}/reservations`]);
  }

  deleteUser(userId: number): void {
    this.users = this.users.filter(user => user.id !== userId);
    this.usersService.deleteUser(userId).subscribe();
  }

  getUsers(): void {
    this.usersService.getUsers()
      .subscribe(users => this.users = users);   
  }

}
