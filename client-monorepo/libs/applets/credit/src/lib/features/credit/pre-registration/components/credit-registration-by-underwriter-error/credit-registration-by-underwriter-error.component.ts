import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditNavigationService } from '../../../data-access/services/credit-navigation.service';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-registration-by-underwriter-error',
  templateUrl: './credit-registration-by-underwriter-error.component.html',
  styleUrls: ['./credit-registration-by-underwriter-error.component.scss'],
  imports: [NgxStatusResultModule, CreditScrollableViewComponent, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditRegistrationByUnderwriterErrorComponent implements OnInit {
  type = input<'NOT_FOUND' | 'NO_PLAN'>();
  isIndividuallyPlan = false;
  pageTitle!: string;
  title!: string;
  dataMapper = {
    NOT_FOUND: {
      pageTitle: 'بررسی حساب سازمانی',
      title: 'مشخصات شما در سامانه نیست.',
      description: 'کاربری با این کد ملی در لیست سازمانی وجود ندارد. لطفا اطلاعات خود را بررسی و اصلاح کنید.',
      ctaLabel: 'بررسی اطلاعات',
      imageType: 'warning',
      secondaryCtaLabel: '',
    },
    NO_PLAN: {
      pageTitle: 'بررسی حساب سازمانی',
      title: 'پر شدن سقف توان بازپرداخت',
      description: 'سقف بازپرداخت ماهانه شما با دریافت وام دیگری پر شده است و امکان دریافت وام سازمانی را ندارید.',
      ctaLabel: 'متوجه شدم',
      imageType: 'warning',
      secondaryCtaLabel: '',
    },
  };
  buttons = signal<Buttons[]>([]);
  close = output();
  fillForm = output();

  private creditNavigationService = inject(CreditNavigationService);
  private creditService = inject(CreditApiService);
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);
  private destroyRef = inject(DestroyRef);
  private destroyed = false;

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });

    this.creditService.getPlanGroups().subscribe((response) => {
      if (response && response.planGroupDetails && response.planGroupDetails.length > 0) {
        this.isIndividuallyPlan = true;
        this.dataMapper.NOT_FOUND.secondaryCtaLabel = 'انتخاب طرح غیر سازمانی';
        this.dataMapper.NOT_FOUND.description =
          'کاربری با این کد ملی در لیست سازمانی وجود ندارد. لطفا اطلاعات خود را بررسی و اصلاح کنید یا از طرح های غیر سازمانی استفاده کنید.';
        if (this.type() === 'NO_PLAN') {
          this.dataMapper.NO_PLAN.ctaLabel = 'انتخاب طرح غیر سازمانی';
          this.dataMapper.NO_PLAN.description =
            'سقف بازپرداخت ماهانه شما با دریافت وام دیگری پر شده است و امکان دریافت وام سازمانی را ندارید. می‌توانید به صفحه طرح‌های اعتباری بروید و طرحی با ضمانت چک یا سفته الکترونیک انتخاب کنید.';
        }
      }
      this.generateButtons();
    });
  }

  generateButtons() {
    if (this.dataMapper[this.type()!].ctaLabel) {
      this.buttons.update((buttons) => [
        ...buttons,
        {
          id: this.dataMapper[this.type()!].ctaLabel,
          label: this.dataMapper[this.type()!].ctaLabel,
          style: 'tinted-on-elevated',
          mode: 'form',
        },
      ]);
    }
    if (this.dataMapper[this.type()!].secondaryCtaLabel) {
      this.buttons.update((buttons) => [
        ...buttons,
        {
          id: this.dataMapper[this.type()!].secondaryCtaLabel,
          label: this.dataMapper[this.type()!].secondaryCtaLabel,
          style: 'link',
          mode: 'form',
        },
      ]);
    }
  }

  onButtonClick(id: string) {
    if (id === this.dataMapper[this.type()!].ctaLabel) {
      this.onCtaClick();
    }
    if (id === this.dataMapper[this.type()!].secondaryCtaLabel) {
      this.onSecondCtaClick();
    }
  }

  onCtaClick() {
    if (this.type() === 'NO_PLAN' && !this.isIndividuallyPlan) {
      this.creditNavigationService.closeService();
    } else if (this.type() === 'NO_PLAN' && this.isIndividuallyPlan) {
      this.goToSelectPlan();
    } else {
      if (!this.destroyed) {
        this.fillForm.emit();
      }
    }
  }

  goToSelectPlan(): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/select-plan`)).then();
  }

  onSecondCtaClick() {
    this.goToSelectPlan();
  }

  onClose() {
    this.creditNavigationService.closeService();
  }
}
