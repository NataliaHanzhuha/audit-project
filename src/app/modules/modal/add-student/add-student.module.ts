import { NgModule } from '@angular/core';
import { AddStudentComponent } from './add-student.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StudentRouteModule } from '../student-route/student-route.module';

@NgModule({
  declarations: [AddStudentComponent],
  imports: [SharedModule, StudentRouteModule],
  exports: [AddStudentComponent]
})
export class AddStudentModule { }
