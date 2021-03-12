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
