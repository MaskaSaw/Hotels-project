import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { UsersService } from './users.service';
import { AuthService } from '../login/auth.service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
  providers: [ AuthGuard ]
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  user: User = new User;
  edit: boolean = false;
  editFormOn: boolean = false;

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
    this.router.navigate([`/users/${userId}/reservations`]);
  }

  addUser(): void {
    this.usersService.addUser(this.user)
      .subscribe(user =>  {
        if (user !== undefined) {
          this.users.push(user)
        }
      });

    this.closeEditForm();
  }

  openEditForm(): void {
    this.editFormOn = true;
  }

  closeEditForm(): void {
    this.editFormOn = false;
    this.user = new User();
  }

  editMode(userId: number): void {
    window.scroll(0,0);
    this.editFormOn = true;
    this.user = this.users.find(user => user.id === userId)!;
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
    this.editFormOn = false;
    this.user = new User();
    this.edit = false;
  }

  getUsers(): void {
    this.usersService.getUsers()
      .subscribe(users => this.users = users);   
  }

}
