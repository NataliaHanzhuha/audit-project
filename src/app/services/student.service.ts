import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private url = environment.url;

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
