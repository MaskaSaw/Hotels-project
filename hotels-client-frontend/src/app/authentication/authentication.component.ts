import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.less']
})
export class AuthenticationComponent implements OnInit {

  login: string = '';
  password: string = '';
  registerLogin: string = '';
  registerName: string = '';
  registerSurname: string = '';
  registerPassword: string = '';
  registerPasswordRepeat: string = '';

  constructor(
    public authService: AuthService
  ) { }

  loginUser() {
    console.log("you are logging in");
    this.authService.login(
      { 
        id: 0, 
        login: this.login,
        password: this.password, 
        role: "User"
      } as User
    );  
  }

  registerUser() {
    this.authService.register(
      { 
        id: 0,
        login: this.registerLogin,
        name: this.registerName,
        surname: this.registerSurname, 
        password: this.registerPassword, 
        role: "User"
      } as User
    );
  }

  checkAllFields(): boolean {
    if (
      this.registerLogin === ''
      || this.registerName === '' 
      || this.registerSurname === '' 
      || this.registerPassword === '' 
      || this.registerPasswordRepeat === ''
    ) {
      return false;
    }

    if (this.registerPassword !== this.registerPasswordRepeat) {
      return false;
    }

    return true;
  }

  checkPassword(): boolean {
    if (this.registerPassword.length > 4 && this.registerPassword.length < 10) {
      return true;
    }

    return false;
  }

  ngOnInit(): void {
  }

}
