import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { UsersService } from './users.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {

  users: User[];
  user: User;
  edit: boolean;

  constructor(
    private usersService: UsersService,
    private router: Router,
  ) { 
    this.user = new User();
  }

  ngOnInit(): void {
    this.getUsers();
    this.edit = false;
  }

  openReservations(userId: number): void {
    this.router.navigate([`/users/${userId}/reservations`]);
  }

  addUser(): void {
    this.usersService.addUser(this.user)
      .subscribe(user =>  {
        if (user !== undefined) {
          this.users.push(user)
        }
      });
    this.user = new User();
  }

  editMode(userId: number): void {
    this.user = this.users.find(user => user.id === userId);
    this.user.password = "";
    this.edit = true;
  }

  updateUser(): void {
    this.usersService.updateUser(this.user)
      .subscribe();
    this.cancelEdit();
  }

  deleteUser(userId: number): void {
    this.users = this.users.filter(user => user.id !== userId);
    this.usersService.deleteUser(userId).subscribe();
  }

  cancelEdit(): void {
    this.user = new User();
    this.edit = false;
  }

  getUsers(): void {
    this.usersService.getUsers()
      .subscribe(users => this.users = users);   
  }

}
