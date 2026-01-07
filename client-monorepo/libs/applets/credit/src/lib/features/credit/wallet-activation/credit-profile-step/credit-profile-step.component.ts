import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CreditProfileStatusResponse,
  PROFILE_STATUS,
  ProfileStateType,
} from '../../data-access/models/credit/activation/credit-profile-status.response';
import { MessageService } from '../../data-access/services/message.service';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditProfileMainFormComponent } from './credit-profile-main-form/credit-profile-main-form.component';
import { CreditProfileRegisterFormComponent } from './credit-profile-register-form/credit-profile-register-form.component';
import { CreditProfileWaitComponent } from './credit-profile-wait/credit-profile-wait.component';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditProfileStateComponent } from './credit-profile-state/credit-profile-state.component';

@Component({
  selector: 'app-credit-profile-step',
  templateUrl: './credit-profile-step.component.html',
  styleUrls: ['./credit-profile-step.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    CreditPageLoadingComponent,
    CreditProfileWaitComponent,
    CreditProfileRegisterFormComponent,
    CreditProfileMainFormComponent,
    CreditProfileStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditProfileStepComponent implements OnInit {
  fundProviderCode = signal<number | null>(null);
  creditId = signal<string | null>(null);
  pageType = signal<ProfileStateType>(null);
  waitCountDown!: number;
  title = signal('تکمیل اطلاعات');
  profileStatusData = signal<CreditProfileStatusResponse | null>(null);

  showState = computed(() => ['SHAHKAR', 'BIRTHDATE', 'NO_SERVICE', 'DEAD', 'RETRY_FAILED'].includes(this.pageType()!));

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private creditApiService = inject(CreditApiService);
  private creditUrlService = inject(CreditUrlService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.fundProviderCode.set(+this.activatedRoute.snapshot.params['fundProviderCode']);
    this.creditId.set(this.activatedRoute.snapshot.params['creditId']);
    this.getData();
  }

  getData(): void {
    this.pageType.set('LOADING');
    this.creditApiService.getProfileStepStatus(this.creditId()!).subscribe((response) => {
      this.title.set(response.pageTitle || 'تکمیل اطلاعات');
      this.profileStatusData.set(response);
      switch (response.status) {
        case PROFILE_STATUS.INITIATED:
          this.runInquiry();
          break;
        case PROFILE_STATUS.COMPLETED:
          this.nextStep();
          break;
        case PROFILE_STATUS.RETRY_FAILED:
          this.pageType.set('RETRY_FAILED');
          break;
        case PROFILE_STATUS.PENDING:
          this.waitCountDown = response.checkCountDown || 60;
          this.pageType.set('WAIT');
          break;
        case PROFILE_STATUS.SHAHKAR:
          this.pageType.set('SHAHKAR');
          break;
        case PROFILE_STATUS.BIRTHDATE:
          this.pageType.set('BIRTHDATE');
          break;
        case PROFILE_STATUS.SERVICE_ERROR:
          this.pageType.set('NO_SERVICE');
          break;
        case PROFILE_STATUS.SUCCESS:
          this.pageType.set('MAIN_FORM');
          break;
        case PROFILE_STATUS.POSTAL_CODE_RETRY:
          this.pageType.set('MAIN_FORM');
          break;
        case PROFILE_STATUS.REGISTRATION_IDENTITY_RETRY:
          this.pageType.set('REGISTER_FORM');
          break;
        case PROFILE_STATUS.DEAD:
          this.pageType.set('DEAD');
          break;
      }
    });
  }

  goBack() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}`),
    );
  }

  nextStep() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode()}/${this.creditId()}/next`),
    );
  }

  runInquiry(): void {
    this.creditApiService.getRunProcessOfProfileStep(this.creditId()!).subscribe({
      next: () => {
        this.getData();
      },
      error: (error) => {
        this.messageService.getMessageIfItHas(error);
        this.goBack();
      },
    });
  }
}
