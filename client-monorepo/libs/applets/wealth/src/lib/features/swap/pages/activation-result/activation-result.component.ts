import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ActivatedRoute } from '@angular/router';
import { EWalletActivation } from '../../models';

@Component({
  selector: 'wealth-applet-activation-result',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, NgxIcon, NgxButtonComponent],
  templateUrl: './activation-result.component.html',
  styleUrl: './activation-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivationResultComponent implements OnInit {
  private navigationService = inject(WealthNavigationService);
  private walletId = signal<string | undefined>(undefined);
  private activatedRoute = inject(ActivatedRoute);
  activationState = signal<EWalletActivation | undefined>(undefined);

  readonly EWalletActivation = EWalletActivation;
  activationTitle = computed(() => {
    return this.activationState() === EWalletActivation.Active ? 'طرح شما فعال شد' : 'در حال فعال‌سازی...';
  });
  activationDescription = computed(() => {
    return this.activationState() === EWalletActivation.Active
      ? 'اکنون می‌توانید فرایند تبدیل دارایی خود را انجام دهید.'
      : ' می‌توانید وضعیت فعال‌سازی طرح را در صفحه تبدیل دارایی مشاهده کنید.';
  });

  ngOnInit(): void {
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.activationState.set(EWalletActivation[this.activatedRoute.snapshot.queryParamMap.get('state')] || EWalletActivation.Active);
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }
}
