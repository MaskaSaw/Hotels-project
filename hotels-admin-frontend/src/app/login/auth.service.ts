import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import  jwt_decode from 'jwt-decode';

import { User } from '../user';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../api-paths';
import { MessageService } from '../messages/message.service';

@Injectable({ providedIn: 'root'})
export class AuthService {

  private loginUrl = environment.baseUrl + ApiPaths.Auth;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) { }

  login(user: User): void {
    this.http.post<User>(this.loginUrl, user, this.httpOptions)
    .pipe(
      catchError(this.handleError<any>('login'))
    )
    .subscribe((resp: any) => {
      if (jwt_decode(resp.tokenString).role === 'Admin') {
        localStorage.setItem('auth_token', resp.tokenString);
        this.router.navigate(['/hotels']);
      }
    })
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  public get userLoggedIn(): boolean {
    return (localStorage.getItem('auth_token') !== null);
  }

  public get getToken(): string {
    return `Bearer ${localStorage.getItem('auth_token')}`;
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
