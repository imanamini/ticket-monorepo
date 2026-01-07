import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChargePackage, TopUpAmountBase } from '@client-monorepo/applets/top-up';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FascinatingInfoComponent } from '../fascinating-info/fascinating-info.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'top-up-applet-top-up-type-picker',
  standalone: true,
  imports: [
    CommonModule,
    PipesModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    FormsModule,
    FascinatingInfoComponent,
    NgxButtonComponent,
  ],
  templateUrl: './top-up-type-picker.component.html',
  styleUrls: ['./top-up-type-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopUpTypePickerComponent extends TopUpAmountBase implements OnInit {
  isShatelOperator = signal(false);

  constructor(
    private bottomSheetService: NgxBottomSheetService,
    formBuilder: FormBuilder,
  ) {
    super(formBuilder);
    this.data = this.bottomSheetService.data().state;
    if (this.data.operatorId === '4') {
      this.isShatelOperator.set(true);
    }
    this.setAmountValidationRules();
  }

  ngOnInit() {
    this.packages = this.data.packages;
    this.selectDefaultPackage();
    setTimeout(() => {
      this.showTextField = true;
    }, 100);
  }

  continue() {
    let selected = null;
    if (this.mode === 'VARIANT_VALUE') {
      const a = parseInt(this.form.controls['amount'].value);
      if (!a) {
        return;
      }
      selected = {
        amount: a,
        recommended: false,
      } as ChargePackage;
    } else {
      if (!this.selectedAmount) {
        return;
      }
      selected = this.selectedAmount;
    }

    this.bottomSheetService.outputData.set({
      result: {
        selectedAmount: selected,
        isFascinating: this.isFascinating,
        packages: this.packages,
        chargeType: this.isFascinating ? this.getFascinatingPackages()?.chargeType : this.getNormalPackages()?.chargeType,
        title: this.isFascinating ? this.getFascinatingPackageTitle() : this.getNormalPackageTitle(),
      },
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
