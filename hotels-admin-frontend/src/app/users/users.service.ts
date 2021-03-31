import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../user';
import { ApiPaths } from '../api-paths';
import { MessageService } from '../messages/message.service';
import { AuthService } from '../login/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = environment.baseUrl + ApiPaths.Users;
  private itemsPerPage = 100;

  private get httpOptions(): object {
    return {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': this.authService.getToken 
      }),
      params: {
        page: '1',
        itemsPerPage: this.itemsPerPage.toString()
      }
    };
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    public authService: AuthService
  ) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError<User[]>('getUsers', [])
      )
    );
  }

  getUserNames(namePart: string): Observable<User[]> {
    const url = `${this.usersUrl}/names`;
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': this.authService.getToken 
      }),
      params: {
        namePart: namePart
      }
    };
    return this.http.get<User[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError<User[]>('getUserNames', [])
      )
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, this.httpOptions)
      .pipe(
        catchError(this.handleError<User>('addUser')
      )
    );
  }

  updateUser(user: User): Observable<User> {
    const url = this.usersUrl + `/${user.id}`;
    return this.http.put<User>(url, user, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('updateUser')
      )
    );
  }

  deleteUser(id: number): Observable<User> {
    const url = this.usersUrl + `/${id}`;
    return this.http.delete<User>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<User>('deleteUser')
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
    this.messageService.add(`UsersService: ${message}`);
  }
}
