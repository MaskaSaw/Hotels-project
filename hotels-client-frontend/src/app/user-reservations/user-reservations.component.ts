import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { ReservationsService } from '../reservation/reservations.service';
import { UserReservation } from '../user-reservation';

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html',
  styleUrls: ['./user-reservations.component.less']
})
export class UserReservationsComponent implements OnInit {

  reservations: UserReservation[] = [];
  currentReservations: boolean = true;

  constructor(
    private reservationsService: ReservationsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getReservations(false);
  }

  getReservations(all: boolean): void {
    this.reservationsService.getUserReservations(this.authService.getId, all)
      .subscribe(reservations => {
        let res = reservations.sort((a, b) => 
        new Date(b.startDate).getDate() - new Date(a.startDate).getDate() 
        );
        this.reservations = res;
      }
    );
  }

  showFullReservations(): void {
    this.getReservations(true);
    this.currentReservations = false;
  }

  showCurrentReservations(): void {
    this.getReservations(false);
    this.currentReservations = true;
  }

  checkDates(startDate: Date): boolean {
    const currentDate = new Date();
    return (new Date(startDate) < currentDate);
  }

}
