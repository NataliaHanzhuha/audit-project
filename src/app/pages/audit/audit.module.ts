import { NgModule } from '@angular/core';
import { AuditComponent } from './audit.component';
import { AuditRoutingModule } from './audit-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StudentListModule } from 'src/app/modules/student-list/student-list.module';
import { AddPayModule } from 'src/app/modules/modal/add-pay/add-pay.module';
import { AddPayComponent } from 'src/app/modules/modal/add-pay/add-pay.component';
import { ChangeCountModule } from 'src/app/modules/modal/change-count/change-count.module';
import { ChangeCountComponent } from 'src/app/modules/modal/change-count/change-count.component';

@NgModule({
  declarations: [AuditComponent],
  imports: [
    SharedModule,
    StudentListModule,
    AddPayModule,
    ChangeCountModule,
    AuditRoutingModule,
  ],
  entryComponents: [AddPayComponent, ChangeCountComponent]
})
export class AuditModule { }
