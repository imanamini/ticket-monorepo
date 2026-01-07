import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { take, catchError, throwError } from 'rxjs';
import { IWallet } from '../../models/wallet.interface';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { MessageService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLET_BNPL_ROUTE } from '../../../../data-access/constants/app-routes';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { IUserActivity } from '../../../../shared/services/activities/models/user-activities.interface';
import { UserActivitiesService } from '../../../../shared/services/activities/user-activities.service';

@Component({
  selector: 'wealth-applet-wallet-registration-details',
  standalone: true,
  imports: [CommonModule, NgxIcon, NgxButtonComponent],
  templateUrl: './wallet-registration-details.component.html',
  styleUrl: './wallet-registration-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletRegistrationDetailsComponent {
  wallet = input.required<IWallet>();
  checkingPostalCode = signal<boolean>(false);
  private messageService = inject(MessageService);
  private customerService = inject(CustomerService);
  private navigationService = inject(WealthNavigationService);
  private userActivitiesService = inject(UserActivitiesService);

  getWalletInfo = output();

  registerPostalCode() {
    const activity: IUserActivity = {
      eventId: 'WW_PCalert_Retry',
      payloads: {},
    };
    this.userActivitiesService.action(activity).subscribe();
    this.checkingPostalCode.set(true);
    this.customerService
      .verifyPostalCode(this.wallet().postalCode)
      .pipe(
        take(1),
        catchError((err) => {
          this.checkingPostalCode.set(false);
          return throwError(err);
        }),
      )
      .subscribe((res) => {
        if (res.result.status === 'Verified') {
          this.messageService.showSuccessMessage(res.result.title);
          this.wallet().completeRegistrationHint = 'None';
          // this.getWallet();
          this.getWalletInfo.emit();
        } else {
          this.messageService.showErrorMessage(
            res?.result?.title || res?.error?.title,
            res?.result?.description || res?.error?.description,
          );
        }
        this.checkingPostalCode.set(false);
      });
  }

  editPostalCode() {
    const activity: IUserActivity = {
      eventId: 'WW_PCalert_Change',
      payloads: {},
    };
    this.userActivitiesService.action(activity).subscribe();
    this.navigationService.navigate([WALLET_BNPL_ROUTE, this.wallet().walletName.toLowerCase()], {
      queryParams: {
        retrying: 'true',
      },
      state: this.wallet(),
    });
  }

  navigateToRealEstateSystem() {
    const activity: IUserActivity = {
      eventId: 'WW_PCalert_Amlak',
      payloads: {},
    };
    this.userActivitiesService.action(activity).subscribe();
    window.open('https://amlak.mrud.ir/', '_blank');
  }
}
