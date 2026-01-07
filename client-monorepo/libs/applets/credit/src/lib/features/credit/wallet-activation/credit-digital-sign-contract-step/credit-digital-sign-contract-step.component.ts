import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { MessageService } from '../../data-access/services/message.service';
import { GetDigitalSignatureOnlineContractStatus } from '../../data-access/models/credit/activation/get-digital-signature-online-contract-status';
import { CreditWindow } from '../../data-access/services/credit-window';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditStepStatusMessageComponent } from '../credit-step-status-message/credit-step-status-message.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';

declare const window: CreditWindow;

@Component({
  selector: 'app-credit-digital-sign-contract-step',
  templateUrl: './credit-digital-sign-contract-step.component.html',
  styleUrls: ['./credit-digital-sign-contract-step.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditStepStatusMessageComponent,
    NgxButtonComponent,
    CreditPageLoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditDigitalSignContractStepComponent implements OnInit {
  gettingData = signal<boolean>(false);
  fundProviderCode!: number;
  creditId!: string;
  pageTitle = signal('امضا دیجیتال');
  data = signal<GetDigitalSignatureOnlineContractStatus | undefined>(undefined);

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private creditUrlService = inject(CreditUrlService);
  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.getData();
  }

  getData(): void {
    this.gettingData.set(true);
    this.creditApiService.getDigitalSignAndContractStatus(this.creditId, this.fundProviderCode, this.canGenerateSign()!).subscribe({
      next: (response) => {
        this.pageTitle.set(response.pageTitle || this.pageTitle());
        this.data.set(response);
        this.gettingData.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.goBack();
        this.gettingData.set(false);
      },
    });
  }

  goBack() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`),
    );
  }

  canGenerateSign(): undefined | boolean {
    return window.generateSign && typeof window.generateSign === 'function';
  }

  goToAction(): void {
    if (this.canGenerateSign()) {
      window.generateSign?.();
    } else {
      this.goBack();
    }
  }
}
