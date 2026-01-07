import { ChangeDetectionStrategy, Component, inject, Inject, OnInit, signal } from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../data-access/services/message.service';
import { EnotePages } from '../../../data-access/models/credit/activation/enote-step/get-enote-select-config.response';
import { ENOTE_STEP_STATUS } from '../../../data-access/models/credit/activation/enote-step/enote-step-status';
import { CreditRouteStateInterface } from '../../../data-access/services/route-state/credit-route-state.interface';
import { NoteTypes } from '../../../data-access/models/credit/activation/enote-step/enote-types.enum';
import { CreditCacheService } from '../../../data-access/services/credit-cache.service';
import { zip } from 'rxjs';
import { CreditNoteCacheKeys } from './credit-note-cache-keys';
import { GetEnoteStepStatusResponse } from '../../../data-access/models/credit/activation/enote-step/get-enote-step-status.response';
import { CreditNoteService } from '../credit-note.service';
import { CreditEnoteStepErrorComponent } from '../credit-enote-step-error/credit-enote-step-error.component';
import { CreditEnoteStateType } from '../models/credit-enote-result';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-enote-gateway',
  templateUrl: './credit-enote-gateway.component.html',
  styleUrls: ['./credit-enote-gateway.component.scss'],
  standalone: true,
  imports: [CreditEnoteStepErrorComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEnoteGatewayComponent implements OnInit {
  creditId!: string;
  fundProviderCode!: number;
  pages!: EnotePages[];
  pageTitle!: string;
  showLoading = signal(true);
  state!: 'FORM' | 'IN_PROGRESS' | 'PAYMENT' | 'RESULT' | 'WAITING';
  fieldErrors!: { fieldName: string; text: string }[];
  errorState = signal<CreditEnoteStateType>(null);

  private apiService = inject(CreditApiService);
  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private noteService = inject(CreditNoteService);
  private cache = inject(CreditCacheService);

  constructor(
    @Inject('RouteStateInterface')
    private routeStateService: CreditRouteStateInterface,
  ) {}

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];

    this.getAllInformation();
  }

  getAllInformation() {
    this.errorState.set(null);
    this.showLoading.set(true);
    zip(this.getSwitchTypePossibilityRequest(), this.getConfigRequest(), this.getStatusRequest()).subscribe({
      next: (res) => {
        this.showLoading.set(false);
        this.cache.put(CreditNoteCacheKeys.switchTypePossible, res[0]?.possible);
        this.cache.put(CreditNoteCacheKeys.config, {
          pageTitle: res[1]?.pageTitle,
          pages: res[1]?.pages,
        });
        this.cache.put(CreditNoteCacheKeys.noteStatus, res[2].status);
        this.statusHandler(res[2]);
      },
      error: (e) => {
        this.showLoading.set(false);
        if (this.messageService.isNoServiceError(e)) {
          this.errorState.set('NO_SERVICE');
          return;
        }
        this.messageService.showErrorOfErrorResponse(e);
        this.closeStep();
      },
    });
  }

  getSwitchTypePossibilityRequest() {
    return this.apiService.getNotSwitchTypePossibility(this.creditId);
  }

  getConfigRequest() {
    return this.apiService.getEnoteSelectConfig(this.creditId);
  }

  getStatusRequest() {
    return this.apiService.getEnoteStepStatus(this.creditId);
  }

  statusHandler(stepStatusResponse: GetEnoteStepStatusResponse) {
    this.fieldErrors = stepStatusResponse.fieldErrors;
    switch (stepStatusResponse.status) {
      case ENOTE_STEP_STATUS.INITIATED:
      case ENOTE_STEP_STATUS.FAILED:
        this.goToSelectPage();
        break;
      case ENOTE_STEP_STATUS.IN_PROGRESS:
      case ENOTE_STEP_STATUS.WAITING:
      case ENOTE_STEP_STATUS.READY_TO_PAYMENT:
      case ENOTE_STEP_STATUS.PAID:
        this.goToNotePage('ONLINE');
        break;
      case ENOTE_STEP_STATUS.PHYSICAL_ON_BOARDED:
      case ENOTE_STEP_STATUS.PHYSICAL_GENERATED:
      case ENOTE_STEP_STATUS.PHYSICAL_UPLOADED:
      case ENOTE_STEP_STATUS.PHYSICAL_REJECTED:
        this.goToNotePage('PHYSICAL');
        break;
      case ENOTE_STEP_STATUS.COMPLETED:
        this.showLoading.set(false);
        this.closeStep();
        break;
      case ENOTE_STEP_STATUS.EXPIRED:
        const state = this.routeStateService.getAll();
        if (typeof state.isExpired === 'boolean') {
          this.goToSelectPage();
        } else {
          this.errorState.set('EXPIRED');
        }
        this.showLoading.set(false);
    }
  }

  closeStep(): void {
    this.noteService.closeStep(this.fundProviderCode, this.creditId);
  }

  retryClick() {
    if (this.errorState() === 'EXPIRED') {
      this.goToSelectPage();
      return;
    }
    if (this.errorState() === 'NO_SERVICE') {
      this.getAllInformation();
      return;
    }
  }

  goToSelectPage() {
    this.noteService.goSelectPage(this.fundProviderCode, this.creditId);
  }

  goToNotePage(collateralType: NoteTypes) {
    this.noteService.goNotePage(this.fundProviderCode, this.creditId, collateralType);
  }
}
