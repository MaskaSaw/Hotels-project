import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hotel } from '../hotel';
import { ApiPaths } from '../api-paths';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  private hotelsUrl = environment.baseUrl + ApiPaths.Hotels;
  private itemsPerPage = 100;

  private get httpOptions(): object {
    return {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
      })
    };
  }

  constructor(
    private http: HttpClient,
  ) { }

  getHotels(country?: string, city?: string, numberOfResidents?: number, checkIn?: Date, checkOut?: Date): Observable<Hotel[]> {

    let params = {};

    if (checkIn && checkOut) {
      params = {
        page: '1',
        itemsPerPage: this.itemsPerPage.toString(),
        country: country,
        city: city,
        numberOfResidents: numberOfResidents.toString(),
        checkIn: checkIn.toJSON(),
        checkOut: checkOut.toJSON()
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

  getHotel(id: number): Observable<Hotel> {
    const url = `${this.hotelsUrl}/${id}`;
    return this.http.get<Hotel>(url)
      .pipe(
        catchError(this.handleError<Hotel>('getHotel')
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
