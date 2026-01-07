import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DpIconComponent } from '@client-monorepo/common/icon';

import { CommonModule } from '@angular/common';
import { InternetService } from '@client-monorepo/applets/internet';
import { InternetConfirm } from '../../data-access/models/internet-confirm.model';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'internet-applet-confirmation-dialog',
  templateUrl: './internet-confirmation-dialog.component.html',
  standalone: true,
  styleUrls: ['./internet-confirmation-dialog.component.scss'],
  imports: [CommonModule, DpIconComponent, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternetConfirmationDialogComponent implements OnInit {
  private bottomSheetService = inject(NgxBottomSheetService);
  private internetService = inject(InternetService);
  sheetData = signal<any>(null);

  ngOnInit() {
    this.sheetData.set(this.bottomSheetService.data());
  }

  cancelClicked() {
    this.bottomSheetService.closeBottomSheet();
  }

  continueClicked() {
    this.internetService.setPackageData({
      bundleId: this.sheetData().package?.bundleId,
      amount: this.sheetData().package?.amount,
      description: this.sheetData().package?.description,
      duration: this.sheetData().package?.duration,
      imageId: this.sheetData().package?.imageId,
      needApproval: this.sheetData().package?.needApproval,
    });
    const bundleTitle = this.sheetData()?.packageTitle.bundleSections[0].title;
    const confirmModel: InternetConfirm = {
      bundleTitle,
      cellNumber: this.sheetData()?.cellNumber,
      operatorId: this.sheetData()?.operatorId,
      operatorName: this.sheetData()?.operatorName,
      simType: this.sheetData()?.simType,
      operator: this.sheetData()?.operator,
    };
    this.internetService.setConfirmData(confirmModel);
    this.bottomSheetService.outputData.set({
      result: {
        confirmModel: confirmModel,
      },
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
