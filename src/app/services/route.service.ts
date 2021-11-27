import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { RouteFilter, RouteDTO } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private url = environment.url;

  constructor(private http: HttpClient) {}

  getRoutes(filter: RouteFilter): Observable<any> {
    return this.http.post(this.url + 'routes/filter', filter);
  }

  createRoutes(routes: RouteDTO): Observable<any> {
    return this.http.post(this.url + 'routes', routes);
  }

  editRoute(route: RouteDTO): Observable<any> {
    return this.http.patch(this.url + 'routes', route);
  }

  deleteRoute(filter: RouteFilter): Observable<any> {
    const url =
      this.url + 'routes/' + filter.teacherId + '/' + filter.studentId;
    return this.http.delete(url);
  }

  // PAYMENTS

  payForStudy(id: string, payed: number): Observable<any> {
    return this.http.patch(this.url + 'routes/' + id, {payed});
  }

  getItemCount(): number {
    const json =  localStorage.getItem('count');

    return json ? JSON.parse(json) : 50;
  }

  setItemCount(count: number): void {
    localStorage.setItem('count', JSON.stringify(count));
  }
}
