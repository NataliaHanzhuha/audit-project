import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { take, takeUntil } from 'rxjs/operators';
import { RouteDTO, RouteFilter, Student } from 'src/app/models/student';
import { StudentType } from 'src/app/models/student-type.enum';
import { Teacher } from 'src/app/models/teacher';
import { RouteService } from 'src/app/services/route.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { UnsubscribeHook } from 'src/app/utils/hooks/unsubscribe.hook';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentComponent extends UnsubscribeHook implements OnInit {
  @Input() student: Student | null = null;

  form!: FormGroup;
  teacherList: Teacher[] = [];
  editedItem: number | null = null;
  savedItem: any;
  teachersIds: string[] = [];
  type = StudentType;
  editMode = false;

  get routes(): FormArray {
    return (this.form.get('routes')! || []) as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private ref: NzModalRef,
    private teacherService: TeacherService,
    private routeService: RouteService,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
    if (this.student?.teachers.length) {
      this.routeService
        .getRoutes({ studentId: this.student.id })
        .pipe(take(1))
        .subscribe((routes: RouteDTO[]) => {
          if (routes?.length) {
            routes!.forEach((t: RouteDTO) => {
              this.routes.push(this.fb.group({...t, studentId: this.student!.id}));
            });

            console.log(this.routes.value);
            
          }
        });
    }

    this.patchForm();
    this.getTeacherList();
  }

  cancel(): void {
    this.ref.close(null);
  }

  save(): void {
    this.ref.close(this.form.value.name)
  }

  getTeacherIds(): string[] {
    return this.form.get('teachers')!.value;
  }

  disableSaveButton(): boolean {
    return (
      this.form.invalid ||
      (!!this.student && JSON.stringify(this.student) === JSON.stringify(this.form.value))
      || this.student?.name === this.form?.value?.name
    );
  }

  addNewTeacher(): void {
    const newTeacher = this.fb.group(new RouteDTO(null, this.student!.id));

    this.routes.push(newTeacher);
    this.editedItem = this.routes.length - 1;
    this.savedItem = newTeacher.value;
    this.cd.detectChanges();
  }

  cancelTeacher(i: number): void {
    if (!this.savedItem.id) {
      this.routes.removeAt(i);
    }

    this.editedItem = null;
    this.savedItem = null;
    this.editMode = false;

    this.cd.detectChanges();
  }

  saveTeacher(value: RouteDTO, i: number): void {
    const request = this.editMode
      ? this.routeService.editRoute(value) 
      : this.routeService.createRoutes(value);

    request
      .subscribe(() => this.nullishEdit(value, i))
  }

  nullishEdit(value: RouteDTO, i: number): void {
    const teachers = this.form.get('teachers');
    teachers?.patchValue([...teachers?.value, value.teacherId]);

    this.routes.controls[i]?.patchValue({
      ...value,
      studentId: this.student ? this.student.id : null,
    });

    this.editedItem = null;
    this.savedItem = null;
    this.editMode = false;
    this.cd.detectChanges();
  }

  editTeacher(i: number): void {
    this.savedItem = this.routes.controls[i].value;
    this.editedItem = i;
    this.editMode = true;
    this.cd.detectChanges();
  }

  removeTeacher(i: number): void {
    const id = this.routes.controls[i].value.teacherId;
    console.log(id, this.student, !!this.student?.teachers!.find((t: string) => t === id));
    
    if (!!this.student?.teachers!.find((t: string) => t === id)) {
      this.routeService.deleteRoute(new RouteFilter(id, this.student!.id))
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => this.unsetTeachers(id, i));
    } else {
      this.unsetTeachers(id, i);
    }
  }

  private unsetTeachers(id: string, i: number): void {
    const teachers = this.form.get('teachers');

    teachers?.setValue(teachers.value.filter((formId: string) => formId !== id));
    this.routes.removeAt(i);

    this.cd.detectChanges();
  }

  private getTeacherList(): void {
    this.teacherService
      .getTeacherList()
      .pipe(take(1))
      .subscribe((res) => {
        this.teacherList = res;
      });
  }

  private initForm(): void {
    this.form = this.fb.group({
      id: null,
      name: ['', Validators.required],
      selectedTeacher: [null],
      teachers: [[]],
      routes: this.fb.array([]),
    });
  }

  private patchForm(): void {
    if (!this.student) {
      return;
    }

    this.form.patchValue(this.student);
  }
}
