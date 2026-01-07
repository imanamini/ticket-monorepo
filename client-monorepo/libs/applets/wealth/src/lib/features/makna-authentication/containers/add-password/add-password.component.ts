import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PasswordComplexityComponent } from '../../components/password-complexity/password-complexity.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { MaknaAuthenticationService } from '../../services/makna-authentication.service';
import { takeUntil } from 'rxjs';
import { IAddPasswordRouteState } from './models/add-password-route-state.interface';

import { MaknaHeaderComponent } from '../../../../shared/components/makna-header/makna-header.component';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { PasswordComplexityOutput } from '../../../../data-access/models/password-complexity-output.model';
import { CHOICE_PAYMENT_METHOD_ROUTE, PURCHASE_ROUTE } from '../../../../data-access/constants/app-routes';
import { ErrorCodes } from '../../../../data-access/enums/error-codes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';

@Component({
  selector: 'app-add-password',
  standalone: true,
  imports: [NgxButtonComponent, MaknaHeaderComponent, PasswordComplexityComponent, NgxCountDownComponent],
  templateUrl: './add-password.component.html',
  styleUrl: './add-password.component.scss',
})
export class AddPasswordComponent extends BaseComponent implements OnInit {
  loading = false;
  state: IAddPasswordRouteState;
  password: PasswordComplexityOutput;
  passwordRepeat: PasswordComplexityOutput;
  rateLimit = false;
  timeIsOver: boolean;
  otpSeconds = 120;
  navigationService = inject(WealthNavigationService);
  routeState = inject(RouteStateService);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  private maknaAuthenticationService = inject(MaknaAuthenticationService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.state = this.routeState.getAll() as IAddPasswordRouteState;
  }

  onPasswordChanged(password: PasswordComplexityOutput) {
    this.password = password;
  }

  onRepeatPasswordChanged(password: PasswordComplexityOutput) {
    this.passwordRepeat = password;
  }

  timerFinish() {
    this.timeIsOver = true;
    this.rateLimit = false;
  }

  onNextStep() {
    this.loading = true;
    if (this.password.value !== this.passwordRepeat.value) {
      this.messageService.showErrorMessage('رمز عبور و تکرار آن برابر نیستند');
      this.loading = false;
    } else {
      this.maknaAuthenticationService
        .addPassword(this.password.value)
        .pipe(takeUntil(this.destroyObservable))
        .subscribe((res) => {
          if (res?.success) {
            this.messageService.showSuccessMessage('رمز عبور با موفقیت تغییر کرد.');
            const query = this.state.investmentType === 'CrowdFund' || this.state.type === 'CrowdFund' ? { crowdFunding: 'true' } : null;
            this.navigationService.navigate([PURCHASE_ROUTE, this.state.symbol], {
              queryParams: query,
              state: {
                ...this.state,
                callShowDetail: true,
              },
            });
          } else if (res && res.error && (res.error.code == ErrorCodes.RateLimited || res.error.code == ErrorCodes.UserIsLockedOut)) {
            this.rateLimit = true;
            this.reInitializeTimer(300);
            this.messageService.showErrorMessage('درخواست شما بیش از حد مجاز است. لطفا دقایقی صبر کنید.');
          } else {
            if (res && res.error && res.error.title) {
              this.messageService.showErrorMessage(res.error.title);
            }
          }

          this.loading = false;
        });
    }
  }

  reInitializeTimer(sec) {
    this.timeIsOver = true;
    setTimeout(() => {
      this.timeIsOver = false;
      this.otpSeconds = sec;
      this.cdr.detectChanges();
    }, 0);
  }

  onBackClick() {
    if (this.state.type === 'IPO') {
      this.navigationService.navigate([CHOICE_PAYMENT_METHOD_ROUTE, this.state.symbol], {
        state: this.state,
      });
    } else if (this.state.investmentType === 'CrowdFund' || this.state.type === 'CrowdFund') {
      this.navigationService.navigate([PURCHASE_ROUTE, this.state.symbol], {
        queryParams: {
          crowdFunding: true,
        },
        state: { ...this.state, callShowDetail: true },
      });
    } else {
      this.navigationService.navigate([PURCHASE_ROUTE, this.state.symbol], {
        state: { ...this.state, callShowDetail: true },
      });
    }
  }
}
