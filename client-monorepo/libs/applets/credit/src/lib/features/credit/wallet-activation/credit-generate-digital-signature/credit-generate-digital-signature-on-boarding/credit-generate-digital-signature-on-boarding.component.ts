import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { DigitalSignatureGenerationOnBoardingResponse } from '../../../data-access/models/credit/activation/generate-digital-signature-step/get-digital-signature-generation-on-boarding.response';
import { CreditGenerateDigitalSignatureService } from '../services/credit-generate-digital-signature.service';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditDigipayImageComponent } from '../../../components/credit-digipay-image/credit-digipay-image.component';

@Component({
  selector: 'app-credit-generate-digital-signature-on-boarding',
  templateUrl: './credit-generate-digital-signature-on-boarding.component.html',
  styleUrls: ['./credit-generate-digital-signature-on-boarding.component.scss'],
  standalone: true,
  imports: [
    NgxButtonComponent,
    NgxTrackableIdDirective,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditDigipayImageComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureOnBoardingComponent implements OnInit {
  creditId = input.required<string>();
  fundProviderCode = input.required<number>();
  gettingData = signal<boolean>(false);
  data = signal<DigitalSignatureGenerationOnBoardingResponse | null>(null);
  visit = output();
  isPlaying = signal(false);
  videoElement = viewChild<ElementRef<HTMLVideoElement>>('videoElement');

  private creditApiService = inject(CreditApiService);
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);
  private creditGenerateDigitalSignatureService = inject(CreditGenerateDigitalSignatureService);

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.gettingData.set(true);
    this.creditApiService.getDigitalSignatureGenerationOnBoarded(this.creditId()).subscribe({
      next: (response) => {
        this.data.set(response);
        this.gettingData.set(false);
      },
      error: (error) => {
        this.creditGenerateDigitalSignatureService.handleError(error);
        this.gettingData.set(false);
      },
    });
  }

  backToCreditStepper() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}`),
    );
  }

  onCtaClick() {
    this.visit.emit();
  }

  async play() {
    await this.videoElement()?.nativeElement.play();
    this.isPlaying.set(true);
  }
}
