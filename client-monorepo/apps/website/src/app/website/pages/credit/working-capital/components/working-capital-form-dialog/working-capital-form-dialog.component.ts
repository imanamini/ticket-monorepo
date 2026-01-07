import { Component, Inject } from '@angular/core';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../../../services/layout.service';
import { PlanGroup } from '../../../../../../ui/models/credit/credit-plan-group';
import { CurrencyPipe } from '../../../../../../ui/ui-pipes/currency.pipe';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiCardNoticeComponent } from '../../../../../../ui/ui-components/ui-card-notice/ui-card-notice.component';
import { NgIf } from '@angular/common';
import { UiPageTitleBarComponent } from '../../../../../../ui/ui-components/ui-page-title-bar/ui-page-title-bar.component';

@Component({
  selector: 'app-working-capital-form-dialog',
  templateUrl: './working-capital-form-dialog.component.html',
  styleUrls: ['./working-capital-form-dialog.component.scss'],
  standalone: true,
  imports: [UiPageTitleBarComponent, NgIf, UiCardNoticeComponent, UiButtonComponent, CurrencyPipe],
})
export class WorkingCapitalFormDialogComponent {
  textNotice = 'طرح انتخاب شده پس‌از ثبت‌نام قابل ویرایش نیست! لذا از انتخاب خود اطمینان حاصل کنید.';

  selectedPlan: PlanGroup;
  subscription: Subscription;

  constructor(
    private dialog: DialogBottomSheetService,
    private layoutService: LayoutService,
    @Inject(MAT_DIALOG_DATA)
    public matDialogData: {
      selectedPlan: PlanGroup;
    },
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public bottomSheetData: {
      selectedPlan: PlanGroup;
    },
  ) {
    this.subscription = this.layoutService.isMobile.subscribe((value) => {
      this.selectedPlan = value ? this.bottomSheetData.selectedPlan : this.matDialogData.selectedPlan;
    });
  }

  closeDialog() {
    this.dialog.close();
  }

  submit() {
    this.dialog.close(this.selectedPlan);
  }
}
