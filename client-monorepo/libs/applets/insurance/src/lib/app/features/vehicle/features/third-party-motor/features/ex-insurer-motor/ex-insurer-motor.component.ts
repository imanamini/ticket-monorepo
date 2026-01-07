import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { ExInsurerMotorFormComponent } from '../../components/ex-insurer-motor-form/ex-insurer-motor-form.component';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';
import { ExtraInsurerForm } from '../../../../data-access/enums/extra-insurance-company-items.enum';
import { MotorInfoBoxComponent } from '../../components/motor-info-box/motor-info-box.component';
import { ApplicationFormMotorPutRequestModel } from '../../data-access/models/application-form-motor-put-request.model';
import moment from 'jalali-moment';

@Component({
  selector: 'ex-insurer-motor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MotorInfoBoxComponent,
    ExInsurerMotorFormComponent,
    MotorInfoBoxComponent
  ],
  templateUrl: './ex-insurer-motor.component.html',
  styleUrl: './ex-insurer-motor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExInsurerMotorComponent extends ThirdPartyMotorDirective implements OnInit {
  private untypedFormBuilder = inject(UntypedFormBuilder);

  protected showError = signal(false);
  exInsurerMotorForm = signal(this.untypedFormBuilder.group({}));

  onSubmit(): void {
    if (!this.exInsurerMotorForm().valid) {
      this.showError.set(true);
      return;
    }
    this.showError.set(false);
    const model: ApplicationFormMotorPutRequestModel = this.storeService.getStoreValueAsPutRequest();
    if (model) {
      model.vehicleInfo.releaseDate = this.exInsurerMotorForm().controls?.releaseDate?.value;
      model.previousInsuranceDetail.insurerParty.insurerPartyId = this.exInsurerMotorForm().controls?.name?.value;
    }
    const hasExtraInsurer =
      (model.previousInsuranceDetail.insurerParty.insurerPartyId === ExtraInsurerForm.NoInsurance) ||
      (model.previousInsuranceDetail.insurerParty.insurerPartyId === ExtraInsurerForm.NewCar);

    if (hasExtraInsurer) {
      if (model.previousInsuranceDetail.insurerParty.insurerPartyId === ExtraInsurerForm.NoInsurance) {
        model.vehicleInfo.releaseDate = null;
      } else if (model.previousInsuranceDetail.insurerParty.insurerPartyId === ExtraInsurerForm.NewCar) {
        model.vehicleInfo.releaseDate = moment(this.exInsurerMotorForm()?.controls?.releaseDate?.value).format('YYYY/MM/DD');
      }
      model.previousInsuranceDetail.insurerParty.insurerPartyId = null;
    }
    super.addSubscription(this.motorApiService.putApplicationForm(model as ApplicationFormMotorPutRequestModel).subscribe({
      next: res => {
        this.storeService.setStoreData(res.result);
        if (hasExtraInsurer) {
          this.onNext(THIRD_PARTY_MOTOR_ROUTE.PriceCardList);
        } else {
          this.onNext(THIRD_PARTY_MOTOR_ROUTE.ExInsurerMotorDate);
        }
      }
    }));
  }

  protected onNext(route: string): void {
    this.router.navigate([route], {
      relativeTo: this.activatedRoute.parent,
      queryParamsHandling: 'merge'
    }).then();
  }

  protected override onClose(): void {
    this.closeService.close();
  }

  public handleDeActiveButtonClicked(): void {
    this.location.back();
  }
}
