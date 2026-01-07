import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditSmartScoringStepResultData } from './credit-smart-scoring-step-result-data';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditSmartScoringStepService, SmartScoringStatusErrorType } from '../services/credit-smart-scoring-step.service';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditSmartScoringOngoingPlan } from '../../data-access/models/credit-smart-scoring/credit-smart-scoring-ongoing.plan';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'app-credit-smart-scoring-error',
  templateUrl: './credit-smart-scoring-error.component.html',
  styleUrls: ['./credit-smart-scoring-error.component.scss'],
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent, NgxCalloutComponent, NgxBadgeModule, CreditPageLoadingComponent, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoringErrorComponent implements OnInit {
  ongoingPlanDetails = input<CreditSmartScoringOngoingPlan>();

  loading = signal(true);
  errorType = signal<SmartScoringStatusErrorType>(null);

  dataMap = computed(() => {
    if (this.errorType() && CreditSmartScoringStepResultData[this.errorType()!]) {
      const dataMap = CreditSmartScoringStepResultData[this.errorType()!];
      if (this.errorType() === 'USER_HAVE_ON_GOING_PLAN') {
        dataMap.description = dataMap.description.replace('{phoneNumber}', this.ongoingPlanDetails()?.user?.phoneNumber ?? '');
        dataMap.calloutMessages = dataMap.calloutMessages?.map((message) =>
          message.replace('{phoneNumber}', this.ongoingPlanDetails()?.user.phoneNumber ?? ''),
        );
      }
      return dataMap;
    }
    return;
  });
  description = computed(() =>
    this.ongoingPlanDetails()
      ? `کد ملی ${this.ongoingPlanDetails()?.user.nationalCode} با شماره همراه ${this.ongoingPlanDetails()?.user.phoneNumber} در ۳۰ روز گذشته طرح‌ زیر را انتخاب کرده‌است:`
      : '',
  );

  reload = output<void>();
  close = output<void>();
  goToOverview = output<void>();
  goToPreSignup = output<void>();

  private creditSmartScoringStepService = inject(CreditSmartScoringStepService);

  ngOnInit() {
    this.errorType.set(this.creditSmartScoringStepService.getErrorTypeValue());
    this.loading.set(false);
  }

  onBack() {
    if (this.errorType() === 'USER_IS_DECEASED') {
      this.close.emit();
      return;
    }
    this.goToPreSignup.emit();
  }

  onClose() {
    if (this.errorType() === 'OTP_CODE_RESEND_EXCEEDED') {
      this.reload.emit();
      return;
    }
    if (['USER_HAVE_ACTIVE_PLAN', 'USER_HAVE_ON_GOING_PLAN', 'USER_IS_DECEASED'].includes(this.errorType()!)) {
      this.close.emit();
      return;
    }
    this.goToPreSignup.emit();
  }
}
