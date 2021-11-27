import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { take, takeUntil } from 'rxjs/operators';
import { RouteDTO, RouteFilter, Student } from 'src/app/models/student';
import { Teacher } from 'src/app/models/teacher';
import { RouteService } from 'src/app/services/route.service';
import { StudentService } from 'src/app/services/student.service';
import { UnsubscribeHook } from 'src/app/utils/hooks/unsubscribe.hook';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss']
})
export class AddTeacherComponent extends UnsubscribeHook implements OnInit {
  @Input() teacher?: Teacher;

  form!: FormGroup;
  editedItem: number | null = null;
  savedItem: any;
  studentsIds: string[] = [];
  studentList: Student[] =[];
  editMode = false;
  get routes(): FormArray {
    return (this.form.get('routes')! || []) as FormArray;
  }

  constructor(
    private fb: FormBuilder, 
    private ref: NzModalRef,  
    private cd: ChangeDetectorRef,
    private studentService: StudentService,
    private routeService: RouteService,

  ) {
    super()
    this.initForm();
  }

  ngOnInit(): void {
    this.getStudentList();
  
    if (this.teacher?.students.length) {
      this.routeService
        .getRoutes({ teacherId: this.teacher.id })
        .pipe(take(1))
        .subscribe((routes: RouteDTO[]) => {
          if (routes?.length) {
            routes!.forEach((t: RouteDTO) => {
              this.routes.push(this.fb.group({...t, teacherId: this.teacher!.id}));
            });            
          }

          console.log(this);
          
        });
    }
  }

  cancel(): void {
    this.ref.close(null);
  }

  save(): void {
    this.ref.close(this.form.value.name);
  }

  disableSaveButton(): boolean {
    return this.form.invalid;
  }
  addNewStudent(): void {
    const newTeacher = this.fb.group(new RouteDTO(this.teacher!.id));

    this.routes.push(newTeacher);
    this.editedItem = this.routes.length - 1;
    this.savedItem = newTeacher.value;
    this.cd.detectChanges();
  }

  editStudent(i: number): void {
    this.savedItem = this.routes.controls[i].value;
    this.editedItem = i;
    this.editMode = true;
    this.cd.detectChanges();
  }

  removeStudent(i: number): void {
    const student = this.routes.controls[i].value;
    
    if (this.teacher && !!this.teacher.students!.find((t: string) => t === student.studentId)) {
      const body = new RouteFilter(this.teacher!.id, student!.id)

      this.routeService.deleteRoute(body)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.routes.removeAt(i);
          this.cd.detectChanges();
        })
    } else {
      this.routes.removeAt(i);
      this.cd.detectChanges();
    }    
  }

  cancelStudent(i: number): void {
    if (!this.savedItem.id) {
      this.routes.removeAt(i);
    }

    this.editedItem = null;
    this.savedItem = null;
    this.editMode = false;
    this.cd.detectChanges();
  }

  saveStudent(value: RouteDTO, i: number): void {
    const request = this.editMode
      ? this.routeService.editRoute(value) 
      : this.routeService.createRoutes(value);

    request
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        const students = this.form.get('students');

        students?.patchValue([...students?.value, value.studentId]);
    
        this.routes.controls[i]?.patchValue({
          ...value,
          teacherId: this.teacher ? this.teacher.id : null,
        });
        this.routes.controls[i]?.patchValue(value);

        this.editedItem = null;
        this.savedItem = null;
        this.editMode = false;
    
        this.cd.detectChanges();
      })
  }

  getStudentIds(): string[] {
      return this.routes.value.map((item: RouteDTO) => item.studentId);
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: '',
      students: [[]],
      routes: this.fb.array([])
    })
  }

  private patchForm(): void {
    if (!this.teacher) {
      return;
    }

    this.form.patchValue(this.teacher);   
  }

  private getStudentList(): void {
    this.studentService.getStudents()
      .pipe(take(1))
      .subscribe((res: Student[]) => {
        this.studentList = res;
        this.studentsIds = res.map((s: Student) => s.id);

        this.patchForm();
        this.cd.detectChanges();
    });
  }

}
