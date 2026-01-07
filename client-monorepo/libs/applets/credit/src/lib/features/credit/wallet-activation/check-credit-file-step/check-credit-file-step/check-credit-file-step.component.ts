import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditUrlService } from '../../../data-access/utils/url';
import { MessageService } from '../../../data-access/services/message.service';
import { CHECK_CREDIT_FILE_STATUS } from '../../../data-access/models/credit/activation/check-credit-file/check-credit-file-status';
import { CHECK_CREDIT_FILE_RESULT } from '../../../data-access/models/credit/activation/check-credit-file/check-credit-file-result';
import { CheckCreditFileFailedResult } from '../check-credit-file-failed/check-credit-file-failed-result';
import { CheckCreditFileInProgressComponent } from '../check-credit-file-in-progress/check-credit-file-in-progress.component';
import { CheckCreditFileNoServiceComponent } from '../check-credit-file-no-service/check-credit-file-no-service.component';
import { CheckCreditFileRejectedComponent } from '../check-credit-file-rejected/check-credit-file-rejected.component';
import { CheckCreditFileFailedComponent } from '../check-credit-file-failed/check-credit-file-failed.component';
import { CheckCreditFileSuccessComponent } from '../check-credit-file-success/check-credit-file-success.component';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

const maximumRetryErrorCode = 429;

@Component({
  selector: 'app-check-credit-file-step',
  templateUrl: './check-credit-file-step.component.html',
  styleUrls: ['./check-credit-file-step.component.scss'],
  standalone: true,
  imports: [
    CheckCreditFileInProgressComponent,
    CheckCreditFileNoServiceComponent,
    CheckCreditFileRejectedComponent,
    CheckCreditFileFailedComponent,
    CheckCreditFileSuccessComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckCreditFileStepComponent implements OnInit {
  fundProviderCode!: number;
  creditId!: string;
  message = signal<string | null>(null);
  gettingStatus = signal<boolean | null>(null);
  status = signal<CHECK_CREDIT_FILE_STATUS | null>(null);
  statusEnum = CHECK_CREDIT_FILE_STATUS;
  creditFileResult = signal<CHECK_CREDIT_FILE_RESULT | null>(null);
  creditFileFailedResult = signal<CheckCreditFileFailedResult | null>(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private creditApiService: CreditApiService,
    private creditUrlService: CreditUrlService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.getStatus();
  }

  closeStep(): void {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`),
    );
  }

  reloadStatus(retry = false): void {
    this.getStatus(retry);
  }

  nextStep(): void {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}/next`),
    );
  }

  getData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.creditApiService
        .getCheckCreditFileStatus(this.creditId)
        .pipe(
          tap((response) => {
            this.status.set(response.status);

            if (this.status() === CHECK_CREDIT_FILE_STATUS.REJECTED) {
              this.creditFileResult.set(response.creditFileResult!);
              if (response.message) {
                this.message.set(response.message);
              }
            }

            if (this.status() === CHECK_CREDIT_FILE_STATUS.FAILED) {
              this.creditFileFailedResult.set({
                cheques: response.bouncedChequeDetails!,
                loans: response.postponedLoanDetails!,
              });
            }

            resolve();
          }),
          catchError((error) => {
            this.messageService.showErrorOfErrorResponse(error);
            reject(new Error('Operation failed'));
            return of(null); // Return a fallback observable to keep the stream alive
          }),
        )
        .subscribe();
    });
  }

  private getStatus(retry = false) {
    this.gettingStatus.set(true);
    this.creditApiService.inquiryCheckCreditFile(this.creditId, retry).subscribe({
      next: () => {
        this.getData()
          .then(() => {
            this.gettingStatus.set(false);
          })
          .catch((error) => {
            this.gettingStatus.set(false);
            this.closeStep();
            this.messageService.showErrorOfErrorResponse(error);
          });
      },
      error: (error) => {
        if (error?.result?.status === maximumRetryErrorCode) {
          this.messageService.showErrorMessage(
            'تعداد درخواست روزانه مجاز شما به اتمام رسیده است. برای درخواست دوباره، ۲۴ ساعت دیگر اقدام کنید.',
          );
        } else {
          this.messageService.showErrorOfErrorResponse(error);
        }
        this.closeStep();
      },
    });
  }
}
