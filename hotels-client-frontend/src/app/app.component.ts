import { Component } from '@angular/core';
import { AuthService } from './authentication/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'hotels-client-frontend';

  constructor(
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
