import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private url = 'https://diploma-server-01.herokuapp.com/';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<any> {
    return this.http.get(this.url + 'students');
  }

  addStudent(student: string): Observable<any> {
    return this.http.post(this.url + 'students', { name: student });
  }

  editStudent(student: string, id: string): Observable<any> {
    return this.http.patch(this.url + 'students/' + id, {name: student});
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete(this.url + 'students/' + id);
  }

  removeStudentToTeacher(
    teacherId: string,
    students: string[]
  ): Observable<any> {
    return this.http.patch(this.url + 'teachers/remove-students', {
      teacherId,
      students,
    });
  }
}
