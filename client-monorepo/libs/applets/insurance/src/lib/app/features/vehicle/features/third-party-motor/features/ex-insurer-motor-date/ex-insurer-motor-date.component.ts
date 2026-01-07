import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

import { MotorInfoBoxComponent } from '../../components/motor-info-box/motor-info-box.component';
import {
  ExInsurerMotorDateFormComponent
} from '../../components/ex-insurer-motor-date-form/ex-insurer-motor-date-form.component';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { ThirdPartyMotorKeysEnum } from '../../data-access/enums/third-party-motor-keys.enum';
import { ApplicationFormMotorPutRequestModel } from '../../data-access/models/application-form-motor-put-request.model';

@Component({
  selector: 'ex-insurer-motor-date',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MotorInfoBoxComponent,
    ExInsurerMotorDateFormComponent
  ],
  templateUrl: './ex-insurer-motor-date.component.html',
  styleUrl: './ex-insurer-motor-date.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExInsurerMotorDateComponent extends ThirdPartyMotorDirective implements OnInit {
  private untypedFormBuilder = inject(UntypedFormBuilder);

  showError = signal<boolean>(false);
  dateForm = signal(this.untypedFormBuilder.group({}));

  onSubmit(): void {
    if (!this.dateForm().valid) {
      this.showError.set(true);
      return;
    }
    this.showError.set(false);
    const model: ApplicationFormMotorPutRequestModel = this.storeService.getStoreValueAsPutRequest();
    if (model) {
      model.previousInsuranceDetail.endsAt = this.dateForm().controls.end.value;
      model.previousInsuranceDetail.startsAt = this.dateForm().controls.start.value;
    }

    super.addSubscription(this.motorApiService.putApplicationForm(model as ApplicationFormMotorPutRequestModel).subscribe({
      next: res => {
        this.storeService.setStoreData(res.result);
        this.onNext(THIRD_PARTY_MOTOR_ROUTE.ExInsurerMotorInfo);
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
