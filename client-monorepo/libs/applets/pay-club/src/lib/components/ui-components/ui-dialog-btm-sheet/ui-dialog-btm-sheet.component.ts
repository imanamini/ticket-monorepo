import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMAGES_PATH } from '../../../data-access/constants/images-path';
import { isDesktop } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'pay-club-applet-ui-dialog-btm-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-dialog-btm-sheet.component.html',
  styleUrls: ['./ui-dialog-btm-sheet.component.scss'],
})
export class UiDialogBtmSheetComponent implements OnInit {
  @Input()
  closeable = false;

  @Input()
  title = '';

  @Input()
  image = '';

  @Input()
  titleRight = false;

  isDesktop = false;

  IMAGES_PATH = IMAGES_PATH;

  constructor(private bottomSheetService: NgxBottomSheetService) {}

  ngOnInit(): void {
    this.isDesktop = isDesktop();
  }

  close(): void {
    this.bottomSheetService.closeBottomSheet();
  }
}
