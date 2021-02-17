import { Component, OnInit } from '@angular/core';
import { AuthService } from './login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'hotels-admin-frontend';

  constructor(
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
  }

}
