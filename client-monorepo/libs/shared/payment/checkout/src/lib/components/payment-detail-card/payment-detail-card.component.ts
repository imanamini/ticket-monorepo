import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailCardDataInterface } from '../../data-access/models/detail-card-data.interface';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { FormattedCellNumberPipe, PipesModule } from '@digipay/ng-lib-pipes';
import { IranianRialsPipe } from '@client-monorepo/shared/common/iranian-rials';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { DetailCardEnum } from '../../data-access/models/detail-card.enum';

@Component({
  selector: 'payment-checkout-payment-detail-card',
  standalone: true,
  imports: [CommonModule, ApiImageModule, IranianRialsPipe, PipesModule, NgxPlateComponent],
  templateUrl: './payment-detail-card.component.html',
  styleUrl: './payment-detail-card.component.scss',
  providers: [FormattedCellNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentDetailCardComponent {
  cardData = input.required<DetailCardDataInterface>();
  protected readonly DetailCardEnum = DetailCardEnum;
}
