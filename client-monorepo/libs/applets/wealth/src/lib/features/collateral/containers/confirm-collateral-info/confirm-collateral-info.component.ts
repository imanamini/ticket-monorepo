import { Component, inject, OnInit } from '@angular/core';

import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { COLLATERAL_ROUTE, HOME_ROUTE } from '../../../../data-access/constants/app-routes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { AbstractControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { validateNationalId } from '../../../../components/utils/strings';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { ICollateralProcessData } from '../../data-access/models';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CollateralConfirmInfoBottomSheetComponent } from '../../components/collateral-confirm-info-bottom-sheet/collateral-confirm-info-bottom-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';

@Component({
  selector: 'wealth-applet-confirm-collateral-info',
  standalone: true,
  imports: [NgxAppBarComponent, NgxButtonComponent, UiFormFieldBuilderModule, ReactiveFormsModule, NgxCalloutComponent, PipesModule],
  templateUrl: './confirm-collateral-info.component.html',
  styleUrl: './confirm-collateral-info.component.scss',
})
export class ConfirmCollateralInfoComponent implements OnInit {
  calloutMessages: string[] = [];

  unitsController = new FormControl(null, [Validators.required]);
  fullNameController = new FormControl(null, [Validators.required]);
  nationalIdController = new FormControl(null, [Validators.required, this.nationalCodeValidator, Validators.minLength(10)]);
  showError: string;
  errorMessage: string;
  invalidUnits = false;

  state: {
    phoneNumber?: string;
    nationalId?: string;
    maxAmount?: string;
    minAmount?: string;
    coordinatorAction?: string;
    symbol?: string;
    data?: ICollateralProcessData;
  };
  isLoading = false;

  private routeState = inject(RouteStateService);
  private bottomSheet = inject(NgxBottomSheetService);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.state = this.routeState.getAll();
    if (!this.state?.symbol) {
      this.navigationService.navigate([HOME_ROUTE]);
    }

    this.nationalIdController.setValue(this.state.nationalId);
    if (this.state?.data?.fullName?.trim()) {
      this.fullNameController.setValue(this.state.data.fullName);
      this.fullNameController.disable();
    }

    this.calloutMessages = [
      'تا سقف ۵۰ میلیون تومان، اعتبار ۴ قسطه دریافت خواهید کرد.',
      'نداشتن اعتبار ۴ قسطه فعال و یا اقساط معوق از شروط دریافت اعتبار است.',
    ];
    if (this.state && this.state.data) {
      this.unitsController.addValidators([Validators.min(this.state.data.minUnits), Validators.max(this.state.data.maxUnits)]);
    }
  }

  continue() {
    this.isLoading = true;
    this.bottomSheet.openBottomSheet(CollateralConfirmInfoBottomSheetComponent, {
      action: 'submit_form',
      fullName: this.fullNameController.value,
      nationalId: this.state.data.nationalId,
      phoneNumber: this.state.data.phoneNumber,
      date: this.state.data.today,
      units: this.unitsController.value,
      instrumentName: this.state.data.instrumentTitle,
      instrumentNav: this.state.data.instrumentNav,
      symbol: this.state.symbol,
      coordinatorAction: this.state.coordinatorAction,
    });

    const bottomSheetService = this.bottomSheet.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      this.isLoading = false;
    });
  }

  onBackHandler() {
    this.navigationService.navigate([COLLATERAL_ROUTE]);
  }

  nationalCodeValidator(control: AbstractControl): { [s: string]: boolean } {
    if (control.value === null || control.value === '') {
      return { invalidNotionalCode: false };
    }
    if (validateNationalId(control.value)) {
      return null;
    }
    return { invalidNotionalCode: true };
  }
}
