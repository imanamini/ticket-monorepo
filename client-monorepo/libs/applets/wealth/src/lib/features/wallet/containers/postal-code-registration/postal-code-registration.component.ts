import { NgxIcon } from '@digipay/ngx-icon';
import { NgxAlert } from '@digipay/ngx-alert';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { AppBarWrapperComponent } from '../../../../components/core/components/app-bar-wrapper/app-bar-wrapper.component';

import { RouteStateService } from '@client-monorepo/common/utilities';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { IUserActivity } from '../../../../shared/services/activities/models/user-activities.interface';
import { UserActivitiesService } from '../../../../shared/services/activities/user-activities.service';
import { IWalletBnplStateData } from '../../models/wallet-bnpl-state.interface';
import { WalletService } from '../../services/wallet.service';
import { WALLET_COORDINATOR_PROCESS_API, WALLET_DEPOSIT_PROCESS_API } from '../../../../data-access/constants/api';
import { IWalletProcessData } from '../../models/wallet-process.interface';

@Component({
  selector: 'wealth-applet-postal-code-registration',
  standalone: true,
  imports: [CommonModule, AppBarWrapperComponent, NgxIcon, NgxAlert, NgxButtonComponent],
  templateUrl: './postal-code-registration.component.html',
  styleUrls: ['./postal-code-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostalCodeRegistrationComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private walletId = signal<string | undefined>(undefined);
  private navigationService = inject(WealthNavigationService);
  private state = signal<IWalletBnplStateData | undefined>(undefined);
  private routeState = inject(RouteStateService);
  private walletService = inject(WalletService);
  alertText = signal<string | undefined>('با ورود به سامانه می‌توانید کد پستی‌های ثبت شده خود را مشاهده و یا کد پستی جدید ثبت کنید.');

  retrying = signal<boolean>(false);
  actionHandler = inject(ActionHandlerService);

  continueButtonText = computed(() => (this.retrying() ? 'ادامه فرایند' : 'تغییر کد پستی'));

  description = computed<string>(() =>
    this.retrying()
      ? 'برای نهایی شدن سرمایه‌گذاری و دریافت سود٬ کد پستی خود را در سامانه ثبت کنید و سپس  در صفحه اول کیف ثروت، دکمه «در سامانه ثبت کرده‌ام» را بزنید. در غیر این صورت به مبلغ واریز شده سود تعلق نمی‌گیرد.'
      : 'برای سرمایه‌گذاری و دریافت سود، ابتدا از ثبت شدن کد پستی خود در سامانه املاک و اسکان مطمئن شوید. اگر قبلا این کار را انجام دادید ساعاتی بعد دوباره تلاش کنید.',
  );
  private userActivitiesService = inject(UserActivitiesService);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.retrying.set(this.activatedRoute.snapshot.queryParamMap.get('retrying') === 'true');
    if (!this.state().terms) {
      this.onBackHandler();
    }

    const activity: IUserActivity = {
      eventId: this.retrying() ? 'WW_CR_PostalCode2' : 'WW_PostalCode1',
      payloads: {},
    };
    this.userActivitiesService.action(activity).subscribe();
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }

  onContinue() {
    const activity: IUserActivity = {
      eventId: this.retrying() ? 'WW_PostalCode2_Confirm' : 'WW_PostalCode1_Confirm',
      payloads: {},
    };
    this.userActivitiesService.action(activity).subscribe();

    if (this.retrying()) {
      this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
      return;
    }

    const processData: IWalletProcessData = {
      action: 'start_journey',
      data: {
        walletName: this.state().walletName || '',
        walletId: this.walletId(),
        skipPostalCodeVerification: true,
        terms: this.state().terms,
      },
    };

    const api = this.state().terms === 'deposit_terms' ? WALLET_DEPOSIT_PROCESS_API : WALLET_COORDINATOR_PROCESS_API;
    this.walletService.walletProcess(api, processData).subscribe();
  }

  registerPostalCode() {
    const activity: IUserActivity = {
      eventId: this.retrying() ? 'WW_PostalCode2_Amlak' : 'WW_PostalCode1_Amlak',
      payloads: {},
    };
    this.userActivitiesService.action(activity).subscribe();
    this.actionHandler.handle({
      type: ActionType.REDIRECT,
      payload: {
        url: 'https://amlak.mrud.ir/',
      },
    });
  }
}
