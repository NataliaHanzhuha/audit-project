import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-change-count',
  templateUrl: './change-count.component.html',
  styleUrls: ['./change-count.component.scss']
})
export class ChangeCountComponent implements OnInit {
  pay = 0

  constructor(private ref: NzModalRef, private routeService: RouteService,) {}

  ngOnInit(): void {
    this.pay = this.routeService.getItemCount();
  }

  cancel(): void {
    this.ref.close(null);
  }

  save(): void {
    this.routeService.setItemCount(this.pay);
    this.cancel();
  }

}
