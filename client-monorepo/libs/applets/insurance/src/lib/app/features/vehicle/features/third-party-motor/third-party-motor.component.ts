import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InsuranceHeaderComponent } from '../../../../components/insurance-header/insurance-header.component';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { ActivatedRoute, NavigationEnd, NavigationStart, RouterOutlet } from '@angular/router';
import { ThirdPartyStepperComponent } from '../third-party/components/third-party-stepper/third-party-stepper.component';
import { filter } from 'rxjs/operators';
import { ThirdPartyMotorDirective } from './directives/third-party-motor.directive';
import { ThirdPartyMotorKeysEnum } from './data-access/enums/third-party-motor-keys.enum';
import { PRODUCT_TYPE_BASE_URL } from '../../../../data-access/constants/product-type-base-url.constant';
import { InsuranceProductTypeEnum } from '../../../../data-access/enums/Insurance-product-type.enum';
import { InsDigikalaService } from '../../../../data-access/services/ins-digikala.service';

@Component({
  selector: 'third-party-motor',
  standalone: true,
  imports: [InsuranceHeaderComponent, NgxSpinnerModule, RouterOutlet, ThirdPartyStepperComponent],
  templateUrl: './third-party-motor.component.html',
  styleUrl: './third-party-motor.component.scss',
})
export class ThirdPartyMotorComponent extends ThirdPartyMotorDirective implements OnInit, OnDestroy {
  private readonly digikalaService = inject(InsDigikalaService);
  protected stepperConfig = {
    title: 'مشخصات',
    stepName: 'مرحله اول',
    currentStep: 1,
    totalSteps: 3,
    backgroundGray: true,
    isShowHeader: true,
    isShowStepper: true,
  };

  ngOnInit(): void {
    super.addSubscription(
      this.queryParamService.getQueryParams([ThirdPartyMotorKeysEnum.FormId, ThirdPartyMotorKeysEnum.ProviderId], false).subscribe({
        next: (param) => {
          if (param[ThirdPartyMotorKeysEnum.FormId]) {
            this.storeService.setFormId(param[ThirdPartyMotorKeysEnum.FormId]);
            this.storeService.loadUnauthorizedApplicationData();
          } else if (param[ThirdPartyMotorKeysEnum.ProviderId]) {
            return;
          } else {
            this.router
              .navigate([PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdPartyMotor]], {
                skipLocationChange: true,
              })
              .then((z) => this.createNewApplicationForm());
          }
        },
      }),
    );
    super.addSubscription(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd || event instanceof NavigationStart))
        .subscribe((event: NavigationEnd | NavigationStart) => {
          if (event instanceof NavigationEnd) {
            this.updateStepperConfig(this.getActiveChildRoute(this.activatedRoute));
          } else if (event instanceof NavigationStart) {
            if (this.queryParamService.containsQueryParams([ThirdPartyMotorKeysEnum.FormId])) {
              this.storeService.loadUnauthorizedApplicationData();
            }
          }
        }),
    );
    this.updateStepperConfig(this.getActiveChildRoute(this.activatedRoute));
  }

  private getActiveChildRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  private updateStepperConfig(route: ActivatedRoute): void {
    const stepperData = route.snapshot.data.stepper;
    if (stepperData) {
      if (this.digikalaService.isDigikala) {
        stepperData.isShowHeader = true;
      }
      this.stepperConfig = { ...this.stepperConfig, ...stepperData };
    }
  }

  protected onNext(route: string): void {
    this.router
      .navigate([route], {
        relativeTo: this.activatedRoute.parent,
      })
      .then();
  }

  protected onClose(): void {
    this.closeService.close();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.storeService.clearStore();
  }
}
