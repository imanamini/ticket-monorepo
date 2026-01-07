import { Component, input, output } from '@angular/core';
import { InsButtonComponent } from '../../../../components/ins-button/ins-button.component';
import { IconEnum } from '../../../../data-access/enums/icon.enum';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../../../data-access/enums/ins-button-size.enum';
import { NgxIcon } from '@digipay/ngx-icon';
import { InsIconComponent } from '../ins-icon/ins-icon.component';
import { RateComponent } from '../rate/rate.component';
import { ProductCardGiftModel } from '../../data-access/models/third-party/available-products/product-card-gift.model';
import { ProductCardModel } from '../../data-access/models/third-party/available-products/product-card.model';

@Component({
  selector: 'plp-card-item',
  standalone: true,
  imports: [
    InsButtonComponent,
    InsIconComponent,
    RateComponent,
    PipesModule,
    NgxIcon,
  ],
  templateUrl: './plp-card-item.component.html',
  styleUrl: './plp-card-item.component.scss'
})
export class PlpCardItemComponent {
  onSelectItem = output<number>({alias: 'select-item'});
  onClickGiftInfo = output<ProductCardGiftModel>({alias: 'gift-info'});

  protected readonly IconEnum = IconEnum;
  readonly item = input.required<ProductCardModel>({alias: 'insurance-card-info'});
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
}
