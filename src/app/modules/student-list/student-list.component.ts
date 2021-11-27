import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EMPTY } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Student } from 'src/app/models/student';
import { StudentType } from 'src/app/models/student-type.enum';
import { AuditStudent, AuditTeacher, Filter } from 'src/app/models/teacher';
import { RouteService } from 'src/app/services/route.service';
import { StudentService } from 'src/app/services/student.service';
import { UnsubscribeHook } from 'src/app/utils/hooks/unsubscribe.hook';
import { AddPayComponent } from '../modal/add-pay/add-pay.component';
import { StudentFilterPipe } from './student-filter.pipe';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StudentFilterPipe]
})
export class StudentListComponent extends UnsubscribeHook implements OnInit {
  @Input() set teacher(value: AuditTeacher) {
    const students = value.students.map((student: AuditStudent) => {
      this.currentMonth = (new Date().getMonth() + 4) % 12;
      let payDays = student.payed;
      const payArray = [];
      const startMonth = (new Date(student.startDate).getMonth() + 4) % 12;

      for (let i = 0; i < this.months.length; i++) {
        
        if (startMonth > i) {
          payArray.push(null)
        } else {
          payArray.push(this.setPay(payDays));
          payDays -= this.payByMonth;
        }

      }

      return {...student, payArray}
    });
    
    this.innerTeachers = {...value, students};
  }

  get teacher(): AuditTeacher {
    return this.innerTeachers;
  }

  @Input() set filter(value: Filter) {
    this.innerFilter = value;
    this.students = this.pipe.transform(this.teacher, value, this.currentMonth); 
    this.isEmpty.emit(!this.students.length)
  }

  get filter(): Filter {
    return this.innerFilter;
  }

  @Input() public header!: TemplateRef<any> | null;

  @Output() refresh = new EventEmitter<void>();
  @Output() isEmpty = new EventEmitter<boolean>();

  type = StudentType;
  currentMonth: number = 0;
  students: AuditStudent[] = []
  readonly payByMonth = this.routeService.getItemCount();
  private innerTeachers!: AuditTeacher;
  private innerFilter!: Filter;
  readonly months: string[] = [
    'Вер',
    'Жов',
    'Лис',
    'Гру',
    'Січ',
    'Лют',
    'Бер',
    'Кві',
    'Тра',
  ];

  get emptyFilter(): boolean {
    return !this.filter.selectedMonth.length
    && this.filter.selectedPayType === null 
    && this.filter.selectedTeacher === null 
    && this.filter.selectedStudent === null 
    && this.filter.selectedStudentType === null 
  }

  constructor(
    private modal: NzModalService, 
    private studentService: StudentService,
    private routeService: RouteService,
    private cd: ChangeDetectorRef,
    private pipe: StudentFilterPipe
  ) {
    super()
  }

  ngOnInit(): void {
    this.currentMonth = (new Date().getMonth() + 4) % 12;
    this.cd.detectChanges();

  }

  trackById(index: number, item: Student): string | null {
    return item!.id;
  }
  
  openModal(id: string, name: string): void {
    const ref = this.modal.create({
      nzContent: AddPayComponent,
      nzTitle: 'Поповнити рахунок для ' + name,
    });

    ref.afterClose
      .pipe(
        take(1), 
        switchMap((res: number) => {
          if (!res) {
            return EMPTY;
          }
          
          return this.routeService.payForStudy(id, res)
            .pipe(tap(() => this.refresh.emit()));
        }))
      .subscribe()
  }

  deleteStudent(id: string): void {
    this.studentService.deleteStudent(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.refresh);
  }

  setIcon(pay: number): string {
    return pay === this.payByMonth
      ? 'check' : pay === 0 
        ? 'close' : pay === null 
          ? 'stop': 'question';
  }

  private setPay(payDays: number): number {
    return payDays >= this.payByMonth 
      ? this.payByMonth
      : payDays < 0
        ? 0
        : payDays;
  }

}
