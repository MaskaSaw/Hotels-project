import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../login/auth.service';

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
  private reservationsUrl = environment.baseUrl + ApiPaths.Reservations;

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': this.authService.getToken 
    })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  storeRoomReservations(reservations: Reservation[]): void {
    this.reservations = reservations;
  }

  storeUserReservations(reservations: Reservation[]): void {
    this.reservations = reservations;
  }

  getReservations(id: number, type: string) : Observable<Reservation[]>{
    const url = this.setUrl(id, type);
    return this.http.get<Reservation[]>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<Reservation[]>('getReservations', [])
      )
    );
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.reservationsUrl, reservation, this.httpOptions)
      .pipe(
        catchError(this.handleError<Reservation>('addReservation')
      )
    );
  }

  updateReservation(reservation: Reservation): Observable<Reservation> {
    const url = this.reservationsUrl + `/${reservation.id}`;
    return this.http.put<Reservation>(url, reservation, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('updateReservation')
      )
    );
  }

  deleteReservation(id: number): Observable<Reservation> {
    const url = this.reservationsUrl + `/${id}`;
    return this.http.delete<Reservation>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<Reservation>('deleteRoom')
      )
    );
  }

  takeReservations(): Reservation[] {
    return this.reservations
  }

  setUrl(id: number, type: string): string {
    let url = ""
    switch (type) {
      case 'user': {
        url = `${this.usersUrl}/${id}/reservations`;
        break;
      }
      case 'room': {
        url =  `${this.roomsUrl}/${id}/reservations`;
        break;
      }
    };

    return url;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      if (error.status === 401) {
        this.authService.logout();
      }
  
      this.log(`${operation} failed: ${error.message}`);
  
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`ReservationsService: ${message}`);
  }
}
