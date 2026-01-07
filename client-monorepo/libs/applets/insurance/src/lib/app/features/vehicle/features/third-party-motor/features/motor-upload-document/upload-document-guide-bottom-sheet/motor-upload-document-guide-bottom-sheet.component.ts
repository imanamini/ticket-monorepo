import { Component, signal } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { NgClass } from '@angular/common';
import { InsButtonComponent } from '../../../../../../../components/ins-button/ins-button.component';
import {
  UploadDocumentTypeEnum
} from '../../../../third-party/features/order/data-access/enums/upload-document-type.enum';

@Component({
  selector: 'motor-upload-document-guide-bottom-sheet',
  standalone: true,
  imports: [
    NgClass,
    InsButtonComponent,
  ],
  templateUrl: './motor-upload-document-guide-bottom-sheet.component.html',
  styleUrl: './motor-upload-document-guide-bottom-sheet.component.scss'
})
export class MotorUploadDocumentGuideBottomSheetComponent {

  protected readonly UploadDocumentTypeEnum = UploadDocumentTypeEnum;

  selectedTab = signal<UploadDocumentTypeEnum>(UploadDocumentTypeEnum.DriverLicenseForImage);

  constructor(
    private bottomSheetRef: MatBottomSheetRef,
  ) {
  }

  changeSelectedTab(tab: UploadDocumentTypeEnum): void {
    this.selectedTab.set(tab);
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }
}
