import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.less']
})
export class AuthenticationComponent implements OnInit {

  login!: string;
  password!: string;
  registerLogin!: string;
  registerPassword!: string;
  registerPasswordRepeat!: string;

  constructor(
    private authService: AuthService
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
        password: this.registerPassword, 
        role: "User"
      } as User
    );
  }

  ngOnInit(): void {
  }

}
