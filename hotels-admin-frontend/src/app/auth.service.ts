import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user'

@Injectable({ providedIn: 'root'})
export class AuthService {
  private loginUrl = 'https://localhost:44336/api/auth/Login';

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
    })
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  public get logIn(): boolean {
    return (localStorage.getItem('auth_token') === null);
  }
}
