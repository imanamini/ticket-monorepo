import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MotorUserInfoFormComponent } from './motor-user-info-form/motor-user-info-form.component';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { InsAlertComponent } from '../../../../../../components/ins-alert/ins-alert.component';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { AlertSizeEnum } from '../../../../../../data-access/enums/alert-size.enum';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';
import { UserInfoMotorModel } from '../../../../data-access/models/application-form/user-info.model';
import { InsuredPartyModel } from '../../../../data-access/models/application-form/insured-party.model';
import { ApplicationFormMotorModel } from '../../data-access/models/application-form-motor-response.model';
import { THIRD_PARTY_MOTOR_ROUTES } from '../../data-access/constants/third-party-motor-routes.const';
import { RetryErrorComponent } from '../../../error/retry-error/retry-error.component';

@Component({
  selector: 'motor-user-info',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    MotorUserInfoFormComponent,
    InsAlertComponent,
    RetryErrorComponent,
  ],
  templateUrl: './motor-user-info.component.html',
  styleUrl: './motor-user-info.component.scss'
})
export class MotorUserInfoComponent extends ThirdPartyMotorDirective implements OnInit {
  private untypedFormBuilder = inject(UntypedFormBuilder);

  protected readonly IconEnum = IconEnum;
  protected readonly AlertSizeEnum = AlertSizeEnum;
  protected readonly THIRD_PARTY_MOTOR_ROUTES = THIRD_PARTY_MOTOR_ROUTES;

  userInfoForm = signal<UntypedFormGroup>(this.untypedFormBuilder.group({}));
  showError = signal<boolean>(false);
  userInfo = signal<UserInfoMotorModel | null>(null);
  hasRetry = signal<boolean>(false);
  private elementRef = inject(ElementRef<HTMLElement>);

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: response => {
        if (!response) {
          return;
        }
        this.hasRetry.set(false);
        this.userInfo.set({...response.insuredParty, license: response.license} as UserInfoMotorModel);
      },
      error: () => {
        this.hasRetry.set(true);
      }
    }));
  }

  scrollToInvalidField(): void {
    this.scrollToElement(this.getInvalidClass());
  }

  scrollToElement(className: string): void {
    this.elementRef.nativeElement.getElementsByClassName(className)[0]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  getInvalidClass(): string {
    const controls: string[] = Object.keys(this.userInfoForm().controls);
    for (let i = 0; i < controls.length; i++) {
      const control = this.userInfoForm().get(controls[i]);
      if (control.invalid) {
        return controls[i];
      }
    }
    return 'plate';
  }

  handleActiveButtonClick(): void {
    this.showError.set(false);
    if (this.userInfoForm().invalid) {
      setTimeout(() => this.showError.set(true), 0);
      this.scrollToInvalidField();
      return;
    }
    const model: InsuredPartyModel = {
      ...this.storeService.getStoreData(),
      insuredPartyDetail: {
        firstName: this.userInfoForm().controls.firstName.value,
        lastName: this.userInfoForm().controls.lastName.value,
        birthDate: this.userInfoForm().controls.birthDate.value,
        nationalCode: this.userInfoForm().controls.nationalCode.value,
        mobile: this.userInfoForm().controls.mobile.value,
        email: null
      },
      requesterPartyDetail: {
        email: null,
        birthDate: null,
        firstName: null,
        lastName: null,
        mobile: null,
        nationalCode: null
      },
      license: this.userInfoForm().controls.license.value
    };
    super.addSubscription(this.motorApiService.updateInsuredParty(model, this.storeService.getFormId()).subscribe({
      next: res => {
        if (res.success) {
          const newStoreData: ApplicationFormMotorModel = {
            ...this.storeService.getStoreData(),
            insuredParty: model.insuredPartyDetail,
            requesterParty: model.requesterPartyDetail,
            license: model.license,
          };
          this.storeService.setStoreData(newStoreData);
          this.onNext(THIRD_PARTY_MOTOR_ROUTE.UploadDocument);
        }
      },
    }));
  }

  handleDeActiveButtonClicked(): void {
    this.location.back();
  }

  protected onClose(): void {
    this.closeService.closeWithCheckQueryParam();
  }

  protected onNext(route: string): void {
    this.router.navigate([route], {
      relativeTo: this.route.parent,
      queryParamsHandling: 'merge'
    }).then();
  }

}
