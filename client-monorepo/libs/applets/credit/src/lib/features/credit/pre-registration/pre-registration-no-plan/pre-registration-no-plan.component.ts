import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PreRegistrationErrorType } from '../services/pre-registration-error-type';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditServiceTypeService } from '../../data-access/services/credit-service-type.service';
import { Buttons, IconStateType } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { DataMapper } from './pre-registration-no-plan-data.model';

@Component({
  selector: 'app-pre-registration-no-plan',
  templateUrl: './pre-registration-no-plan.component.html',
  styleUrls: ['./pre-registration-no-plan.component.scss'],
  imports: [NgxStatusResultModule, CreditAppBarComponent, NgxCalloutComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationNoPlanComponent {
  dataMapper: DataMapper = {
    NO_PLAN: {
      title: 'تکمیل ظرفیت اعطای طرح اعتباری',
      description: 'با توجه به تعداد بالای درخواست‌ها، در حال حاضر امکان ارائه طرح اعتباری جدید فراهم نیست.',
    },
    NO_PLAN_USER: {
      title: 'محدودیت در داشتن چند طرح هم‌زمان',
      description:
        'برای کد ملی شما، با همین شماره همراه یا شماره‌ای دیگر، طرح اعتباری مشابهی باز است. امکان دریافت طرح جدید به‌صورت هم‌زمان وجود ندارد.',
      calloutMessage: {
        title: 'اقدام پیشنهادی:',
        description: [
          'با شماره همراه مربوط به طرح قبلی وارد شوید.',
          'اگر اعتبارتان فعال است، آن را تسویه کنید و سپس برای طرح جدید اقدام کنید.',
          'اگر اعتبارتان در حال فعال‌سازی است، درخواست قبلی را لغو کنید و بعد برای طرح جدید اقدام کنید.',
        ],
      },
    },
  };
  errorType = input.required<PreRegistrationErrorType>();
  router = inject(Router);
  creditUrlService = inject(CreditUrlService);
  creditServiceTypeService = inject(CreditServiceTypeService);

  isCredit = computed(() => this.creditServiceTypeService.isCredit());
  pageTitle = computed(() => {
    if (this.isCredit()) {
      return 'دریافت وام';
    } else {
      return 'دریافت اعتبار';
    }
  });
  iconState = computed<IconStateType>(() => (this.errorType() === 'NO_PLAN' ? 'info' : 'error'));
  buttons = computed<Buttons[]>(() => [
    {
      id: 'creditPreRegistrationNoPlanButton',
      style: 'fill',
      label: 'متوجه شدم',
      mode: 'form',
      fullWidth: true,
    },
  ]);

  close() {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'), { replaceUrl: true });
  }
}
