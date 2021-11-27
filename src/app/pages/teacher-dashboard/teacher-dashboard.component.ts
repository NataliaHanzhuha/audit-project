import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EMPTY, Observable, Subject } from 'rxjs';
import { takeUntil, switchMap, tap, take, finalize } from 'rxjs/operators';
import { DropdownOption } from 'src/app/models/dropdown-option';
import { Teacher } from 'src/app/models/teacher';
import { AddTeacherComponent } from 'src/app/modules/modal/add-teacher/add-teacher.component';
import { RouteService } from 'src/app/services/route.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { UnsubscribeHook } from 'src/app/utils/hooks/unsubscribe.hook';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherDashboardComponent extends UnsubscribeHook implements OnInit {
  teachers: Teacher[] = [];
  teacherOption: DropdownOption[] = [];
  selectedTeacher!: string;
  private subject$ = new Subject<void>();

  constructor(
    private teacherService: TeacherService,
    private cd: ChangeDetectorRef,
    private modal: NzModalService,
  ) {
    super();
   }

  ngOnInit(): void {
    this.initRefresh();
  }

  refresh = (): void => {
    this.subject$.next();
  }

  addTeacher(teacher?: Teacher): void {
    const ref = this.modal.create({
      nzContent: AddTeacherComponent,
      nzTitle: 'Додати учителя',
      nzComponentParams: { teacher },
      nzWidth: '670px',
    });

    ref.afterClose.pipe(
      take(1),
      switchMap((res: string) => {
        if (!res || (teacher?.id && teacher.name === res)) {
          return EMPTY;
        }

        return teacher 
                ? this.teacherService.editTeacher({name: res, id: teacher.id} as Teacher)
                : this.teacherService.addTeacher({name: res} as Teacher)
          }),
          finalize(this.refresh)
      )
      .subscribe();
  }

  deleteTeacher(id: string): void {
    this.teacherService.removeTeacher(id)
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

  private getTeacherList = (): Observable<Teacher[]> => {
    return this.teacherService
      .getTeacherList()
      .pipe(tap(this.processingTeacherList));
  }

  private processingTeacherList = (res: Teacher[]) => {
    this.teachers = res;
    this.teacherOption = res.length ? res.map((teacher: Teacher) => new DropdownOption(teacher.name, teacher.id)) : [];
    this.teacherOption.unshift(new DropdownOption('All', null));

    this.cd.detectChanges();
  }

}
