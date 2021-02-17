import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../user';
import { ApiPaths } from '../api-paths';
import { MessageService } from '../messages/message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = environment.baseUrl + ApiPaths.Users;
  private itemsPerPage = 100;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl, {
      params: {
        page: '1',
        itemsPerPage: this.itemsPerPage.toString()
      }
    })
      .pipe(
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  deleteUser(id: number): Observable<User> {
    const url = this.usersUrl + `/${id}`;
    return this.http.delete<User>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<User>('deleteUser'))
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
    this.messageService.add(`UsersService: ${message}`);
  }
}
