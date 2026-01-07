import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { TgsSelectFeatureResponse } from '../../../data-access/models/tgs-select-feature-response';
import { UserCardHintTooltipService } from './user-card-hint-tooltip.service';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';

@Component({
  selector: 'payment-checkout-user-card-tooltip',
  standalone: true,
  templateUrl: './user-card-tooltip.component.html',
  styleUrls: ['./user-card-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxTooltipDirective],
})
export class UserCardTooltipComponent implements OnInit {
  @Input() info!: TgsSelectFeatureResponse;
  public userCardHintTooltipService = inject(UserCardHintTooltipService);
  public userCardHintText = '';

  ngOnInit() {
    this.userCardHintText = this.userCardHintTooltipService.createText(this.info);
  }
}
