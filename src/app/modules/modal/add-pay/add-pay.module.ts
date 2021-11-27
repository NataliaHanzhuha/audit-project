import { NgModule } from '@angular/core';
import { AddPayComponent } from './add-pay.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddPayComponent],
  imports: [SharedModule],
  exports: [AddPayComponent]
})
export class AddPayModule { }
