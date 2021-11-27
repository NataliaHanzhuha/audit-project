import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Student } from 'src/app/models/student';
import { AuditTeacher, Teacher } from 'src/app/models/teacher';
import { TeacherService } from 'src/app/services/teacher.service';
import { UnsubscribeHook } from 'src/app/utils/hooks/unsubscribe.hook';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { DropdownOption } from 'src/app/models/dropdown-option';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { AddStudentComponent } from 'src/app/modules/modal/add-student/add-student.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { ChangeCountComponent } from 'src/app/modules/modal/change-count/change-count.component';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditComponent extends UnsubscribeHook implements OnInit {
  teachers: AuditTeacher[] = [];
  teacherOption: Teacher[] = [];
  payOption: DropdownOption[] = [new DropdownOption('Не Сплачено', 0), new DropdownOption('Спачено', 1)];
  typeOptions = [new DropdownOption('Контракт', 0), new DropdownOption('Пільга', 1)]
  form!: FormGroup;
  studentList: Student[] = [];
  loading = false;

  readonly months: string[] = [
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень',
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
  ];
  private subject$ = new Subject<void>();
  get emptyFilter(): boolean {
    return !this.form.value.selectedMonth.length
    && this.form.value.selectedPayType === null 
    && this.form.value.selectedTeacher === null 
    && this.form.value.selectedStudent === null 
    && this.form.value.selectedStudentType === null 
  }
  constructor(
    private teacherService: TeacherService,
    private studentService: StudentService,
    private cd: ChangeDetectorRef,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {
    super();

    this.form = this.fb.group({
      selectedTeacher: null,
      selectedMonth: [[]],
      selectedPayType: null,
      selectedStudentType: null,
      selectedStudent: null
    })
  }

  ngOnInit(): void {
    this.initRefresh();
    this.getStudentList();
  }

  refresh = (): void => {
    this.loading = true;
    this.subject$.next();
  }

  resetFilter(): void {
    this.form.setValue({
      selectedTeacher: null,
      selectedMonth: [],
      selectedPayType: null,
      selectedStudentType: null,
      selectedStudent: null
    })
  }

  filterTeachers(id: string): AuditTeacher {
    return this.teachers.find((teacher: AuditTeacher) => teacher.id === id)!;
  }

  changeCount(): void {
    const ref = this.modal.create({
      nzContent: ChangeCountComponent,
      nzTitle: 'Змінити ставку оплати',
      nzWidth: '250px'
    });

    ref.afterClose
      .pipe(take(1))
      .subscribe(this.refresh)
  }

  private initRefresh() {
    this.subject$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(this.getTeacherList))
      .subscribe();

    this.refresh();
  }

  private getTeacherList = (): Observable<any> => {
    return this.teacherService
      .getAuditTeacherList()
      .pipe(tap(this.processingTeacherList));
  }

  private processingTeacherList = (res: [AuditTeacher[], Teacher[]]) => {
    this.teachers = res[0].length ? res[0] : [];
    this.teacherOption = res[1];
    this.loading = false;

    this.cd.detectChanges();
  }

  private getStudentList(): void {
    this.studentService.getStudents()
      .pipe(take(1))
      .subscribe((res: Student[]) => {
        this.studentList = res;
        this.cd.detectChanges();
    });
  }


}
