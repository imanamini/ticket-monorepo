import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { AlertSizeEnum } from '../../../../../../data-access/enums/alert-size.enum';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { InsIconComponent } from '../../../../components/ins-icon/ins-icon.component';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { InsAlertComponent } from '../../../../../../components/ins-alert/ins-alert.component';
import { InsuredPartyModel } from '../../../../data-access/models/application-form/insured-party.model';
import { VehicleErrorCode } from '../../../../data-access/enums/vehicle-error-code.enum';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';
import { ThirdPartyMotorKeysEnum } from '../../data-access/enums/third-party-motor-keys.enum';

@Component({
  selector: 'motor-get-policy-method',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    InsIconComponent,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    PipesModule,
    NgxPlateComponent,
    InsIconComponent,
    ActionButtonsComponent,
    InsAlertComponent,
  ],
  templateUrl: './motor-get-policy-method.component.html',
  styleUrl: './motor-get-policy-method.component.scss'
})
export class MotorGetPolicyMethodComponent extends ThirdPartyMotorDirective implements OnInit {

  protected readonly IconEnum = IconEnum;
  protected readonly AlertSizeEnum = AlertSizeEnum;

  form = signal<FormGroup | null>(null);
  errorMessages = signal({
    pattern: 'لطفاً حروف انگلیسی وارد کنید.',
    email: 'آدرس پست الکترونیک وارد شده اشتباه است.',
    required: ''
  });
  plate = signal<string | null>(null);
  showError = signal<boolean>(false);

  @ViewChild('emailInput', {static: false}) emailInput!: ElementRef;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable()
      .subscribe({
        next: storeData => {
          if (!storeData) {
            return;
          }
          this.createFrom();
          this.form().patchValue({applicationFormId: this.storeService.getFormId()});
          this.plate.set(storeData.license ?? null);
          this.form().patchValue({email: storeData.insuredParty.email, isActiveEmail: !!storeData.insuredParty.email});
        }
      }));
  }

  private createFrom(): void {
    this.form.set(this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[^\u0600-\u06FF\s]+$/), Validators.email]],
      applicationFormId: ['', []],
      isActiveEmail: [false, []]
    }));
  }

  public onSave(): void {
    if (this.form().get('isActiveEmail').value && this.form().invalid) {
      this.showError.set(true);
      this.emailInput?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
      });
      return;
    }
    this.showError.set(false);
    const insuredParty: InsuredPartyModel = {
      insuredPartyDetail: structuredClone(this.storeService.getStoreData().insuredParty),
      requesterPartyDetail: {
        ...this.storeService.getStoreData().requesterParty,
        email: this.form().get('isActiveEmail').value ? this.form().get('email').value : ''
      },
      address: this.storeService.getStoreData().address,
      license: this.storeService.getStoreData().license
    };
    super.addSubscription(this.motorApiService.updateInsuredParty(
      insuredParty,
      this.storeService.getFormId()
    ).subscribe({
      next: response => {
        if (response.success) {
          this.storeService.setStoreData({
            ...this.storeService.getStoreData(),
            insuredParty: {
              ...this.storeService.getStoreData()?.insuredParty,
              email: this.form().get('isActiveEmail').value ? this.form().get('email').value : null
            }
          });
          this.onNext(THIRD_PARTY_MOTOR_ROUTE.CompleteOrder);
        } else {
          this.messageService.showErrorMessage('آدرس پست الکترونیک وارد شده اشتباه است.');
        }
      }
    }));
  }

  handleDeActiveButtonClicked(): void {
    this.onNext(THIRD_PARTY_MOTOR_ROUTE.UserAddress);
  }

  protected onClose(): void {
    this.closeService.closeWithCheckQueryParam();
  }

  protected onNext(route: string): void {
    this.router.navigate([route], {
      relativeTo: this.route.parent,
      queryParamsHandling: 'merge'
    });
  }
}
