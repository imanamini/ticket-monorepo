import { ChangeDetectionStrategy, Component, computed, input, OnInit, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { CreditUrlService } from '../../../../data-access/utils/url';
import { FormsModule } from '@angular/forms';
import { DigitalSignatureDetailsResponse } from '../../../../data-access/models/credit/activation/generate-digital-signature-step/general-digital-signature-details';
import { DigitalSignatureStepperUrl } from '../../credit-generate-digital-signature-step/general-digital-signature-steps.model';
import { CreditGenerateDigitalSignatureService } from '../../services/credit-generate-digital-signature.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-generate-digital-signature-confirm',
  templateUrl: './credit-generate-digital-signature-confirm.component.html',
  styleUrl: './credit-generate-digital-signature-confirm.component.scss',
  imports: [
    FormsModule,
    NgxButtonComponent,
    NgxBadgeModule,
    NgxDividerComponent,
    NgxTrackableIdDirective,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureConfirmComponent implements OnInit {
  creditId = input.required<string>();
  fundProviderCode = input.required<string>();
  loading = input(false);
  showDefaultRemainingDays = input(false);
  defaultRemainingDays = 365;
  realRemainingDays = signal<number>(0);
  accordionOpened = signal<boolean>(false);
  signatureDetails = signal<DigitalSignatureDetailsResponse | null>(null);
  fullName = computed(() => (this.signatureDetails() ? this.signatureDetails()?.name + ' ' + this.signatureDetails()?.surname : ''));
  confirmed = output<void>();
  remainingDays = computed<number | undefined>(() =>
    this.showDefaultRemainingDays() ? this.defaultRemainingDays : this.realRemainingDays(),
  );

  constructor(
    private router: Router,
    private creditApiService: CreditApiService,
    private creditUrlService: CreditUrlService,
    private creditGenerateDigitalSignatureService: CreditGenerateDigitalSignatureService,
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('_digitalSignatureRemainingDays')) {
      this.realRemainingDays.set(+sessionStorage.getItem('_digitalSignatureRemainingDays')!);
    }
    this.getSignatureDetails();
  }

  getSignatureDetails() {
    this.creditApiService.getDigitalSignatureDetails(this.creditId()).subscribe({
      next: (signatureDetails) => {
        this.signatureDetails.set(signatureDetails);
      },
      error: (error) => {
        this.creditGenerateDigitalSignatureService.handleError(error);
      },
    });
  }

  backToStepper() {
    if (this.realRemainingDays()) {
      this.backToCreditStepper();
      return;
    }
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`${DigitalSignatureStepperUrl + this.fundProviderCode()}/${this.creditId()}`),
    );
  }

  backToCreditStepper() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}`),
    );
  }

  changeAccordionState() {
    this.accordionOpened.update((state) => !state);
  }

  submit() {
    this.confirmed.emit();
  }

  protected readonly BorderColorsEnum = BorderColorsEnum;
}
