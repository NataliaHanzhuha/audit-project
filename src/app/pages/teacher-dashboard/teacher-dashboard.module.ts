import { NgModule } from '@angular/core';
import { TeacherDashboardComponent } from './teacher-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TeacherDashboardRoutingModule } from './teacher-dashboard-routing.module';
import { TeacherPipe } from './teacher.pipe';
import { AddTeacherModule } from 'src/app/modules/modal/add-teacher/add-teacher.module';
import { AddTeacherComponent } from 'src/app/modules/modal/add-teacher/add-teacher.component';

@NgModule({
  declarations: [TeacherDashboardComponent, TeacherPipe],
  imports: [
    SharedModule,
    AddTeacherModule,
    TeacherDashboardRoutingModule
  ],
  entryComponents: [AddTeacherComponent]
})
export class TeacherDashboardModule { }
