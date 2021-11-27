import { NgModule } from '@angular/core';
import { StudentRouteComponent } from './student-route.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StudentRouteComponent],
  imports: [SharedModule],
  exports: [StudentRouteComponent]
})
export class StudentRouteModule { }
