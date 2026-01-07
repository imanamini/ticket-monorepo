import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from '../../../../website/services/layout.service';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { ScreenSize } from '../../../../api/digipay/models/common/screen-size';

@Component({
  selector: 'app-ui-dialog-bottom-sheet',
  templateUrl: './ui-dialog-bottom-sheet.component.html',
  styleUrls: ['./ui-dialog-bottom-sheet.component.scss'],
  standalone: true,
})
export class UiDialogBottomSheetComponent implements OnInit {
  @Input()
  closeable = false;

  @Input()
  title = '';

  @Input()
  image = '';

  @Input()
  titleRight = false;

  isDesktop = false;

  // IMAGES_PATH = IMAGES_PATH;

  constructor(
    private layoutService: LayoutService,
    private dialogBottomSheetService: DialogBottomSheetService,
  ) {}

  ngOnInit(): void {
    this.isDesktop = this.layoutService.currentSize === ScreenSize.isDesktop;
  }

  close(): void {
    this.dialogBottomSheetService.close();
  }
}
