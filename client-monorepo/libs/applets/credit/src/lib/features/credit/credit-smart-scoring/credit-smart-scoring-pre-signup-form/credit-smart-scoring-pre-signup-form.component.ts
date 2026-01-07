import { ChangeDetectionStrategy, Component, computed, inject, input, model, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';
import { CreditRegisterFormComponent } from '../../components/credit-register-form/credit-register-form.component';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditSmartScoringStepService } from '../services/credit-smart-scoring-step.service';
import { PreSignupRequestPayload, UserType } from '../../data-access/models/credit-smart-scoring/pre-signup-request.payload';
import {
  CreditSmartScoringProfileDetailsResponse,
  PreSignupField,
} from '../../data-access/models/credit-smart-scoring/credit-smart-scoring-profile-details.response';
import { MessageService } from '../../data-access/services/message.service';
import { CreditUserService } from '../../data-access/services/credit-user.service';

@Component({
  selector: 'app-credit-smart-scoring-pre-signup-form',
  templateUrl: './credit-smart-scoring-pre-signup-form.component.html',
  styleUrls: ['./credit-smart-scoring-pre-signup-form.component.scss'],
  imports: [CreditRegisterFormComponent, CreditPageLoadingComponent, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoringPreSignupFormComponent implements OnInit {
  ctaLoading = model<boolean>();
  userType = input<UserType>(UserType.APP);
  profileDetails = signal<CreditSmartScoringProfileDetailsResponse | undefined>(undefined);

  serverValidationError = signal({});
  showLoading = signal<boolean>(true);
  serviceType = signal<SERVICE_TYPE>(1);

  cellNumber = computed(() => this.profileDetails()?.cellNumber);
  profileFields = computed<{
    birthDate?: PreSignupField;
    nationalCode?: PreSignupField;
  } | null>(() => {
    let data = {};
    this.profileDetails()?.fields.forEach((field) => {
      data = {
        ...data,
        [field.name]: field,
      };
    });
    return data;
  });

  values = computed<{ birthDate: number; nationalCode: string } | null>(() => {
    return {
      birthDate: this.profileFields()?.birthDate?.value ? parseInt('' + this.profileFields()?.birthDate?.value, 10) : null!,
      nationalCode: this.profileFields()?.nationalCode?.value?.toString() ?? '',
    };
  });

  reload = output<void>();
  close = output<void>();
  goToError = output<void>();

  private activatedRoute = inject(ActivatedRoute);
  private creditSmartScoringStepService = inject(CreditSmartScoringStepService);
  private messageService = inject(MessageService);
  private userService = inject(CreditUserService);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((param) => {
      if (param['serviceType']) {
        this.serviceType.set(+param['serviceType']);
      }
    });
    this.getUserDetails();
  }

  getUserDetails() {
    this.creditSmartScoringStepService.getUserDetails().subscribe({
      next: (response) => {
        this.profileDetails.set(response);
        this.showLoading.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.close.emit();
      },
    });
  }

  submitForm(data: PreSignupRequestPayload) {
    this.ctaLoading.set(true);
    this.creditSmartScoringStepService
      .submit(data)
      .then(() => {
        this.reload.emit();
        this.sendEvent();
      })
      .catch(() => {
        this.reload.emit();
      });
  }

  sendEvent() {
    this.creditSmartScoringStepService.sendEvent('credit_smart_scoring_pre_signup').then();
  }

  onBack(): void {
    this.close.emit();
  }
}
