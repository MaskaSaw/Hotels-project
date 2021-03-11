import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Room } from '../room';
import { ApiPaths } from '../api-paths';
import { environment } from 'src/environments/environment';

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
        //'Authorization': this.authService.getToken 
      })
    };
  }

  constructor(
    private http: HttpClient,
  ) { }

  getRooms(id: number): Observable<Room[]> {
    const url = `${this.hotelsUrl}/${id}/rooms`;
    return this.http.get<Room[]>(url)
      .pipe(
        catchError(this.handleError<Room[]>('getRooms', [])
      )
    );
  }

  getRoom(id: number): Observable<Room> {
    const url = `${this.roomsUrl}/${id}`;
    return this.http.get<Room>(url)
      .pipe(
        catchError(this.handleError<Room>('getRoom')
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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      if (error.status === 401) {
        this.authService.logout();
      } 
  
      return of(result as T);
    };
  }
}
