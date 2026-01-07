import { Component, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InsRadioButtonComponent } from '../../../../components/ins-radio-button/ins-radio-button.component';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { InsRadioButtonItemModel } from '../../../../data-access/models/ins-radio-button-item.model';

@Component({
  selector: 'claim-form',
  standalone: true,
  imports: [
    InsRadioButtonComponent
  ],
  templateUrl: './claim-form.component.html',
  styleUrl: './claim-form.component.scss'
})
export class ClaimFormComponent extends ThirdPartyMotorDirective implements OnInit {
  claimForm = input.required<FormGroup>();
  showError = input<boolean>(false);
  protected items = signal<InsRadioButtonItemModel[]>([
    {
      title: 'بله، گرفته‌ام',
      value: 1
    },
    {
      title: 'خیر، نگرفته‌ام',
      value: 0
    }
  ]);

  ngOnInit(): void {
    this.setFormControls();
    this.getDataFromUrl();
  }

  private getDataFromUrl(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: (value) => {
        const isEmpty =
          value?.previousInsuranceDetail?.propertyDamageId == null &&
          value?.previousInsuranceDetail?.healthDamageId == null &&
          value?.previousInsuranceDetail?.driverDamageId == null;
        if (isEmpty) {
          return;
        }
        const hasPropertyDamage = value?.previousInsuranceDetail?.propertyDamageId !== this.constantAllService.propertyDamageDefaultValue();
        const hasHealthDamage = value?.previousInsuranceDetail?.healthDamageId !== this.constantAllService.healthDamageDefaultValue();
        const hasDriverDamage = value?.previousInsuranceDetail?.driverDamageId !== this.constantAllService.driverDamageDefaultValue();
        const hasClaim = hasPropertyDamage || hasHealthDamage || hasDriverDamage;
        this.claimForm()?.controls?.claim?.setValue(hasClaim ? 1 : 0);
      }
    }));
  }

  private setFormControls(): void {
    this.claimForm()?.setControl('claim', new FormControl({
      value: null,
      disabled: false
    }, [Validators.required]));
  }

  protected handleValueChange(e: number | null): void {
    this.claimForm()?.controls.claim?.setValue(e);
  }

  protected onClose(): void {
  }

  protected onNext(route: string): void {
  }
}
