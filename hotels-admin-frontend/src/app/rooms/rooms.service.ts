import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Room } from '../room';
import { ApiPaths } from '../api-paths';
import { MessageService } from '../messages/message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  private hotelsUrl = environment.baseUrl + ApiPaths.Hotels;
  private roomsUrl = environment.baseUrl + ApiPaths.Rooms;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getRooms(id: number): Observable<Room[]> {
    const url = `${this.hotelsUrl}/${id}/rooms`;
    return this.http.get<Room[]>(url)
      .pipe(
        catchError(this.handleError<Room[]>('getRooms', [])
      )
    );
  }

  addRoom(room: Room) {
    return this.http.post<Room>(this.roomsUrl, room, this.httpOptions)
      .pipe(
        catchError(this.handleError<Room>('addRoom')
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
  
      this.log(`${operation} failed: ${error.message}`);
  
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`RoomsService: ${message}`);
  }
}
