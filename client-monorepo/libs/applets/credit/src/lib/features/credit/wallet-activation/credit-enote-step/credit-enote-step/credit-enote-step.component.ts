import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditUrlService } from '../../../data-access/utils/url';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditEnoteResult, CreditEnoteStateType } from '../models/credit-enote-result';
import { CreditNoteCacheKeys } from '../credit-enote-gateway/credit-note-cache-keys';
import { CreditCacheService } from '../../../data-access/services/credit-cache.service';
import { CreditNoteService } from '../credit-note.service';
import { CreditEnoteStepInfoComponent } from '../credit-enote-step-info/credit-enote-step-info.component';
import { CreditEnoteStepInProgressComponent } from '../credit-enote-step-in-progress/credit-enote-step-in-progress.component';
import { CreditEnoteStepWaitingComponent } from '../credit-enote-step-waiting/credit-enote-step-waiting.component';
import { CreditEnoteStepPaymentComponent } from '../credit-enote-step-payment/credit-enote-step-payment.component';
import { CreditEnoteStepResultComponent } from '../credit-enote-step-result/credit-enote-step-result.component';
import { ENOTE_STEP_STATUS } from '../../../data-access/models/credit/activation/enote-step/enote-step-status';
import { EnoteFailureType } from '../../../data-access/models/credit/activation/enote-step/enote-failure-type.enum';
import { CreditActionHandlerService } from '../../../data-access/utils/credit-action-handler.service';
import { ActionType } from '../../../data-access/models/action-type';
import { RedirectionTypeEnum } from '../../../data-access/models/redirection-type.enum';
import { CreditEnoteStepErrorComponent } from '../credit-enote-step-error/credit-enote-step-error.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-enote-step',
  templateUrl: './credit-enote-step.component.html',
  styleUrls: ['./credit-enote-step.component.scss'],
  standalone: true,
  imports: [
    CreditEnoteStepInfoComponent,
    CreditEnoteStepInProgressComponent,
    CreditEnoteStepWaitingComponent,
    CreditEnoteStepPaymentComponent,
    CreditEnoteStepResultComponent,
    CreditEnoteStepErrorComponent,
    CreditPageLoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEnoteStepComponent implements OnInit {
  fundProviderCode = signal<number | null>(null);
  creditId = signal<string | null>(null);
  switchTypePossible = signal<boolean | null>(null);
  showLoading = signal<boolean>(false);
  state = signal<CreditEnoteStateType>(null);
  resultData = signal<CreditEnoteResult | null>(null);
  fieldErrors = signal<{ fieldName: string; text: string }[] | null>(null);

  private activatedRoute = inject(ActivatedRoute);
  private creditApiService = inject(CreditApiService);
  private creditUrlService = inject(CreditUrlService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private cache = inject(CreditCacheService);
  private noteService = inject(CreditNoteService);
  actionHandlerService = inject(CreditActionHandlerService);

  ngOnInit(): void {
    this.fundProviderCode.set(+this.activatedRoute.snapshot.params['fundProviderCode']);
    this.creditId.set(this.activatedRoute.snapshot.params['creditId']);

    if (!this.cache.has(CreditNoteCacheKeys.switchTypePossible)) {
      this.noteService.resolve(this.fundProviderCode()!, this.creditId()!);
      return;
    }
    this.switchTypePossible.set(this.cache.get(CreditNoteCacheKeys.switchTypePossible));
    this.getStatus();
  }

  onChangeEnoteType() {
    this.noteService.goSelectPage(this.fundProviderCode()!, this.creditId()!);
  }

  getStatus(): void {
    this.showLoading.set(true);
    this.creditApiService.getEnoteStepStatus(this.creditId()!).subscribe({
      next: (response) => {
        this.fieldErrors.set(response.fieldErrors);
        switch (response.status) {
          case ENOTE_STEP_STATUS.INITIATED:
          case ENOTE_STEP_STATUS.EXPIRED:
            this.state.set('FORM');
            this.showLoading.set(false);
            break;
          case ENOTE_STEP_STATUS.IN_PROGRESS:
            this.state.set('IN_PROGRESS');
            this.showLoading.set(false);
            break;
          case ENOTE_STEP_STATUS.WAITING:
            this.state.set('WAITING');
            this.showLoading.set(false);
            break;
          case ENOTE_STEP_STATUS.READY_TO_PAYMENT:
            this.state.set('PAYMENT');
            this.showLoading.set(false);
            break;
          case ENOTE_STEP_STATUS.PAID:
            this.creditApiService.enotePaymentCallBack(this.creditId()!).subscribe({
              next: (res) => {
                this.resultData.set({
                  pageTitle: res.pageTitle,
                  title: res.noteTitle,
                  description: res.noteDescription,
                  imageId: res.imageId,
                });
                this.state.set('RESULT');
                this.showLoading.set(false);
              },
              error: (error) => {
                this.messageService.showErrorOfErrorResponse(error);
                this.showLoading.set(false);
              },
            });
            break;
          case ENOTE_STEP_STATUS.COMPLETED:
            this.showLoading.set(false);
            this.closeStep();
            break;
          case ENOTE_STEP_STATUS.FAILED:
            this.showLoading.set(false);
            if (
              response.failureResults.length &&
              response.failureResults.some((failureResult) => failureResult.failureType === EnoteFailureType.WITHOUT_SANA_CODE)
            ) {
              this.state.set('SANA_NOT_REGISTERED');
            } else {
              this.state.set('ENOTE_ERROR');
            }
            break;
          default:
            this.state.set('FORM');
            this.showLoading.set(false);
            break;
        }
      },
      error: (error) => {
        if (this.messageService.isNoServiceError(error)) {
          this.showLoading.set(false);
          this.state.set('NO_SERVICE');
          return;
        }
        this.messageService.showErrorOfErrorResponse(error);
        this.closeStep();
      },
    });
  }

  closeStep(): void {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}`),
    );
  }

  reloadStatus(): void {
    this.getStatus();
  }

  nextStep(): void {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}/next`),
    );
  }

  redirectToGateway(): void {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/enote/resolve/${this.fundProviderCode()}/${this.creditId()}`),
    );
  }

  goToSana() {
    this.actionHandlerService.handle({
      type: ActionType.REDIRECT,
      payload: {
        type: RedirectionTypeEnum.blank,
        url: 'https://www.ncr.ir/idcard/tracking/trackWithTrackingId.xhtml',
      },
    });
  }
}
