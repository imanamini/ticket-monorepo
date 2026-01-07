import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CreditRouteStateInterface } from '../data-access/services/route-state/credit-route-state.interface';
import { CreditNavigationService } from '../data-access/services/credit-navigation.service';
import { CreditUrlService } from '../data-access/utils/url';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditPageLoadingComponent } from '../components/credit-page-loading/credit-page-loading.component';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../components/credit-app-bar/credit-app-bar.component';
import { VOLUNTEER_STATE_TYPE } from '../data-access/models/credit/volunteer/volunteer-state-type.enum';

type DataMapperType = Partial<{
  [key in VOLUNTEER_STATE_TYPE]: any;
}>;

@Component({
  selector: 'app-credit-volunteer-page',
  templateUrl: './credit-volunteer-page.component.html',
  styleUrls: ['./credit-volunteer-page.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, NgxStatusResultModule, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditVolunteerPageComponent {
  pageLoading = signal(true);

  buttons = signal<Buttons[]>([]);

  volunteerTypeState = signal<VOLUNTEER_STATE_TYPE>(VOLUNTEER_STATE_TYPE.DEFAULT);

  dataMapper: DataMapperType = {
    [VOLUNTEER_STATE_TYPE.INACTIVE_PLAN]: {
      title: 'در حال حاضر دریافت اعتبار امکان‌پذیر نیست',
      description: 'با توجه به استقبال فراوان از طرح‌های وام دیجی‌پی، تخصیص اعتبار جدید به کاربران تا اطلاع ثانوی امکان‌پذیر نیست.',
      ctaLabel: 'متوجه شدم',
      imageType: 'warning',
      secondaryCtaLabel: '',
    },
    [VOLUNTEER_STATE_TYPE.CARD_NOT_FOUND]: {
      title: 'مشخصات شما در سامانه نیست',
      description: 'کارت اعتباری‌ای با این کد‌ملی در سامانه‌ ثبت نشده است.',
      ctaLabel: 'متوجه شدم',
      imageType: 'warning',
      secondaryCtaLabel: '',
    },
    [VOLUNTEER_STATE_TYPE.DEFAULT]: {
      title: 'متاسفانه خطایی رخ داده است',
      description: 'متاسفانه در هنگام درج اطلاعات خطایی رخ داده است. جهت پیگیری با پشتیبانی سیستم تماس بگیرید.',
      ctaLabel: 'متوجه شدم',
      imageType: 'error',
      secondaryCtaLabel: '',
    },
    [VOLUNTEER_STATE_TYPE.INACTIVE_CARD]: {
      title: 'کارت شما غیر فعال است!',
      description: 'کارت اعتباری‌ با این کد‌ملی در سامان غیر فعال میباشد.',
      ctaLabel: 'متوجه شدم',
      imageType: 'error',
      secondaryCtaLabel: '',
    },
    [VOLUNTEER_STATE_TYPE.INVALID_BALANCE]: {
      title: 'سقف اعتبار درخواستی خارج از محدوده',
      description: 'مبلغ اعتباری درخواستی شما خارج از محدوده مجاز است. جهت پیگیری با پشتیبانی سیستم تماس بگیرید.',
      ctaLabel: 'متوجه شدم',
      imageType: 'error',
      secondaryCtaLabel: '',
    },
    [VOLUNTEER_STATE_TYPE.INVALID_CELL_NUMBER]: {
      title: 'مغایرت کد ملی با مالک شماره همراه',
      description: 'کد ملی وارد شده متعلق به مالک شماره همراه نیست لطفا با شماره همراهی که متعلق به این کد ملی است وارد شوید.',
      ctaLabel: 'متوجه شدم',
      imageType: 'error',
      secondaryCtaLabel: '',
    },
    [VOLUNTEER_STATE_TYPE.LIMIT_ACTIVATION]: {
      title: 'سقف مجاز دریافت اعتبار',
      description: 'برای کد ملی وارد شده با شماره همراه دیگری به پایان رسیده است.',
      ctaLabel: 'متوجه شدم',
      imageType: 'error',
      secondaryCtaLabel: '',
    },
    [VOLUNTEER_STATE_TYPE.LIMIT_INDIVIDUAL_LEASING]: {
      title: 'این کد ملی با شماره همراه دیگری اقدام به دریافت اعتبار مشابه کرده است.',
      description: 'در صورت تمایل به دریافت اعتبار جدید، لطفا با پشتیبانی دیجی‌پی به شماره 02153924000 ، داخلی 2 تماس حاصل نمایید.',
      ctaLabel: 'متوجه شدم',
      imageType: 'error',
      secondaryCtaLabel: '',
    },
    [VOLUNTEER_STATE_TYPE.LIMIT_FUND_PROVIDER]: {
      title: 'سقف مجاز دریافت اعتبار شما از این تامین‌کننده مالی با شماره همراه دیگری پر شده است.',
      description: 'در صورت تمایل به دریافت اعتبار جدید، از قسمت انتخاب طرح تامین‌کننده مالی دیگری را انتخاب کنید.',
      ctaLabel: 'متوجه شدم',
      imageType: 'error',
      secondaryCtaLabel: '',
    },
    [VOLUNTEER_STATE_TYPE.PENDING]: {
      title: 'پرونده اعتباری شما تشکیل شد.',
      description:
        'در حال حاضر شما در صف دریافت اعتبار قرار گرفته‌اید. تا چند روز آینده برای ادامه مراحل دریافت اعتبار شما را از طریق پیامک مطلع می‌کنیم.',
      ctaLabel: 'متوجه شدم',
      imageType: 'done',
      secondaryCtaLabel: '',
    },
    [VOLUNTEER_STATE_TYPE.REGISTERED]: {
      title: 'ثبت نام با موفقیت انجام شد.',
      description: 'با مراجعه مجدد به همین بخش، می توانید از وضعیت اعتبار خود اطلاع حاصل فرمایید.',
      ctaLabel: 'متوجه شدم',
      imageType: 'done',
      secondaryCtaLabel: '',
    },
  };

  constructor(
    private creditNavigationService: CreditNavigationService,
    private creditUrlService: CreditUrlService,
    private router: Router,
    @Inject('RouteStateInterface')
    private routeStateService: CreditRouteStateInterface,
  ) {
    const state = this.routeStateService.getAll();
    if (!state.showVolunteer) {
      this.creditNavigationService.closeService();
      return;
    }
    if (state.volunteerStateType) {
      this.volunteerTypeState.set(state.volunteerStateType);
    } else {
      this.volunteerTypeState.set(VOLUNTEER_STATE_TYPE.PENDING);
    }
    this.pageLoading.set(false);
  }

  closeService() {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve'));
  }
}
