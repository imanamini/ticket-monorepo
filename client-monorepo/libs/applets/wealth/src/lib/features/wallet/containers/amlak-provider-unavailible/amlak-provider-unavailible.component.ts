import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { IWalletBnplStateData } from '../../models/wallet-bnpl-state.interface';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { UserActivitiesService } from '../../../../shared/services/activities/user-activities.service';
import { IUserActivity } from '../../../../shared/services/activities/models/user-activities.interface';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAlert } from '@digipay/ngx-alert';
import { AppBarWrapperComponent } from '../../../../components/core/components/app-bar-wrapper/app-bar-wrapper.component';
import { WALLET_COORDINATOR_PROCESS_API, WALLET_DEPOSIT_PROCESS_API } from '../../../../data-access/constants/api';
import { WalletService } from '../../services/wallet.service';
import { IWalletProcessData } from '../../models/wallet-process.interface';

@Component({
  selector: 'wealth-applet-amlak-provider-unavailible',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxAlert, AppBarWrapperComponent],
  templateUrl: './amlak-provider-unavailible.component.html',
  styleUrl: './amlak-provider-unavailible.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmlakProviderUnavailibleComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private walletId = signal<string | undefined>(undefined);
  private navigationService = inject(WealthNavigationService);
  private state = signal<IWalletBnplStateData | undefined>(undefined);
  private routeState = inject(RouteStateService);
  private walletService = inject(WalletService);

  alertText = signal<string | undefined>('با ورود به سامانه می‌توانید کد پستی‌های ثبت شده خود را مشاهده و یا کد پستی جدید ثبت کنید.');

  actionHandler = inject(ActionHandlerService);

  description = signal<string>('لطفا دقایقی بعد دوباره تلاش کنید.');
  private userActivitiesService = inject(UserActivitiesService);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));

    const activity: IUserActivity = {
      eventId: 'WW_CR_PostalCode3',
      payloads: {},
    };
    this.userActivitiesService.action(activity).subscribe();
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }

  onContinue() {
    const activity: IUserActivity = {
      eventId: 'WW_PostalCode3_Continiue',
      payloads: {},
    };
    this.userActivitiesService.action(activity).subscribe();

    const processData: IWalletProcessData = {
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
      eventId: 'WW_PostalCode3_Amlak',
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
