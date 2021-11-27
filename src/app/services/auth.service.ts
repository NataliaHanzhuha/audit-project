import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = 'https://diploma-server-01.herokuapp.com/';
  private tokenName = 'token';

  get token(): string | null {
    return localStorage.getItem(this.tokenName);
  }

  constructor(private http: HttpClient) { }

  register(user: User): Observable<any> {
    return this.http.post(this.url + 'registr', user);
  }

  login(user: User): Observable<any> {
    return this.http.post(this.url + 'login', user)
      .pipe(tap((res: any) => localStorage.setItem(this.tokenName, res)));
  }

  logout() {
    localStorage.removeItem(this.tokenName);
  }
}