import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { ReservationsService } from '../reservations/reservations.service';
import { UsersService } from './users.service'
import { Reservation } from '../reservation';
import { USER } from '../initializer';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {

  users: User[];
  user: User;

  constructor(
    private reservationsService: ReservationsService,
    private usersService: UsersService,
    private router: Router,
  ) { 
    this.user = Object.assign({}, USER);
  }

  ngOnInit(): void {
    this.getUsers();
  }

  openReservations(userId: number): void {
    this.reservationsService.storeUserReservations(this.users.find(user => user.id == userId)?.reservations as Reservation[]);
    this.router.navigate([`/users/${userId}/reservations`]);
  }

  addUser(): void {
    this.usersService.addUser(this.user)
      .subscribe(user =>  {
        if (user !== undefined) {
          this.users.push(user)
        }
      });
    this.user = Object.assign({}, USER);
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
