import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Routes } from '../models/student';
import { AuditStudent, AuditTeacher, Teacher } from '../models/teacher';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private url = environment.url;

  constructor(private http: HttpClient) {}

  getTeacherList(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.url + 'teachers');
  }

  getAuditTeacherList(): Observable<any> {
    let teachers: Teacher[] = [];

    return this.getTeacherList().pipe(
      tap((res: Teacher[]) => { teachers = res;}),
      switchMap(() => 
        this.http.get<any[]>(this.url + 'routes/')
          .pipe(map((res: any[]) => this.processingData(res, teachers)))
      )
    );
  }

  addTeacher(teacher: Teacher): Observable<any> {
    return this.http.post<any>(this.url + 'teachers', teacher);
  }

  editTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.patch<Teacher>(
      this.url + 'teachers/' + teacher!.id,
      teacher
    );
  }

  removeTeacher(teacherId: string): Observable<Teacher> {
    return this.http.delete<Teacher>(this.url + 'teachers/' + teacherId);
  }

  
  private processingData(res: any[], teachers: Teacher[]): [AuditTeacher[], Teacher[]] {
    let result = res.reduce(function (r, a) {
      r[a.teacherId.id] = r[a.teacherId.id] || [];
      r[a.teacherId.id].push(a);
      return r;
    }, Object.create(null));

    let list = teachers.map((item: Teacher) => {
      let students: AuditStudent[] = [];
      students = item.students.length
        ? result[item.id].map((i: Routes) => {
            i.studentName = i.studentId.name;
            i.studentId = i.studentId.id;
            delete i.teacherId;
            delete i['__v'];
            delete i._id;

            return i;
          })
        : [];

      return { ...item, isEmpty: !students.length, students };
    });

    return [list, teachers];
  }
}
