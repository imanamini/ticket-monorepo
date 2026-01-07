import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStateService, NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Router } from '@angular/router';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CancelActivationMessageAction } from '../../cancel-activation-bottom-sheet/cancel-activation-bottom-sheet.model';
import { CancelActivationBottomSheetComponent } from '../../cancel-activation-bottom-sheet/cancel-activation-bottom-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditScoringStepService } from '../services/credit-scoring-step.service';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-scoring-white-list-status',
  templateUrl: './credit-scoring-white-list-status.component.html',
  styleUrls: ['./credit-scoring-white-list-status.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringWhiteListStatusComponent {
  fundProviderCode = input.required<string>();
  creditId = input.required<string>();

  buttons: Buttons[] = [
    {
      id: 'primary',
      style: 'fill',
      mode: 'form',
      fullWidth: true,
      label: 'ادامه فرایند ثبت‌نام',
    },
  ];
  title = 'شما کاربر ویژه هستید و طرح انتخابی‌تان در محدوده مجاز قرار دارد.';
  description = 'تبریک! برای دریافت اعتبار فرایند ثبت‌نام را ادامه بدهید.';

  loading = signal(false);

  close = output<void>();
  next = output<void>();

  router = inject(Router);
  stateService = inject(NgxStateService);
  bottomSheetService = inject(NgxBottomSheetService);
  creditScoringService = inject(CreditScoringStepService);

  onCancelActivation(): void {
    this.stateService.openBottomSheet({
      type: 'Confirmation',
      icon: 'question',
      title: 'لغو فرایند دریافت اعتبار',
      description:
        'در صورت لغو فرایند و اقدام به دریافت اعتبار جدید، تمامی مراحل ثبت‌نام شما از ابتدا صورت خواهد گرفت.آیا از لغو فرایند اطمینان دارید؟',
      buttons: [
        {
          label: 'بستن',
          id: CancelActivationMessageAction.CLOSE,
          style: 'tinted-on-elevated',
          mode: 'form',
          fullWidth: true,
        },
        {
          label: 'اطمینان دارم',
          id: CancelActivationMessageAction.CONFIRM,
          style: 'fill',
          mode: 'form',
          fullWidth: true,
        },
      ],
    });

    const onClose = this.stateService.onClose().subscribe(() => {
      onClose.unsubscribe();
      const result = this.stateService.outputData();
      if (result?.clicked === 'CONFIRM') {
        this.showCancelActivationBottomSheet();
      }
    });
  }

  showCancelActivationBottomSheet() {
    this.loading.set(true);
    this.bottomSheetService.openBottomSheet(
      CancelActivationBottomSheetComponent,
      {
        data: {
          creditId: this.creditId(),
          fundProviderCode: this.fundProviderCode(),
        },
      },
      {
        noPadding: true,
      },
    );
    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe(() => {
      onCloseBottomSheet.unsubscribe();
      const result = this.bottomSheetService.outputData();
      if (result && result.done) {
        this.creditScoringService.goToCreditHome('resolve');
      } else {
        this.loading.set(false);
      }
    });
  }
}
