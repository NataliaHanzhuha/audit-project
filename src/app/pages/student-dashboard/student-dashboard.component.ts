import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, of, Subject } from 'rxjs';
import { finalize, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { DropdownOption } from 'src/app/models/dropdown-option';
import { Student } from 'src/app/models/student';
import { Teacher } from 'src/app/models/teacher';
import { AddStudentComponent } from 'src/app/modules/modal/add-student/add-student.component';
import { StudentService } from 'src/app/services/student.service';
import { UnsubscribeHook } from 'src/app/utils/hooks/unsubscribe.hook';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboardComponent extends UnsubscribeHook implements OnInit {
  students: Student[] = [];
  studentsOption: DropdownOption[] = [];
  selectedStudent!: string;
  private subject$ = new Subject<void>();

  constructor(
    private studentService: StudentService,
    private cd: ChangeDetectorRef,
    private modal: NzModalService,
  ) {
    super()
  }

  ngOnInit(): void {
    this.initRefresh();
  }

  addStudent(student: Student | null): void {
    const ref = this.modal.create({
      nzContent: AddStudentComponent,
      nzTitle: student ? 'Змінити дані учня ' + student?.name : 'Додати нового учня',
      nzWidth: '670px',
      nzComponentParams: { student: student ?? null }
    });

    ref.afterClose
      .pipe(
        take(1),
        switchMap((res: string) => this.processingStudent(res, student)),
        finalize(this.refresh))
      .subscribe()
  }

  private processingStudent(res: string, student: Student | null): Observable<any> {
    console.log(res, student);
    
    if (!res || (!!student && student.name === res)) {
      return of(null);
    }

    return !!student
      ? this.studentService.editStudent(res, student!.id)
      : this.studentService.addStudent(res)
  }

  refresh = (): void => {
    this.subject$.next();
  }

  deleteStudent(id: string): void {
    this.studentService.deleteStudent(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.refresh);
  }

  private initRefresh() {
    this.subject$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(this.getTeacherList))
      .subscribe();

    this.refresh();
  }

  private getTeacherList = (): Observable<Student[]> => {
    return this.studentService
      .getStudents()
      .pipe(tap(this.processingTeacherList));
  }

  private processingTeacherList = (res: Student[]) => {
    this.students = res;
    this.studentsOption = res.map((item: Student) => new DropdownOption(item.name, item.id))
    this.cd.detectChanges();
  }

}
