import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CreditGenerateDigitalSignatureService } from '../services/credit-generate-digital-signature.service';
import { DigitalSignatureStepperUrl } from '../credit-generate-digital-signature-step/general-digital-signature-steps.model';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditGenerateDigitalSignatureErrorComponent } from '../credit-generate-digital-signature-error/credit-generate-digital-signature-error.component';

@Component({
  selector: 'app-credit-generate-digital-signature-wrapper',
  templateUrl: './credit-generate-digital-signature-wrapper.component.html',
  imports: [RouterOutlet, CreditGenerateDigitalSignatureErrorComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureWrapperComponent implements OnInit, OnDestroy {
  creditId = '';
  fundProviderCode = '';
  errorType = signal<'NO_SERVICE' | 'FAILED_GENERATION' | null>(null);
  private creditGenerateDigitalSignatureService = inject(CreditGenerateDigitalSignatureService);
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.fundProviderCode = this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditGenerateDigitalSignatureService.errorType.subscribe((errorType) => {
      this.errorType.set(errorType);
    });
  }

  ngOnDestroy() {
    this.creditGenerateDigitalSignatureService.setDigitalSignatureAutoNavigation(true);
    this.creditGenerateDigitalSignatureService.errorType.next(null);
  }

  backToStepper() {
    this.creditGenerateDigitalSignatureService.errorType.next(null);
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode}/${this.creditId}`),
    );
  }

  goToHome() {
    this.creditGenerateDigitalSignatureService.setDigitalSignatureAutoNavigation(true);
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`),
    );
  }

  retryCurrentStep() {
    this.creditGenerateDigitalSignatureService.setDigitalSignatureAutoNavigation(true);
    this.backToStepper();
  }
}
