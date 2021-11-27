import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddStudentComponent } from '../modal/add-student/add-student.component';
import { AddStudentModule } from '../modal/add-student/add-student.module';
import { StudentFilterPipe } from './student-filter.pipe';
import { StudentListComponent } from './student-list.component';

@NgModule({
  declarations: [StudentListComponent, StudentFilterPipe],
  imports: [SharedModule, AddStudentModule],
  exports: [StudentListComponent],
  entryComponents: [AddStudentComponent]
})
export class StudentListModule { }
