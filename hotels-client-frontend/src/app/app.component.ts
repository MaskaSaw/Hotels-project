import { Component } from '@angular/core';
import { AuthService } from './authentication/auth.service';
import { SignalRService } from './signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'hotels-client-frontend';
  userLoggedIn: boolean = false;

  constructor(
    public authService: AuthService
  ) {
    this.userLoggedIn = this.authService.userLoggedIn;
  }

  logout(): void {
    this.authService.logout();
    this.userLoggedIn = false;
  }
}
