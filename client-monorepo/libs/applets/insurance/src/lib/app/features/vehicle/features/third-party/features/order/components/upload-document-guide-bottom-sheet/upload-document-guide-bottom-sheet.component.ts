import { Component, signal } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { UploadDocumentTypeEnum } from '../../data-access/enums/upload-document-type.enum';
import { NgClass } from '@angular/common';
import { InsButtonComponent } from '../../../../../../../../components/ins-button/ins-button.component';

@Component({
  selector: 'upload-document-guide-bottom-sheet',
  standalone: true,
  imports: [NgClass, InsButtonComponent],
  templateUrl: './upload-document-guide-bottom-sheet.component.html',
  styleUrl: './upload-document-guide-bottom-sheet.component.scss',
})
export class UploadDocumentGuideBottomSheetComponent {
  protected readonly UploadDocumentTypeEnum = UploadDocumentTypeEnum;

  selectedTab = signal<UploadDocumentTypeEnum>(UploadDocumentTypeEnum.DriverLicenseForImage);

  constructor(private bottomSheetRef: MatBottomSheetRef) {}

  changeSelectedTab(tab: UploadDocumentTypeEnum): void {
    this.selectedTab.set(tab);
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }
}
