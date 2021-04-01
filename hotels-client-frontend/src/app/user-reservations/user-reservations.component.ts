import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Reservation } from '../reservation';
import { ReservationsService } from '../reservation/reservations.service';
import { UserReservation } from '../user-reservation';

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html',
  styleUrls: ['./user-reservations.component.less']
})
export class UserReservationsComponent implements OnInit {

  reservations: UserReservation[] = [];
  reservation: UserReservation = new UserReservation;
  id: number = 0;
  currentReservations: boolean = true;
  onEditArrivalTime: boolean = false;
  arrivalTime: string = '';

  constructor(
    private reservationsService: ReservationsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getReservations(false);
  }

  openEdit(reservation: UserReservation) {
    this.onEditArrivalTime = true;
    this.reservation = reservation;
  }

  closeEdit() {
    this.onEditArrivalTime = false;
    this.reservation = new UserReservation();
  }

  getReservations(all: boolean): void {
    this.reservationsService.getUserReservations(this.authService.getId, all)
      .subscribe(reservations => {
        let res = reservations.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime() 
        );
        this.reservations = res;
      }
    );
  }

  updateReservation(): void {
    this.reservationsService.updateReservation( {
        id: this.reservation.id,
        userId: this.reservation.userId,
        roomId: this.reservation.roomId,
        startDate: this.reservation.startDate,
        endDate: this.reservation.endDate,
        arrivalTime: this.reservation.arrivalTime,
        departureTime: this.reservation.departureTime,
        reservationServices: this.reservation.reservationServices
      })
      .subscribe();

    this.closeEdit();
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
    return new Date(startDate) < new Date(currentDate.setDate(currentDate.getDate() - 1));
  }

  checkReservations(): boolean {
    return this.reservations.length === 0;
  }

}
