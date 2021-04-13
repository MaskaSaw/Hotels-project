import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './authentication/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'hotels-client-frontend';
  toggle: boolean = false;
  userLoggedIn: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.userLoggedIn = this.authService.userLoggedIn;
  }

  public get isHotels(): boolean {
    if (this.router.url === '/hotels') {
      return true;
    }

    return false;
  }

  logout(): void {
    this.authService.logout();
    this.userLoggedIn = false;
  }

  toggleMenu(): void {
    this.toggle = !this.toggle;
  }

  openHotels(): void {
    this.router.navigate([`/hotels`]);
  }

  openAuth(): void {
    this.toggleMenu();
    this.router.navigate([`/authentication`]);
  }

  openReservations(): void {
    this.toggleMenu();
    this.router.navigate([`user/reservations`]);
  }
}
