import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DropdownOption } from 'src/app/models/dropdown-option';
import { RouteDTO } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-student-route',
  templateUrl: './student-route.component.html',
  styleUrls: ['./student-route.component.scss']
})
export class StudentRouteComponent implements OnInit {
  @Input() currentItem: boolean = false;
  @Input() isStudent!: boolean;
  @Input() selectedRouts: string[] = [];
  @Input() editMode = false;

  @Input() set formValue(value: RouteDTO | null) {
    if (!value || JSON.stringify(value) === JSON.stringify(this.savedItem)) {
      return;
    }
  
    this.form.patchValue(value);
    this.savedItem = value;
    
    this.typeOptions = [new DropdownOption('Контракт', 0), new DropdownOption('Пільга', 1)];
    
    this.cd.detectChanges();
  }

  get formValue(): RouteDTO | null {
    return this.savedItem;
  }

  get id(): string {
    return this.isStudent ? 'teacherId' : 'studentId';
  }

  @Output() save = new EventEmitter<RouteDTO>();
  @Output() cancel = new EventEmitter<void>();

  typeOptions: DropdownOption[] = [];
  list: any[] = [];
  savedItem!: RouteDTO | null;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private teacherService: TeacherService,
    private studentService: StudentService,
    private cd: ChangeDetectorRef) {
    this.form = fb.group(new RouteDTO())
  }

  ngOnInit(): void {
    this.getDropdowns();
  }

  disabledOption(id: string): boolean {
    const fieldname = this.isStudent ? 'teacherId' : 'studentId';

    return this.selectedRouts.includes(id) && id !== this.savedItem![fieldname];
  }

  saveAction(): void {
    this.save.emit(this.form.value);
    this.form.reset();
    this.savedItem = null;
  }

  cancelAction(): void {
    this.cancel.emit();
    this.form.reset();
    this.savedItem = null;
  }

  private getDropdowns(): void {
    const request = this.isStudent ? this.getTeacherList() : this.getStudentList();

    request
    .pipe(take(1))
    .subscribe((res) => {
      this.list = res;
      this.cd.detectChanges();
    });
  }

  private getTeacherList(): Observable<any> {
    return this.teacherService.getTeacherList();
  }

  private getStudentList(): Observable<any> {
    return this.studentService.getStudents();
  }
}
