import { Component, inject, OnInit, signal } from '@angular/core';
import { FullScreenLoadingComponent } from '../../../../../../components/full-screen-loading/full-screen-loading.component';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { ThirdPartyMotorKeysEnum } from '../../data-access/enums/third-party-motor-keys.enum';
import { EmptyResultComponent } from '../../../../../../components/empty-result/empty-result.component';
import { LoginService } from '../../../../../../data-access/services/user-services/login.service';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';
import { InsDigikalaService } from '../../../../../../data-access/services/ins-digikala.service';

@Component({
  selector: 'go-to-checkout',
  standalone: true,
  imports: [FullScreenLoadingComponent, EmptyResultComponent],
  templateUrl: './go-to-checkout.component.html',
  styleUrl: './go-to-checkout.component.scss',
})
export class GoToCheckoutComponent extends ThirdPartyMotorDirective implements OnInit {
  private loginService = inject(LoginService);
  private digikalaService = inject(InsDigikalaService);
  isLoggedIn = signal(this.loginService.isLoggedIn);
  isLoading = signal(true);

  ngOnInit(): void {
    if (this.digikalaService.isDigikala) {
      this.checkLogin();
    } else {
      this.selectPlpCard();
    }
  }

  private checkLogin(): void {
    if (this.isLoggedIn()) {
      this.selectPlpCard();
    } else {
      this.isLoading.set(false);
    }
  }

  private selectPlpCard(): void {
    const params = this.route.snapshot.queryParams;
    if (params[ThirdPartyMotorKeysEnum.FormId] && params[ThirdPartyMotorKeysEnum.InsuranceCompanyId]) {
      super.addSubscription(
        this.motorApiService
          .createApplicationFormDraft(params[ThirdPartyMotorKeysEnum.FormId], params[ThirdPartyMotorKeysEnum.InsuranceCompanyId])
          .subscribe({
            next: (response) => {
              if (response?.success) {
                this.router
                  .navigate([THIRD_PARTY_MOTOR_ROUTE.Checkout], {
                    relativeTo: this.activatedRoute.parent,
                    queryParamsHandling: 'merge',
                    replaceUrl: true,
                    skipLocationChange: false,
                  })
                  .then(() => {
                    this.isLoading.set(false);
                  });
              }
            },
          }),
      );
    }
  }

  public handleLoginClicked(): void {
    // this.digikalaService
    //   .webDigikala
    //   .initialLoginDigiPayToDigikala()
    //   .then(() => {})
    //   .catch((error) => {
    //     if (this.digikalaService.checkHasErrorIdpPinCode(error)) {
    //       return;
    //     }
    //     this.loginService.routeToLoginPage();
    //   });
  }

  protected onClose(): void {}

  protected onNext(route: string): void {}
}
