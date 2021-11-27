import { NgModule } from '@angular/core';
import { StudentDashboardComponent } from './student-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { StudentPipe } from './student.pipe';
import { AddStudentModule } from 'src/app/modules/modal/add-student/add-student.module';
import { AddStudentComponent } from 'src/app/modules/modal/add-student/add-student.component';

@NgModule({
  declarations: [
    StudentDashboardComponent,
    StudentPipe
  ],
  imports: [
    SharedModule,
    AddStudentModule,
    StudentDashboardRoutingModule
  ],
  entryComponents: [AddStudentComponent]
})
export class StudentDashboardModule { }
