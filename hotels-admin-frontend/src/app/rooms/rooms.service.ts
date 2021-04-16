import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Room } from '../room';
import { ApiPaths } from '../api-paths';
import { MessageService } from '../messages/message.service';
import { AuthService } from '../login/auth.service';
import { environment } from 'src/environments/environment';
import { Service } from '../service';
import { RoomSearch } from '../room-search';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  private hotelsUrl = environment.baseUrl + ApiPaths.Hotels;
  private roomsUrl = environment.baseUrl + ApiPaths.Rooms;
  private imagesUrl = environment.baseUrl + ApiPaths.Images;

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
  ) { }

  getRooms(id: number): Observable<Room[]> {
    const url = `${this.hotelsUrl}/${id}/rooms`;
    return this.http.get<Room[]>(url)
      .pipe(
        catchError(this.handleError<Room[]>('getRooms', [])
      )
    );
  }

  getRoomCost(id: number): Observable<number> {
    const url = `${this.roomsUrl}/${id}/cost`;
    return this.http.get<number>(url)
      .pipe(
        catchError(this.handleError<number>('getRoomCost')
      )
    );
  }

  getServices(id: number) {
    const url = `${this.roomsUrl}/${id}/services`;
    return this.http.get<Service[]>(url)
      .pipe(
        catchError(this.handleError<Service[]>('getServices', [])
      )
    );
  }

  getRoomNumbers(roomNumber: string, hotelName: string): Observable<RoomSearch[]> {
    const url = `${this.roomsUrl}/numbers`;
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': this.authService.getToken 
      }),
      params: {
        roomNumber: roomNumber,
        hotelName: hotelName
      }
    };

    return this.http.get<RoomSearch[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError<RoomSearch[]>('getServices', [])
      )
    );
  }

  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.roomsUrl, room, this.httpOptions)
      .pipe(
        catchError(this.handleError<Room>('addRoom')
      )
    );
  }

  addImage(imageFormData: FormData): Observable<string> {
    return this.http.post<string>(this.imagesUrl, imageFormData)
      .pipe(
        catchError(this.handleError<string>('addImage')
      )
    );
  }

  updateRoom(room: Room): Observable<any> {
    const url = this.roomsUrl + `/${room.id}`;
    return this.http.put<Room>(url, room, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('updateRoom')
      )
    );
  }

  deleteRoom(id: number): Observable<Room> {
    const url = this.roomsUrl + `/${id}`;
    return this.http.delete<Room>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<Room>('deleteRoom')
      )
    );
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
    this.messageService.add(`RoomsService: ${message}`);
  }
}
