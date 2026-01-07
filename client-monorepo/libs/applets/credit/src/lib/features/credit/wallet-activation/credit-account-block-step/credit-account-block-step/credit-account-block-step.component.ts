import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditUrlService } from '../../../data-access/utils/url';
import { MessageService } from '../../../data-access/services/message.service';
import { ACCOUNT_BLOCK_STATUS } from '../../../data-access/models/credit/activation/account-block-step/account-block-step-status';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAccountBlockSuccessComponent } from '../credit-account-block-success/credit-account-block-success.component';
import { CreditAccountBlockRejectedComponent } from '../credit-account-block-rejected/credit-account-block-rejected.component';
import { CreditAccountBlockNoServiceComponent } from '../credit-account-block-no-service/credit-account-block-no-service.component';
import { CreditAccountBlockInProgressSmsComponent } from '../credit-account-block-in-progress-sms/credit-account-block-in-progress-sms.component';
import { CreditAccountBlockInProgressComponent } from '../credit-account-block-in-progress/credit-account-block-in-progress.component';
import { CreditAccountBlockFailedComponent } from '../credit-account-block-failed/credit-account-block-failed.component';
import { CreditAccountBlockInitComponent } from '../credit-account-block-init/credit-account-block-init.component';

@Component({
  selector: 'app-credit-account-block-step',
  templateUrl: './credit-account-block-step.component.html',
  styleUrls: ['./credit-account-block-step.component.scss'],
  standalone: true,
  imports: [
    CreditAccountBlockInitComponent,
    CreditAccountBlockFailedComponent,
    CreditAccountBlockInProgressComponent,
    CreditAccountBlockInProgressSmsComponent,
    CreditAccountBlockNoServiceComponent,
    CreditAccountBlockRejectedComponent,
    CreditAccountBlockSuccessComponent,
    CreditPageLoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditAccountBlockStepComponent implements OnInit {
  fundProviderCode!: number;
  creditId = signal<string | null>(null);
  gettingStatus = signal<boolean | null>(null);
  status = signal<ACCOUNT_BLOCK_STATUS | null>(null);
  statusEnum = ACCOUNT_BLOCK_STATUS;
  pendingCounter = signal<number>(0);

  private activatedRoute = inject(ActivatedRoute);
  private creditApiService = inject(CreditApiService);
  private creditUrlService = inject(CreditUrlService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId.set(this.activatedRoute.snapshot.params['creditId']);
    this.getStatus();
  }

  closeStep(): void {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId()}`),
    );
  }

  reloadStatus(): void {
    this.getStatus();
  }

  nextStep(): void {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId()}/next`),
    );
  }

  retryBlock(): void {
    this.gettingStatus.set(true);
    this.creditApiService.retryBlockAccount(this.creditId()!).subscribe({
      next: () => {
        this.reloadStatus();
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.reloadStatus();
      },
    });
  }

  private getStatus() {
    this.gettingStatus.set(true);
    this.creditApiService.getAccountBlockStepStatus(this.creditId()!).subscribe({
      next: (response) => {
        if (response.status === 2) {
          this.pendingCounter.update((counter) => counter++);
        }
        this.status.set(response.status);
        this.gettingStatus.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.closeStep();
      },
    });
  }
}
