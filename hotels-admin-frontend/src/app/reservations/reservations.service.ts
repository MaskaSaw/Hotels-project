import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Reservation } from '../reservation';
import { ApiPaths } from '../api-paths';
import { MessageService } from '../messages/message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  reservations: Reservation[];

  private roomsUrl = environment.baseUrl + ApiPaths.Rooms;
  private usersUrl = environment.baseUrl + ApiPaths.Users;
  private reservationUrl = environment.baseUrl + ApiPaths.Reservations;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  storeRoomReservations(reservations: Reservation[]): void {
    this.reservations = reservations;
  }

  storeUserReservations(reservations: Reservation[]): void {
    this.reservations = reservations;
  }

  getReservations(id: number, type: string) {
    let url: string;

    switch (type) {
      case 'user': {
        url = `${this.usersUrl}/${id}/reservations`;
        break;
      }
      case 'room': {
        url = `${this.roomsUrl}/${id}/reservations`;
        break;
      }
    };
   
    return this.http.get<Reservation[]>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<Reservation[]>('getReservations', []))
    );
  }

  deleteReservation(id: number): Observable<Reservation> {
    const url = this.reservationUrl + `/${id}`;
    return this.http.delete<Reservation>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<Reservation>('deleteRoom'))
      );
  }

  takeReservations(): Reservation[] {
    return this.reservations
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
  
      this.log(`${operation} failed: ${error.message}`);
  
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
