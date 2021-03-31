import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hotel } from '../hotel';
import { ApiPaths } from '../api-paths';
import { environment } from 'src/environments/environment';
import { MessageService } from '../messages/message.service';
import { AuthService } from '../login/auth.service';
import { Params } from '../params';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  private hotelsUrl = environment.baseUrl + ApiPaths.Hotels;
  private imagesUrl = environment.baseUrl + ApiPaths.Images;
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
  ) { }

  getHotels(inputParams?: Params): Observable<Hotel[]> {

    let params = {};

    if(inputParams) {
      params = {
        page: '1',
        itemsPerPage: this.itemsPerPage.toString(),
        city: inputParams.city,
        country: inputParams.country,
      }
    }
    else {
      params = {
        page: '1',
        itemsPerPage: this.itemsPerPage.toString()
      }
    }

    return this.http.get<Hotel[]>(this.hotelsUrl, { params })
      .pipe(
        catchError(this.handleError<Hotel[]>('getHotels', [])
      )
    );
  }

  getHotelNames(namePart: string): Observable<string[]> {
    const url = `${this.hotelsUrl}/names`;
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': this.authService.getToken 
      }),
      params: {
        namePart: namePart
      }
    };
    return this.http.get<string[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError<string[]>('getHotelsNames', [])
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
      if (error.status === 401) {
        this.authService.logout();
      }
  
      this.log(`${operation} failed: ${error.message}`);
  
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HotelsService: ${message}`);
  }
}
