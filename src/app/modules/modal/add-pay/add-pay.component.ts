import { Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-add-pay',
  templateUrl: './add-pay.component.html',
  styleUrls: ['./add-pay.component.scss']
})
export class AddPayComponent {
  pay: number | null = 0
  readonly payByMonth = this.routeService.getItemCount();

  constructor(private ref: NzModalRef, private routeService: RouteService,) {}

  cancel(): void {
    this.ref.close(null);
  }

  save(): void {
    this.ref.close(this.pay);
  }

}
