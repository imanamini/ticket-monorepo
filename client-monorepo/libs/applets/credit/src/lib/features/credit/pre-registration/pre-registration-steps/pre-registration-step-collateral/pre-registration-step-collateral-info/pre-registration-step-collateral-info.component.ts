import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CreditCollateralOptionModel } from '../credit-collateral-option.model';
import { CreditCollateralInfoModel } from '../credit-collateral-info.model';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@Component({
  selector: 'app-pre-registration-step-collateral-info',
  templateUrl: './pre-registration-step-collateral-info.component.html',
  styleUrls: ['./pre-registration-step-collateral-info.component.scss'],
  standalone: true,
  imports: [PipesModule, NgxDividerComponent, NgxCalloutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationStepCollateralInfoComponent {
  collateralOption = input<CreditCollateralOptionModel>();

  infoMapperItem = input<CreditCollateralInfoModel>();

  showHintMessage = input<boolean>();

  previewStepClicked = output<{ value: string; title: string }>();
  protected readonly BorderColorsEnum = BorderColorsEnum;

  onClick() {
    this.previewStepClicked.emit(this.collateralOption()!);
  }
}
