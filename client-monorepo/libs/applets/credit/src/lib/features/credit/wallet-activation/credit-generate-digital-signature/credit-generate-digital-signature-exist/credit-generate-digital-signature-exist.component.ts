import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { NgxStateService, NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { MessageService } from '../../../data-access/services/message.service';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-generate-digital-signature-exist',
  standalone: true,
  imports: [NgxStatusResultModule, NgxCalloutComponent, CreditAppBarComponent, CreditPageLoadingComponent],
  templateUrl: './credit-generate-digital-signature-exist.component.html',
  styleUrl: './credit-generate-digital-signature-exist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureExistComponent {
  title = 'شما قبلا یک امضا ساخته‌اید';
  description =
    'امضای شما معتبر است.در ادامه رمز امضای خود را وارد کنید تا احراز هویت شوید و مطمئن شویم که شما قصد استفاده از این امضا را دارید.';
  buttons: Buttons[] = [
    {
      id: 'signatureExistConfirmButton',
      style: 'fill',
      fullWidth: true,
      mode: 'form',
      label: 'متوجه شدم',
    },
  ];
  fundProviderCode = input<number>();
  creditId = input<string>();

  loading = signal(false);

  next = output<void>();
  reload = output<void>();

  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);
  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);
  private ngxStateService = inject(NgxStateService);

  openForgetPasswordBottomSheet() {
    this.ngxStateService.openBottomSheet(
      {
        title: 'فراموشی رمز امضای دیجیتال',
        description: 'در صورتی که رمز خود را فراموش کرده‌ باشید باید امضای خود را حذف و دوباره اقدام به ساخت امضای دیجیتال نمایید.',
        icon: 'question',
        type: 'Confirmation',
        buttons: [
          {
            id: 'digitalSignatureRevokePasswordCancelButton',
            style: 'tinted-on-elevated',
            label: 'لغو',
            mode: 'form',
            fullWidth: true,
          },
          {
            id: 'digitalSignatureRevokePasswordConfirmButton',
            style: 'fill',
            label: 'حذف امضا',
            mode: 'form',
            fullWidth: true,
          },
        ],
      },
      { disableClose: true },
    );

    const onClose = this.ngxStateService.onClose().subscribe(() => {
      onClose.unsubscribe();
      const data = this.ngxStateService.outputData();
      if (data && data.clicked === 'digitalSignatureRevokePasswordConfirmButton') {
        this.revokeDigitalSignature();
      }
    });
  }

  revokeDigitalSignature() {
    this.loading.set(true);
    this.creditApiService.revokeCreditDigitalSignature(this.creditId()!).subscribe({
      next: () => {
        this.reload.emit();
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  backToCreditStepper() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}`),
    );
  }
}
