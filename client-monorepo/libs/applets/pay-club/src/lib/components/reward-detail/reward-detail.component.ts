import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prize } from '../../data-access/models/user-rewards.response';
import {
  UiVoucherDialogBtmSheetComponent
} from '../ui-components/ui-voucher-dialog-btm-sheet/ui-voucher-dialog-btm-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'pay-club-applet-reward-detail',
  standalone: true,
  imports: [CommonModule, UiVoucherDialogBtmSheetComponent],
  templateUrl: './reward-detail.component.html',
  styleUrls: ['./reward-detail.component.scss'],
})
export class RewardDetailComponent implements OnInit {
  data!: Prize;

  constructor(private bottomSheetService: NgxBottomSheetService) {}

  ngOnInit(): void {
    this.data = this.bottomSheetService.data()?.voucher;
  }
}
