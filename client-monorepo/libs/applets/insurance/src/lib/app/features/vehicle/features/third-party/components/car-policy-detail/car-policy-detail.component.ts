import { Component, input, signal } from '@angular/core';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { NgClass } from '@angular/common';
import { InsIconComponent } from '../../../../components/ins-icon/ins-icon.component';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { PolicyDetailModel } from '../../data-access/models/policy-detail.model';
import { BorderColorsEnum } from '@digipay/ngx-divider';
import { PriceTransformerPipe } from '../../../../pipes/price-transformer.pipe';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { NgxPlateComponent } from '@digipay/ngx-plate';

@Component({
  selector: 'car-policy-detail',
  standalone: true,
  imports: [
    NgClass,
    InsIconComponent,
    PriceTransformerPipe,
    NgxTooltipDirective,
    NgxPlateComponent
  ],
  templateUrl: './car-policy-detail.component.html',
  styleUrl: './car-policy-detail.component.scss',
  animations: [
    trigger('openClose', [
      state(
        'close',
        style({
          height: '164px'
        })
      ),
      state(
        'open',
        style({
          height: '*'
        })
      ),
      transition('open => close', [animate('0.2s')]),
      transition('close => open', [animate('0.2s')]),
    ])
  ]
})
export class CarPolicyDetailComponent extends BaseComponent {

  constructor() {
    super();
  }

  policyDetail = input<PolicyDetailModel>();
  extended = signal(false);
  protected readonly BorderColorsEnum = BorderColorsEnum;

  protected readonly IconEnum = IconEnum;

  handleClickedExtendedButton(): void {
    this.extended.update(prevValue => !prevValue);
  }

}
