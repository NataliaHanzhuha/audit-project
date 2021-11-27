import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainRoutingModule } from './main-router.module';

@NgModule({
  declarations: [MainComponent],
  imports: [SharedModule, MainRoutingModule]
})
export class MainModule {}
