import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = environment.url;
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