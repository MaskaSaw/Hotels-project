import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: string;
  password: string;

  constructor(
    private authService: AuthService
  ) {}

  Login() {
    console.log("you are logging in");
    this.authService.login({ id: 0, login: this.login, password: this.password, role: "Admin"} as User);  
  }

  ngOnInit(): void {
  }

}
