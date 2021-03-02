import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { UsersService } from './users.service';
import { AuthService } from '../login/auth.service';

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
    private authService: AuthService,
    private router: Router,
  ) { 
    if (this.authService.userLoggedIn) {
      this.user = new User();
    }
    else {
      this.authService.logout();
    }  
  }

  ngOnInit(): void {
    this.getUsers();
    this.edit = false;
  }

  openReservations(userId: number): void {
    if (this.authService.userLoggedIn) {
      this.router.navigate([`/users/${userId}/reservations`]);
    }
    else {
      this.authService.logout();
    }
  }

  addUser(): void {
    if (this.authService.userLoggedIn) {
      this.usersService.addUser(this.user)
        .subscribe(user =>  {
          if (user !== undefined) {
            this.users.push(user)
          }
        });

      this.user = new User();
    }
    else {
      this.authService.logout();
    } 
  }

  editMode(userId: number): void {
    this.user = this.users.find(user => user.id === userId);
    this.user.password = "";
    this.edit = true;
  }

  updateUser(): void {
    if (this.authService.userLoggedIn) {
      this.usersService.updateUser(this.user)
        .subscribe();
      this.cancelEdit();
    }
    else {
      this.authService.logout();
    }  
  }

  deleteUser(userId: number): void {
    if (this.authService.userLoggedIn) {
      this.users = this.users.filter(user => user.id !== userId);
      this.usersService.deleteUser(userId).subscribe();
    }
    else {
      this.authService.logout();
    }   
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
