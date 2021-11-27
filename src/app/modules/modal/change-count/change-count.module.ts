import { NgModule } from '@angular/core';
import { ChangeCountComponent } from './change-count.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ChangeCountComponent],
  imports: [SharedModule],
  exports: [ChangeCountComponent]
})
export class ChangeCountModule { }
