import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditGenerateDigitalSignatureService } from '../services/credit-generate-digital-signature.service';
import { DigitalSignatureStepperUrl } from '../credit-generate-digital-signature-step/general-digital-signature-steps.model';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-generate-digital-signature-token-expired',
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  templateUrl: './credit-generate-digital-signature-token-expired.component.html',
  styleUrl: './credit-generate-digital-signature-token-expired.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureTokenExpiredComponent implements OnInit {
  creditId!: string;
  fundProviderCode!: number;
  title = 'درخواست ساخت امضای دیجیتال شما منقضی شده‌ است';
  description = 'درخواست ساخت امضای دیجیتال شما منقضی شده است. لطفاً فرآیند ساخت امضا را از ابتدا شروع کنید.';
  buttons: Buttons[] = [
    {
      id: 'signatureTokenExpiredConfirmButton',
      style: 'fill',
      mode: 'form',
      fullWidth: true,
      label: 'ساخت امضای دیجیتال',
    },
  ];
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private creditUrlService = inject(CreditUrlService);
  private creditApiService = inject(CreditApiService);
  private creditDigitalSignatureService = inject(CreditGenerateDigitalSignatureService);

  ngOnInit() {
    this.fundProviderCode = +this.activatedRoute.parent?.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.parent?.snapshot.params['creditId'];
  }

  resetDigitalSignatureToken() {
    this.creditApiService.resetDigitalSignatureStatus(this.creditId).subscribe({
      next: () => {
        this.creditDigitalSignatureService.setDigitalSignatureAutoNavigation(true);
        this.backToStepper();
      },
      error: (error) => {
        this.creditDigitalSignatureService.handleError(error);
      },
    });
  }

  backToStepper() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode}/${this.creditId}`),
    );
  }
}
