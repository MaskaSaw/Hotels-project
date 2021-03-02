import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hotel } from '../hotel';
import { ApiPaths } from '../api-paths';
import { environment } from 'src/environments/environment';
import { MessageService } from '../messages/message.service';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  private hotelsUrl = environment.baseUrl + ApiPaths.Hotels;
  private imagesUrl = environment.baseUrl + ApiPaths.Images;
  private itemsPerPage = 100;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.hotelsUrl, {
      params: {
        page: '1',
        itemsPerPage: this.itemsPerPage.toString()
      }
    })
      .pipe(
        catchError(this.handleError<Hotel[]>('getHotels', [])
      )
    );
  }

  addHotel(hotel: Hotel): Observable<Hotel> {
    return this.http.post<Hotel>(this.hotelsUrl, hotel, this.httpOptions)
      .pipe(
        catchError(this.handleError<Hotel>('addHotel')
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

  updateHotel(hotel: Hotel): Observable<any> {
    const url = this.hotelsUrl + `/${hotel.id}`;
    return this.http.put<Hotel>(url, hotel, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('updateHotel')
      )
    );
  }
  
  deleteHotel(id: number): Observable<Hotel> {
    const url = this.hotelsUrl + `/${id}`;
    return this.http.delete<Hotel>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<Hotel>('deleteHotel')
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
    this.messageService.add(`HotelsService: ${message}`);
  }
}
