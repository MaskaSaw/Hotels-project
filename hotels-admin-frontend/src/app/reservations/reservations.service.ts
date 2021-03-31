import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../login/auth.service';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Reservation } from '../reservation';
import { ApiPaths } from '../api-paths';
import { MessageService } from '../messages/message.service';
import { environment } from 'src/environments/environment';
import { ReservationParams } from '../reservationsParams';
import { ReservationDTO } from '../reservation-dto';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  reservations: Reservation[] | undefined;

  private roomsUrl = environment.baseUrl + ApiPaths.Rooms;
  private usersUrl = environment.baseUrl + ApiPaths.Users;
  private reservationsUrl = environment.baseUrl + ApiPaths.Reservations;
  private itemsPerPage = 100;

  private get httpOptions(): object {
    return {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': this.authService.getToken 
      })
    };
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    public authService: AuthService
  ) {
    this.reservations = undefined;
   }

  getReservations(id: number, type: string, inputParams?: ReservationParams) : Observable<ReservationDTO[]>{
    const url = this.setUrl(id, type);
    let httpOptions = {};

    if (type === 'room') {
      httpOptions = {
        headers: new HttpHeaders({ 
          'Content-Type': 'application/json',
          'Authorization': this.authService.getToken 
        }),
        params: {
          userName: inputParams ? inputParams.userName : null 
        }
      }
    }
    else {
      httpOptions = {
        headers: new HttpHeaders({ 
          'Content-Type': 'application/json',
          'Authorization': this.authService.getToken 
        }),
        params: {
          hotelName: inputParams ? inputParams.hotelName : null ,
          roomNumber: inputParams ? inputParams.roomNumber : null
        }
      };
    }
    return this.http.get<ReservationDTO[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError<ReservationDTO[]>('getReservations', [])
      )
    );
  }

  addReservation(reservation: Reservation): Observable<ReservationDTO> {
    return this.http.post<ReservationDTO>(this.reservationsUrl, reservation, this.httpOptions)
      .pipe(
        catchError(this.handleError<ReservationDTO>('addReservation')
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
