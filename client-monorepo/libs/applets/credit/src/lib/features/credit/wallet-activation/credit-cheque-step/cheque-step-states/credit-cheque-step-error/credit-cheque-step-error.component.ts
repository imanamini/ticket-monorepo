import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output } from '@angular/core';
import { CreditChequeDocument } from '../../../../data-access/models/credit/activation/cheque-step/cheque-step-detail-response.model';
import { CreditImageDialogComponent } from '../../../../components/credit-image-dialog/credit-image-dialog.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditDigipayImageComponent } from '../../../../components/credit-digipay-image/credit-digipay-image.component';
import { ChequeStatus } from '../../../../data-access/models/credit/activation/cheque-step/cheque-status-response';
import { CreditStepperComponent } from '../../../../components/credit-stepper/credit-stepper.component';

@Component({
  selector: 'app-credit-cheque-step-error',
  templateUrl: './credit-cheque-step-error.component.html',
  styleUrls: ['./credit-cheque-step-error.component.scss'],
  standalone: true,
  imports: [
    NgxBadgeModule,
    NgxIcon,
    NgxCalloutComponent,
    NgxButtonComponent,
    NgxDividerComponent,
    NgxTrackableIdDirective,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditDigipayImageComponent,
    CreditStepperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepErrorComponent implements OnInit {
  gettingData = true;
  targetStep!: string;
  errorType!: 'notRegistered' | 'others';

  document = input<CreditChequeDocument>();
  chequeStatus = input<ChequeStatus>();

  reasons = computed(() => this.document()?.reasons);
  title = computed(() =>
    this.chequeStatus() && this.chequeStatus() === ChequeStatus.PHYSICS_REJECTED ? 'تحویل اصل چک' : 'آپلود تصویر چک',
  );
  calloutMessages = computed(() => {
    const messages = ['دلایل بالا را اصلاح کنید و چک را دوباره بارگذاری کنید.'];

    if (this.chequeStatus() && this.chequeStatus() === ChequeStatus.PHYSICS_REJECTED) {
      messages.push('برای بازگرداندن چک ارسال شده همکاران ما با شما تماس می‌گیرند.');
    }
    return messages;
  });
  close = output();
  openNotices = output();
  goToStep = output<string>();
  setErrorType = output<'notRegistered' | 'others' | ''>();

  bottomSheetService = inject(NgxBottomSheetService);
  protected readonly BorderColorsEnum = BorderColorsEnum;

  ngOnInit(): void {
    if (this.reasons()?.length === 1 && this.reasons()![0].type === 'notRegistered') {
      this.targetStep = 'SAYAD';
      this.errorType = this.reasons()![0].type!;
    } else {
      this.targetStep = 'CHEQUE_ID';
    }
  }

  onActionClick() {
    this.openNotices.emit();
  }

  onSubmit() {
    this.goToStep.emit(this.targetStep);
    this.setErrorType.emit(this.errorType);
  }

  openImageDialog() {
    this.bottomSheetService.openBottomSheet(CreditImageDialogComponent, {
      imageId: this.document()?.docId,
    });
  }
}
