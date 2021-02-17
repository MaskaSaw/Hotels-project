import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../user';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../api-paths';

@Injectable({ providedIn: 'root'})
export class AuthService {

  private loginUrl = environment.baseUrl + ApiPaths.Auth;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(user: User) {
    this.http.post<User>(this.loginUrl, user, this.httpOptions)
     .subscribe((resp: any) => {
       this.router.navigate(['/hotels']);
       localStorage.setItem('auth_token', resp.tokenString);
     });
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  public get userLoggedIn(): boolean {
    return (localStorage.getItem('auth_token') === null);
  }
}
