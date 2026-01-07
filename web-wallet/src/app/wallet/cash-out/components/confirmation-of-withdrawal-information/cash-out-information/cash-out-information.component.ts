import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { getFeeCharge } from '../../../utiles/storage';
import { CashOutProcessService } from '../../../services/cash-out-process.service';
import {CashOutService} from "../../../services/cash-out.service";

@Component({
  selector: 'cash-out-information',
  templateUrl: './cash-out-information.component.html',
  styleUrls: ['./cash-out-information.component.scss']
})
export class CashOutInformationComponent implements OnInit {
  public amount: number;
  public feeCharge = signal<number>(0);
  private cashOutProcessService = inject(CashOutProcessService);
  private cashOutApi = inject(CashOutService);

  ngOnInit(): void {
    this.getAmount();
  }

  private getAmount() {
    this.amount = this.cashOutProcessService.getSelectedUserAmount();
    this.getFee();
  }

  private getFee():void{
    this.cashOutApi.getFee(this.amount)
      .subscribe((result:{ feeCharge: number })=>{
        this.feeCharge.set(result.feeCharge);
      })
  }
}
