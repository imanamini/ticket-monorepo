import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';
import moment from 'jalali-moment';
import { ApplicationFormMotorPutRequestModel } from '../../data-access/models/application-form-motor-put-request.model';
import { MotorInfoFormComponent } from '../../components/motor-info-form/motor-info-form.component';

@Component({
  selector: 'model-motorcycle',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    ActionButtonsComponent,
    MotorInfoFormComponent
  ],
  templateUrl: './model-motorcycle.component.html',
  styleUrls: [
    '../../third-party-motor.component.scss',
    './model-motorcycle.component.scss']
})
export class ModelMotorcycleComponent extends ThirdPartyMotorDirective implements OnInit {
  modelMotorCycleForm = signal<FormGroup>(new FormGroup({
    model: new FormControl(null, [Validators.required]),
    buildYear: new FormControl(null, [Validators.required]),
  }));
  showError = signal<boolean>(false);
  private constantAllServices = inject(ConstantAllService);
  public modelMotorcycleTypes = signal<Array<FormFieldOption>>([]);
  public yearList = computed(
    () => {
      const currentYear = new Date().getFullYear();
      const years: Array<FormFieldOption> = [];
      let persianYear: number = moment(new Date())
        .locale('fa')
        .format('YYYY') as unknown as number;
      for (let year = currentYear; year > 2000; year--) {
        years.push({
          title: `${persianYear} (${year.toString()} میلادی)`,
          value: +persianYear
        });
        persianYear--;
      }
      return years;
    }
  );

  override ngOnInit(): void {
    super.ngOnInit();
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe(z => {
      if (z?.vehicleInfo) {
        this.modelMotorCycleForm().patchValue({
          model: z.vehicleInfo.typeId ? +z.vehicleInfo.typeId : null,
          buildYear: z.vehicleInfo.buildYear ? +z.vehicleInfo.buildYear : null,
        });
      }
    }));
    this.getTypes();
  }

  getTypes(): void {
    super.addSubscription(this.constantAllServices.getMotorTypes().subscribe({
      next: value => {
        if (!value) {
          return;
        }
        this.modelMotorcycleTypes.set(value.map(c => ({title: c.title, value: c.id})));
      }
    }));
  }

  protected onNext(route: string): void {
    if (this.modelMotorCycleForm().invalid) {
      this.showError.set(true);
      return;
    }
    const model: ApplicationFormMotorPutRequestModel = {
      ...this.storeService.getStoreValueAsPutRequest(),
      vehicleInfo: {
        typeId: this.modelMotorCycleForm().get('model').value.toString(),
        buildYear: this.modelMotorCycleForm().get('buildYear').value.toString()
      }
    };
    super.addSubscription(
      this.motorApiService.putApplicationForm(model as ApplicationFormMotorPutRequestModel).subscribe({
        next: (response) => {
          this.storeService.setStoreData(response.result);
          this.router.navigate([route], {
            relativeTo: this.activatedRoute.parent,
            queryParamsHandling: 'merge'
          }).then();
        }
      })
    );
  }

  protected override onClose(): void {
    this.closeService.close();
  }
}
