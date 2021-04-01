import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Room } from '../room';
import { ApiPaths } from '../api-paths';
import { environment } from 'src/environments/environment';
import { Service } from '../service';
import { RoomBlock } from '../room-block';
import { AuthService } from '../authentication/auth.service';

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
    private authService: AuthService
  ) { }

  getRooms(id: number, checkIn?: Date, checkOut?: Date): Observable<Room[]> {
    const url = `${this.hotelsUrl}/${id}/rooms`;
    const httpOptions: object = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': this.authService.getToken 
      }),
      params: {
        checkIn: checkIn ? checkIn : null,
        checkOut: checkOut ? checkOut : null,
      }
    }
    return this.http.get<Room[]>(url, httpOptions)
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

  getServices(id: number) {
    const url = `${this.roomsUrl}/${id}/services`;
    return this.http.get<Service[]>(url)
      .pipe(
        catchError(this.handleError<Service[]>('getServices', [])
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

  addBlock(block: RoomBlock): Observable<RoomBlock> {
    const url = `${this.roomsUrl}/blocks`;
    return this.http.post<RoomBlock>(url, block, this.httpOptions)
      .pipe(
        catchError(this.handleError<RoomBlock>('addBlock')
      )
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
  
      return of(result as T);
    };
  }
}
