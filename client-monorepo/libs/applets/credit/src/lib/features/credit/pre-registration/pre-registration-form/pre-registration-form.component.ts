import { ChangeDetectionStrategy, Component, DestroyRef, inject, model, OnInit, signal } from '@angular/core';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { ActivatedRoute } from '@angular/router';
import { VolunteerField } from '../../data-access/models/credit/volunteer/volunteers-detail.response';
import { MerchantType, PreRegisterRequest } from '../../data-access/models/credit/volunteer/pre-register.request';
import { PreRegistrationService } from '../services/pre-registration.service';
import { PreRegistrationSubmitterService } from '../services/pre-registration-submitter.service';
import { CreditCacheService } from '../../data-access/services/credit-cache.service';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';
import { CreditRegisterFormComponent } from '../../components/credit-register-form/credit-register-form.component';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { MessageService } from '../../data-access/services/message.service';
import { CREDIT_ENVIRONMENT } from '../../credit-environment.interface';

@Component({
  selector: 'app-pre-registration-form',
  templateUrl: './pre-registration-form.component.html',
  styleUrls: ['./pre-registration-form.component.scss'],
  imports: [CreditRegisterFormComponent, CreditPageLoadingComponent, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationFormComponent implements OnInit {
  cellNumber = signal<string>('');
  ctaLoading = model<boolean>();
  values = signal<{ birthDate: number; nationalCode: string } | null>(null);
  serverValidationError = signal({});
  showLoading = signal<boolean>(true);
  serviceType = signal<SERVICE_TYPE>(1);
  volunteerFields = signal<{
    birthDate?: VolunteerField;
    nationalCode?: VolunteerField;
  } | null>(null);
  private planId!: string;
  private groupId!: string;
  private balance!: number;
  private orderId!: string;
  private amount!: number;
  private merchant: MerchantType = MerchantType.NO_MERCHANT;
  private reservation = false;
  private destroyed = false;

  private creditApiService = inject(CreditApiService);
  private activatedRoute = inject(ActivatedRoute);
  private preRegistrationService = inject(PreRegistrationService);
  private preRegistrationSubmitterService = inject(PreRegistrationSubmitterService);
  private cache = inject(CreditCacheService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });

    const params = this.activatedRoute.snapshot.params;
    this.planId = params['planId'];
    this.groupId = params['groupId'];
    this.activatedRoute.queryParams.subscribe((param) => {
      const BALANCE = 'BALANCE';
      if (param['balance']) {
        this.cache.put(BALANCE, param['balance']);
        this.balance = param['balance'];
      } else {
        if (this.cache.has(BALANCE)) {
          this.balance = this.cache.get(BALANCE);
        }
      }
      if (param['merchant']) {
        const merchantType: MerchantType = param['merchant'].toUpperCase();
        this.merchant = isNaN(+MerchantType[merchantType]) ? MerchantType.DIGIKALA : +MerchantType[merchantType];
      }

      if (this.isPillar) {
        this.merchant = MerchantType.PILLAR;
      }

      if (param['orderId'] && param['amount']) {
        this.reservation = true;
        this.orderId = param['orderId'];
        this.amount = +param['amount'];
        sessionStorage.setItem('_reservationOrderId', param['orderId']);
      } else {
        sessionStorage.removeItem('_reservationOrderId');
      }
      if (param['serviceType']) {
        this.serviceType.set(+param['serviceType']);
      }
    });
    this.getData();
  }

  getData(): void {
    this.creditApiService.getVolunteersDetail().subscribe({
      next: (response) => {
        this.cellNumber.set(response.cellNumber);
        this.volunteerFields.set({});
        response.fields.forEach((field) => {
          this.volunteerFields.update((volunteer) => ({
            ...volunteer,
            [field.name]: field,
          }));
        });

        const birthDate = this.volunteerFields()?.birthDate?.value || null;
        const nationalCode = this.volunteerFields()?.nationalCode?.value || '';
        this.values.set({
          birthDate: birthDate ? parseInt('' + birthDate, 10) : null!,
          nationalCode: '' + nationalCode,
        });
        this.showLoading.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.showLoading.set(false);
      },
    });
  }

  submitForm(data: { nationalCode: string; birthDate: number }) {
    const payload: PreRegisterRequest = {
      nationalCode: data.nationalCode,
      birthDate: data.birthDate,
      planId: this.planId,
      groupId: this.groupId,
      balance: this.balance,
      cartReservationRequest: this.reservation
        ? {
            orderId: this.orderId,
            amount: this.amount,
          }
        : null,
      ...(this.merchant !== MerchantType.NO_MERCHANT && {
        merchant: this.merchant,
      }),
    };
    this.ctaLoading.set(true);
    this.preRegistrationSubmitterService.submit(payload).then(
      () => {
        // Defer signal write to escape reactive context
        setTimeout(() => {
          if (!this.destroyed) {
            this.ctaLoading.set(false);
          }
        }, 0);
      },
      (errors) => {
        // Defer signal write to escape reactive context
        setTimeout(() => {
          if (!this.destroyed) {
            this.serverValidationError.set(errors);
          }
        }, 0);
      },
    );
  }

  onBack(): void {
    this.preRegistrationService.goToPlanGroupDetail(this.planId, this.groupId);
  }
}
