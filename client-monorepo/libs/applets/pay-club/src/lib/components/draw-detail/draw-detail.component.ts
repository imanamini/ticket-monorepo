import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prize } from '../../data-access/models/user-rewards.response';
import {
  UiDrawDialogBtmSheetComponent
} from '../ui-components/ui-draw-dialog-btm-sheet/ui-draw-dialog-btm-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'pay-club-applet-draw-detail',
  standalone: true,
  imports: [CommonModule, UiDrawDialogBtmSheetComponent],
  templateUrl: './draw-detail.component.html',
  styleUrls: ['./draw-detail.component.scss'],
})
export class DrawDetailComponent implements OnInit {
  data!: Prize;

  constructor(private bottomSheetService: NgxBottomSheetService) {}

  ngOnInit(): void {
    this.data = this.bottomSheetService.data()?.lottery;
  }
}
