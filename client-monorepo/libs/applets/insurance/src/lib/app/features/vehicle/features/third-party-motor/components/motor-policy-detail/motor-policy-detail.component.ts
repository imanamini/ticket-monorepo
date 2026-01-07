import { Component, input } from '@angular/core';
import { PriceTransformerPipe } from '../../../../pipes/price-transformer.pipe';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { BorderColorsEnum } from '@digipay/ngx-divider';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { MotorPolicyDetailModel } from '../../data-access/models/motor-policy-detail.model';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'motor-policy-detail',
  standalone: true,
  imports: [
    PriceTransformerPipe,
    NgxTooltipDirective,
    NgxIcon
  ],
  templateUrl: './motor-policy-detail.component.html',
  styleUrl: './motor-policy-detail.component.scss'
})
export class MotorPolicyDetailComponent {
  policyDetail = input.required<MotorPolicyDetailModel>();

  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly IconEnum = IconEnum;
}
