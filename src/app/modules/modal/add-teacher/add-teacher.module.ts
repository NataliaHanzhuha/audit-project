import { NgModule } from '@angular/core';
import { AddTeacherComponent } from './add-teacher.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StudentRouteModule } from '../student-route/student-route.module';
import { StudentFilterPipe } from './students.pipe';

@NgModule({
  declarations: [AddTeacherComponent, StudentFilterPipe],
  imports: [SharedModule, StudentRouteModule],
  exports: [AddTeacherComponent]
})
export class AddTeacherModule { }
