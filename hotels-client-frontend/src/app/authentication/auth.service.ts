import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import  jwt_decode from 'jwt-decode';

import { User } from '../user';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../api-paths';

@Injectable({ providedIn: 'root'})
export class AuthService {

  private loginUrl = environment.baseUrl + ApiPaths.Auth + '/login';
  private registerUrl = environment.baseUrl + ApiPaths.Auth + '/register';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(user: User): void {
    this.http.post<User>(this.loginUrl, user, this.httpOptions)
    .pipe(
      catchError(this.handleError<any>('login'))
    )
    .subscribe((resp: any) => {
      if (jwt_decode<any>(resp.tokenString).role === 'User') {
        localStorage.setItem('user_auth_token', resp.tokenString);
        this.router.navigate(['/hotels']);
      }
    });
  }

  register(user: User): void {
    this.http.post<User>(this.registerUrl, user, {observe:'response'})
    .pipe(
      catchError(this.handleError<any>('login'))
    )
    .subscribe( resp => {
      if (resp.status === 201) {
        this.login(resp.body as User);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('user_auth_token');
    this.router.navigate(['/authentication']);
  }

  public get userLoggedIn(): boolean {
    return (localStorage.getItem('user_auth_token') !== null);
  }

  public get getToken(): string {
    return `Bearer ${localStorage.getItem('user_auth_token')}`;
  }

  public get getLogin(): string {
    return jwt_decode<any>(localStorage.getItem('user_auth_token')!).unique_name;   
  }

  public get getName(): string {
    return jwt_decode<any>(localStorage.getItem('user_auth_token')!).given_name; 
  }

  public get getId(): number {
    return +jwt_decode<any>(localStorage.getItem('user_auth_token')!).nameid;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
  
      return of(result as T);
    };
  }
}
